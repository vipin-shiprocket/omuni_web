import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimations } from '@angular/platform-browser/animations';

import { provideToastr } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, RecaptchaV3Module],
  providers: [
    provideAnimations(), // required animations providers
    provideToastr(),
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.RECAPTCHA_SITE_KEY,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
