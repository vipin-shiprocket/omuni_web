import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LayoutService } from '../layout.service';
import { OPTIONS } from './global-search.model';

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss'],
})
export class GlobalSearchComponent implements OnInit {
  @ViewChild('searchInput')
  searchInput!: ElementRef<HTMLInputElement>;
  layoutService = inject(LayoutService);
  document = document;
  OPTIONS = OPTIONS;
  options: string[] = [];
  active = '/';
  selected = false;

  ngOnInit(): void {
    this.layoutService.userPrefs.subscribe((data) => {
      if (!data) return;

      this.options = Object.keys(OPTIONS).filter((key) =>
        data.sidebarItems.includes(key),
      );
    });
  }

  @HostListener('document:keydown.control./')
  focusSearch() {
    this.searchInput.nativeElement.focus();
  }
}
