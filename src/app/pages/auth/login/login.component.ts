import { Component, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SubSink } from 'subsink';
import { HttpService } from 'src/app/services/http.service';
// import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { firstValueFrom } from 'rxjs';
import {
  AuthenticateResp,
  IErrorResp,
  IVerifyEmailResp,
  TFindUserResp,
} from '../auth.model';
import { MatDialog } from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { MavenAppConfig } from 'src/app/utils/config';
import { AuthService } from 'src/app/services/auth.service';
import { toggleEye } from 'src/app/utils/utils';

interface IUserForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-login',
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
  toggle = toggleEye;

  constructor(
    private http: HttpService,
    private toastr: ToastrService,
    private recaptchaService: ReCaptchaV3Service,
    private dialog: MatDialog,
    private $localStorage: LocalStorageService,
    private authService: AuthService,
    private router: Router,
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
    const { subdomain } = this.authService.getDomainNSubdomain();
    if (!subdomain) {
      this.showSubDomainErr();
      return;
    }

    // hit api request
    // const baseUrl = environment.apigatewayauth;
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
      .requestToEndpoint<IVerifyEmailResp | string>(endpoint, params)
      .subscribe({
        next: (resp) => {
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

  async getClients(idtableUserId: number, email: string | null | undefined) {
    this.$localStorage.set('user_Eamil', JSON.stringify(email) ?? '');
    this.$localStorage.set('idtableUserId', idtableUserId.toString());

    const recaptcha$ = this.recaptchaService.execute('find_id');
    const recaptchaToken = await firstValueFrom(recaptcha$);

    // const baseUrl = environment.apigatewayauth;
    const endpoint = '/authservice/webapi/client/find';
    const params = {
      userid: idtableUserId,
      token: recaptchaToken,
    };

    this.subs.sink = this.http
      .requestToEndpoint<TFindUserResp>(endpoint, params)
      .subscribe({
        next: (response) => {
          this.userClientsList = response;
          const { subdomain, domain } = this.authService.getDomainNSubdomain();
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
    // const baseUrl = MavenAppConfig.apigatewayauth;
    const endpoint = '/authservice/webapi/login/multiclientwarehouses';
    const { email } = this.userForm.value;
    const params = {
      username: email,
    };

    this.subs.sink = this.http
      .requestToEndpoint<Record<string, unknown>>(endpoint, params)
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
    // const baseUrl = environment.apigatewayauth;
    const endpoint = '/authservice/webapi/login/resend';
    const { email } = this.userForm.value;
    const params = {
      emailId: encodeURIComponent(email ?? ''),
    };

    this.subs.sink = this.http.requestToEndpoint(endpoint, params).subscribe({
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

  async login() {
    // const baseUrl = environment.apigatewayauth;
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
      .postToEndpint<AuthenticateResp | IErrorResp>(endpoint, body, {}, header)
      .subscribe({
        next: (resp) => {
          const authResponse = resp as AuthenticateResp;
          const errResponse = resp as IErrorResp;

          // $localStorage.loggedInUser = data;
          if (errResponse?.status === 401) {
            this.toastr.error(
              'Your email address or password might be incorrect.',
              'Error',
            );
          } else if (errResponse?.errorMessage) {
            this.toastr.error(errResponse?.errorMessage, 'Error');
          } else if (authResponse?.tableUserIsEmailVerified === false) {
            this.showEmailError();
          } else if (
            authResponse?.tableUserStatusType &&
            authResponse?.tableUserStatusType?.idtableUserStatusTypeId !== 1
          ) {
            this.toastr.error(
              'Your account is not active. Please contact admin.',
              'danger',
            );
          } else if (
            authResponse.tableUserStatusType &&
            authResponse.tableUserStatusType.idtableUserStatusTypeId === 1 &&
            authResponse.tableUserIsEmailVerified
          ) {
            this.authService.setCookies(authResponse);
            this.$localStorage.set('isUserLoggedIn', 'true');
            this.$localStorage.set('loggedInUser', JSON.stringify(resp));
            const { subdomain } = this.authService.getDomainNSubdomain();
            if (['wms', 'stagingwms', 'srfwms'].includes(subdomain)) {
              /**
               * Special case for WMS Multiple Client in one warehouse
               * so we need to send data in below route because data contains
               * tableCommonWarehouseDetails object
               * so set this whole array in cookies as warehouseList
               * and in home.controller
               * @type {string}
               */
              window.location = (window.location.origin +
                '/wms/#/home') as unknown as Location;
            } else {
              this.router.navigate(['/apps']);
            }
          } else {
            this.toastr.error('Error occurred! Please contact admin.');
          }
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Error while login in, Please try again', 'Error');
        },
      });
  }

  onSubmit() {
    const isPwdDisabled = this.ctrlByName('password').disabled;
    if (isPwdDisabled) {
      this.isUserVerified();
    } else {
      this.login();
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
