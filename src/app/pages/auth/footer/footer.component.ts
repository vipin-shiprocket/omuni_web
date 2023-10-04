import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<HTMLElement>;
  name = {
    tnc: 'Terms of Service',
    pp: 'Privacy Policy',
  };

  content: Record<string, { heading: string; src: string }> = {
    'Terms of Service': {
      heading: 'Terms of Service',
      src: this.safeUrl('src/assets/pdf/Maven+Terms+of+Service.pdf#view=FitH'),
    },
    'Privacy Policy': {
      heading: 'Privacy Policy',
      src: this.safeUrl('src/assets/pdf/MavenPrivacy+Policy.pdf#view=FitH'),
    },
  };

  constructor(
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
  ) {}

  openDialog(context: string) {
    this.dialog.open(this.dialogTemplate, {
      width: '80%',
      minHeight: '90%',
      data: this.content[context],
    });
  }

  safeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url) as string;
  }
}
