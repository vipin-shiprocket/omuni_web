import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from './inventory.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent {
  private inventoryService = inject(InventoryService);
}
