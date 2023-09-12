import { Component } from '@angular/core';
import { GlobalSearchComponent } from '../global-search/global-search.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [GlobalSearchComponent, MatIconModule],
})
export class FooterComponent {}
