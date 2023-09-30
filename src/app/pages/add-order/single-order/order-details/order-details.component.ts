import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { SingleOrderService } from '../single-order.service';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SubSink } from 'subsink';
import { merge } from 'rxjs';
import { generate10DigitRndNum } from 'src/app/utils/utils';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OrderDetailsComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  showOrderTag = false;
  showShippingCharges = false;
  orderDetailForm: FormGroup;
  existingTags: string[] = ['angular', 'how-to', 'tutorial', 'accessibility'];

  constructor(
    private soService: SingleOrderService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {
    this.orderDetailForm = this.fb.group({
      channelOrderId: [generate10DigitRndNum(), [Validators.required]],
      channelOrderDate: ['', [Validators.required]],
      channel: [[], [Validators.required]],
      tags: [[]],
      items: this.fb.array([this.addNewProduct()]),
      paymentType: ['', [Validators.required]],
      shippingCharge: [null],
      transactionFee: [null],
      discount: [null],
      giftwrapCharge: [null],
      subTotal: [0],
      otherCharges: [0],
      netAmount: [0],
    });
  }

  addNewProduct() {
    return this.fb.group({
      name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      unitPrice: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      hsn: [''],
      discount: [''],
      taxRate: [''],
      skuId: [''],
    });
  }

  ngOnInit(): void {
    this.calculateSubTotal();
    this.calculateOtherCharges();
    this.calculateNetAmount();
    this.fillOrderForm();
  }

  fillOrderForm() {
    const { order } = this.soService.orderDetailDump.value ?? {};
    if (!order) return;

    this.orderDetailForm.patchValue(order);
  }

  calculateNetAmount() {
    const subTotalCtrl = this.ctrlByName('subTotal');
    const otherChargesCtrl = this.ctrlByName('otherCharges');
    const discountCtrl = this.ctrlByName('discount');

    this.subs.sink = merge(
      subTotalCtrl.valueChanges,
      otherChargesCtrl.valueChanges,
      discountCtrl.valueChanges,
    ).subscribe(() => {
      const sum =
        subTotalCtrl.value + otherChargesCtrl.value - discountCtrl.value;
      this.ctrlByName('netAmount').patchValue(sum);
    });
  }

  calculateSubTotal() {
    this.subs.sink = this.items.valueChanges.subscribe((itemsControl) => {
      const priceArr: number[] = itemsControl.map(
        (item: Record<string, string>) => {
          return +item['unitPrice'] * +item['quantity'] - +item['discount'];
        },
      );

      const sum = priceArr.reduce((a, b) => a + b);
      this.ctrlByName('subTotal').patchValue(sum);
    });
  }

  calculateOtherCharges() {
    const shippingCtrl = this.ctrlByName('shippingCharge');
    const transactionCtrl = this.ctrlByName('transactionFee');
    const giftCtrl = this.ctrlByName('giftwrapCharge');

    this.subs.sink = merge(
      shippingCtrl.valueChanges,
      transactionCtrl.valueChanges,
      giftCtrl.valueChanges,
    ).subscribe(() => {
      const sum = shippingCtrl.value + transactionCtrl.value + giftCtrl.value;
      this.ctrlByName('otherCharges').patchValue(sum);
    });
  }

  addAnotherProduct() {
    const items = this.orderDetailForm.get('items') as FormArray;
    items.push(this.addNewProduct());
  }

  ctrlByName(ctrlName: string): AbstractControl {
    return this.orderDetailForm.get(ctrlName) as AbstractControl;
  }

  get items(): FormArray {
    return this.orderDetailForm.get('items') as FormArray;
  }

  onClickBack() {
    this.updateDump();
    this.soService.onTabChange('prev');
  }

  updateDump() {
    const dump = this.soService.orderDetailDump.value ?? {};
    dump['order'] = this.orderDetailForm.value;
    this.soService.orderDetailDump.next(dump);
  }

  updateQuantity(index: number, action: 'add' | 'sub') {
    const item = this.items.controls[index];
    const qty = +item?.value?.quantity;
    if (action === 'add') {
      item.patchValue({ quantity: qty + 1 });
    }

    if (action === 'sub' && qty > 0) {
      item.patchValue({ quantity: qty - 1 });
    }
  }

  deleteItem(idx: number) {
    const items = this.ctrlByName('items') as FormArray;
    if (items.length === 1) {
      this.toastr.info('Minimum one product is required', 'Info');
      return;
    }
    items.removeAt(idx);
  }

  onSubmit() {
    if (this.orderDetailForm.invalid) {
      this.orderDetailForm.markAllAsTouched();
      this.toastr.error(
        'Fields are missing in the form, Please check',
        'Error',
      );
      return;
    }

    this.updateDump();
    console.log(this.soService.orderDetailDump.value);
  }

  onUpdateTags(tags: string[]) {
    this.ctrlByName('tags').patchValue(tags);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
