import { Component } from '@angular/core';
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
  ],
  providers: [HttpService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private subs = new SubSink();
  userForm: FormGroup<IUserForm>;

  constructor(
    private http: HttpService,
    private toastr: ToastrService,
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

  isUserVerified() {
    if (this.userForm.invalid) {
      return;
    }

    // check for reCaptcha response
    // check for domains
    const { subdomain } = this.getDomainNSubdomain();
    if (!subdomain) {
      this.toastr.info(
        'Subdomain is now mandatory to access Maven. Use the URL in the following format : https://<yoursubdomain>.gscmaven.com . For any assistance contact Maven team.',
        'Information',
      );
      return;
    }

    // hit api request
    const baseUrl = environment.apigatewayauth;
    const endpoint = '/authservice/webapi/user';
    const { email } = this.userForm.value;
    const params = {
      emailId: encodeURIComponent(email ?? ''),
    };

    this.subs.sink = this.http
      .requestByUrl(baseUrl + endpoint, params)
      .subscribe(
        (resp) => {
          console.log('🚀 ~ isUserVerified ~ resp:', resp);
        },
        (err) => {
          console.error(err);
        },
      );
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
}
