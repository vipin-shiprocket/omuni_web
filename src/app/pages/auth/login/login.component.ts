import { Component, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SubSink } from 'subsink';
import { HttpService } from 'src/app/services/http.service';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { firstValueFrom } from 'rxjs';
import {
  AuthenticateResp,
  IVerifyEmailResp,
  TFindUserResp,
} from '../auth.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { MavenAppConfig } from 'src/app/utils/config';

interface IUserForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    MatIconModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    MatButtonModule,
  ],
  providers: [HttpService, ReCaptchaV3Service, LocalStorageService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {
  @ViewChild('emailError') emailErrorTemplate!: TemplateRef<HTMLElement>;
  private subs = new SubSink();
  userForm: FormGroup<IUserForm>;
  varificationCallSecondTime = false;
  userClientsList: TFindUserResp = [];
  isClientSelected = false;
  hideClientsList = false;

  constructor(
    private http: HttpService,
    private toastr: ToastrService,
    private recaptchaService: ReCaptchaV3Service,
    private dialog: MatDialog,
    private $localStorage: LocalStorageService,
  ) {
    this.userForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
    });
  }

  ctrlByName(ctrlName: string): AbstractControl {
    return this.userForm.get(ctrlName) as AbstractControl;
  }

  async isUserVerified() {
    if (this.userForm.invalid) {
      return;
    }

    // check for reCaptcha response
    // check for domains
    const { subdomain } = this.getDomainNSubdomain();
    if (!subdomain) {
      this.showSubDomainErr();
      return;
    }

    // hit api request
    const baseUrl = environment.apigatewayauth;
    const endpoint = '/authservice/webapi/user';
    const { email } = this.userForm.value;
    const params = {
      emailId: encodeURIComponent(email ?? ''),
      token: '',
    };

    const recaptcha$ = this.recaptchaService.execute('verify_email');
    const recaptchaToken = await firstValueFrom(recaptcha$);
    params.token = recaptchaToken;

    this.subs.sink = this.http
      .requestByUrl<IVerifyEmailResp | string>(baseUrl + endpoint, params)
      .subscribe({
        next: (resp) => {
          console.log('🚀 ~ isUserVerified ~ resp:', resp);
          const stringType = typeof resp === 'string' ? resp : null;
          const userData = typeof resp !== 'string' ? resp : null;

          if (userData?.tableUserIsEmailVerified) {
            //chck domain exist or not
            this.getClients(userData.idtableUserId, email);
          } else if (
            userData?.idtableUserId &&
            !userData?.tableUserIsEmailVerified
          ) {
            this.showEmailError();
          } else if (stringType?.includes('This session has been expired')) {
            if (!this.varificationCallSecondTime) {
              this.varificationCallSecondTime = true;
              this.isUserVerified();
            } else {
              this.toastr.error('Please try again.', 'Error');
            }
          } else {
            this.toastr.error(
              'You are not a maven user. Please contact to your admin',
              'Error',
            );
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  showSubDomainErr() {
    this.toastr.info(
      'Subdomain is now mandatory to access Maven. Use the URL in the following format : https://<yoursubdomain>.gscmaven.com . For any assistance contact Maven team.',
      'Information',
      {
        closeButton: true,
        disableTimeOut: true,
        positionClass: 'toast-top-center',
        toastClass: 'ngx-toastr mt-3 w-50',
      },
    );
  }

  getClients(idtableUserId: number, email: string | null | undefined) {
    this.$localStorage.set('user_Eamil', email ?? '');
    this.$localStorage.set('idtableUserId', idtableUserId.toString());

    const baseUrl = environment.apigatewayauth;
    const endpoint = '/authservice/webapi/client/find';
    const params = {
      userid: idtableUserId,
    };

    this.subs.sink = this.http
      .requestByUrl<TFindUserResp>(baseUrl + endpoint, params)
      .subscribe({
        next: (response) => {
          this.userClientsList = response;
          const { subdomain, domain } = this.getDomainNSubdomain();
          const whiteListSubDomains = ['wms', 'stagingwms', 'srfwms'];

          if (subdomain && whiteListSubDomains.includes(subdomain)) {
            this.getMulticlientwarehouses();
            return;
          } else {
            this.$localStorage.set('isMultipleClientInOneWarehouse', 'false');
          }

          if (subdomain) {
            for (const client of this.userClientsList) {
              if (
                client.tableClientDomain === subdomain ||
                client.tableClientDomainAlias === subdomain
              ) {
                this.$localStorage.set(
                  'selectedClient',
                  JSON.stringify(client),
                );

                this.isClientSelected = true;
                this.hideClientsList = true;
                if (this.isClientSelected) {
                  this.ctrlByName('password').enable();
                }
                return;
              }
            }

            //chck existing domain client also exist or not
            if (!this.isClientSelected) {
              this.showSubDomainErr();
              return;
            } else {
              window.location = (MavenAppConfig.SSH +
                domain +
                '/#/login/' +
                email +
                '/' +
                idtableUserId) as unknown as Location;
              return;
            }
          } else {
            if (this.userClientsList.length === 1) {
              this.$localStorage.set(
                'selectedClient',
                JSON.stringify(this.userClientsList[0]),
              );
              let baseUrl;
              if (domain.includes('localhost')) {
                baseUrl =
                  MavenAppConfig.SSH +
                  MavenAppConfig.Environment +
                  MavenAppConfig.appDomain;
              } else
                baseUrl =
                  MavenAppConfig.SSH +
                  (subdomain ? subdomain + '.' : '') +
                  MavenAppConfig.appDomain;

              MavenAppConfig.setUrls(baseUrl, () => {
                window.location = (MavenAppConfig.SSH +
                  response[0].tableClientDomain +
                  '.' +
                  domain +
                  '/#/login/' +
                  email +
                  '/' +
                  idtableUserId) as unknown as Location;
              });
            }
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  getMulticlientwarehouses() {
    const baseUrl = MavenAppConfig.apigatewayauth;
    const endpoint = '/authservice/webapi/login/multiclientwarehouses';
    const { email } = this.userForm.value;
    const params = {
      username: email,
    };

    this.subs.sink = this.http
      .requestByUrl<Record<string, unknown>>(baseUrl + endpoint, params)
      .subscribe({
        next: (result) => {
          if (this.userClientsList?.length) {
            this.$localStorage.set(
              'selectedClient',
              JSON.stringify(this.userClientsList[0]),
            );

            this.isClientSelected = true;
            this.hideClientsList = true;
            if (this.isClientSelected) {
              this.ctrlByName('password').enable();
            }
            /**
             * Special case for WMS Multiple Client in one warehouse
             * so we need to send data in below route because data contains
             * tableCommonWarehouseDetails object
             * so set this whole array in cookies as warehouseList
             * and in home.controller
             * @type {string}
             */
            this.$localStorage.set('isMultipleClientInOneWarehouse', 'true');
            this.$localStorage.set(
              'warehouseList',
              JSON.stringify(result['data']),
            );
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  showEmailError() {
    this.dialog.open(this.emailErrorTemplate, {
      maxWidth: '50vw',
    });
  }

  resendActivationLink() {
    const baseUrl = environment.apigatewayauth;
    const endpoint = '/authservice/webapi/login/resend';
    const { email } = this.userForm.value;
    const params = {
      emailId: encodeURIComponent(email ?? ''),
    };

    this.subs.sink = this.http
      .requestByUrl(baseUrl + endpoint, params)
      .subscribe({
        next: (response) => {
          if (response === true) {
            this.toastr.success(
              'Activation link has been sent successfully to your email address provided during registration.',
              'Success',
            );
          }
        },
        error: (err) => {
          console.error(err);
          if (err.status == 400) {
            this.toastr.error(err.errorMessage, 'Error');
          } else if (err.status == 401) {
            this.toastr.error(
              'Your Email ID or Password might be incorrect.',
              'Error',
            );
          } else {
            this.toastr.error('Failed to send mail', 'Error');
          }
        },
      });
  }

  getDomainNSubdomain() {
    let subdomain = '';
    let domain = '';
    const host = window.location.host;
    const parts = host.split('.');
    const isWWW = parts[0] === 'www';
    if (!isWWW) {
      if (parts.length === 2) {
        subdomain = '';
        domain = `${parts[0]}.${parts[1]}`;
      } else if (parts.length === 3) {
        subdomain = parts[0];
        domain = `${parts[1]}.${parts[2]}`;
      }
    } else {
      if (parts.length === 3) {
        subdomain = '';
        domain = `${parts[1]}.${parts[2]}`;
      } else if (parts.length === 4) {
        subdomain = parts[0];
        domain = `${parts[2]}.${parts[3]}`;
      }
    }
    return { domain, subdomain };
  }

  async login() {
    const baseUrl = environment.apigatewayauth;
    const endpoint = '/authservice/webapi/login/authenticate';
    const { email, password } = this.userForm.value;
    const data = {
      email,
      password,
      token: '',
    };

    const recaptcha$ = this.recaptchaService.execute('login');
    const recaptchaToken = await firstValueFrom(recaptcha$);
    data.token = recaptchaToken;

    const body = new URLSearchParams(data as Record<string, string>).toString();
    const header = this.http.getHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    this.subs.sink = this.http
      .postByUrl<AuthenticateResp>(baseUrl + endpoint, body, {}, header)
      .subscribe({
        next: (resp) => {
          console.log('🚀 ~ this.subs.sink=this.http.postByUrl ~ resp:', resp);
          // this.$localStorage.set('loggedInUser', JSON.stringify(resp));
          // $localStorage.loggedInUser = data;
          // if (data.status == 401) {
          //   $scope.notify(
          //     'Your email address or password might be incorrect.',
          //     'danger',
          //   );
          // } else if (data && data.tableUserIsEmailVerified == false) {
          //   $('#loginError').modal('show');
          // } else if (
          //   data &&
          //   data.tableUserStatusType &&
          //   data.tableUserStatusType.idtableUserStatusTypeId != 1
          // ) {
          //   $scope.notify(
          //     'Your account is not active. Please contact admin.',
          //     'danger',
          //   );
          // } else if (
          //   data &&
          //   data.tableUserStatusType &&
          //   data.tableUserStatusType.idtableUserStatusTypeId == 1 &&
          //   data.tableUserIsEmailVerified
          // ) {
          //   $cookies.put('username', data.tableUserFirstName);
          //   $cookies.put('userphone', data.tableUserPhoneNo);
          //   $cookies.put('userfullname', data.tableFullName);
          //   $cookies.put('useremail', data.tableUserEmailId);
          //   $cookies.put('isLoggedIn', true);
          //   $localStorage.isUserLoggedIn = true;
          //   data.tableClient
          //     ? $cookies.put('timezone', data.tableClient.tableClientTimeZone)
          //     : null;
          //   /*headerService.getMenuData(function (menu) {
          //                     $rootScope.menu=menu;
          //                 });*/
          //   if (
          //     $scope.subdomain == 'wms' ||
          //     $scope.subdomain == 'stagingwms' ||
          //     $scope.subdomain == 'srfwms'
          //   ) {
          //     /**
          //      * Special case for WMS Multiple Client in one warehouse
          //      * so we need to send data in below route because data contains
          //      * tableCommonWarehouseDetails object
          //      * so set this whole array in cookies as warehouseList
          //      * and in home.controller
          //      * @type {string}
          //      */
          //     window.location = window.location.origin + '/wms/#/home';
          //   } else {
          //     $state.go('/apps');
          //   }
          // } else if (data.errorMessage) {
          //   $scope.notify(data.errorMessage);
          // } else {
          //   $scope.notify('Error occurred! Please contact admin.');
          // }
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Error while login in, Please try again', 'Error');
        },
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
