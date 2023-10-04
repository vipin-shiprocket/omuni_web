import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { FooterComponent } from 'src/app/pages/layout/footer/footer.component';
import { HeaderComponent } from 'src/app/pages/layout/header/header.component';
import { SidebarComponent } from 'src/app/pages/layout/sidebar/sidebar.component';

@NgModule({
  declarations: [LayoutComponent],
  imports: [
    CommonModule,
    FooterComponent,
    HeaderComponent,
    LayoutRoutingModule,
    MatSidenavModule,
    SidebarComponent,
  ],
})
export class LayoutModule {}
