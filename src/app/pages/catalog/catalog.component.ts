import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogService } from './catalog.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
})
export class CatalogComponent {
  private catalogService = inject(CatalogService);
}
