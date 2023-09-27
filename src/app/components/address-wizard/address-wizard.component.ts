import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Observable, Subject, filter, fromEvent, of, tap } from 'rxjs';
import { SubSink } from 'subsink';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OnlyNumbersDirective } from 'src/app/utils/only-numbers.directive';

const AvailableAddress = [
  {
    label: 'Home',
    value: 'home',
  },
  {
    label: 'Work',
    value: 'work',
  },
  {
    label: 'Warehouse',
    value: 'warehouse',
  },
  {
    label: 'Other',
    value: 'other',
  },
];

@Component({
  selector: 'app-address-wizard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    OnlyNumbersDirective,
  ],
  templateUrl: './address-wizard.component.html',
  styleUrls: ['./address-wizard.component.scss'],
})
export class AddressWizardComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private subs = new SubSink();
  @ViewChild('offcanvasBtn') btn!: ElementRef<HTMLButtonElement>;
  @ViewChild('addressWizard') address!: ElementRef<HTMLDivElement>;
  @Input() showWizard!: Subject<boolean>;
  availableAddress = AvailableAddress;
  addressForm: FormGroup;

  constructor() {
    this.addressForm = new FormGroup({
      address_tag: new FormControl(),
      other_address_tag: new FormControl(),
      name: new FormControl(),
      phone: new FormControl(null, [
        Validators.maxLength(10),
        Validators.minLength(10),
      ]),
      email: new FormControl(null, [Validators.email]),
      alternate_phone: new FormControl(null, [
        Validators.maxLength(10),
        Validators.minLength(10),
      ]),
      complete_address: new FormControl(),
      landmark: new FormControl(),
      pincode: new FormControl(),
      city: new FormControl(),
      state: new FormControl(),
      country: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.subs.sink = this.showWizard.subscribe((showBtnStatus) => {
      if (showBtnStatus) {
        this.btn.nativeElement.click();
      }
    });
  }

  ngAfterViewInit(): void {
    this.subs.sink = fromEvent(
      this.address.nativeElement,
      'hide.bs.offcanvas',
    ).subscribe(() => {
      this.showWizard.next(false);
      this.addressForm.reset();
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
