import { Component } from '@angular/core';
import { GlobalSearchComponent } from 'src/app/components/global-search/global-search.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [GlobalSearchComponent],
})
export class FooterComponent {}
