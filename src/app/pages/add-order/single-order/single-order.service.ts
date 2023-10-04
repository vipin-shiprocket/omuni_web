import { Injectable, inject } from '@angular/core';
import { EnumTabStatus, TabListSingleOrder } from '../add-order.model';
import { BehaviorSubject } from 'rxjs';
import {
  CustomOrderPayloadMapping,
  IBuyerDetail,
  IOrderDetail,
  IProduct,
  ProductItemMapping,
} from './single-order.model';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class SingleOrderService {
  private http = inject(HttpService);
  tabs = TabListSingleOrder;
  currentTab = 0;
  orderDetailDump = new BehaviorSubject<{
    buyer?: IBuyerDetail;
    order?: IOrderDetail;
  } | null>(null);

  onTabChange(context: 'next' | 'prev') {
    if (context === 'next') {
      this.currentTab++;
    } else {
      this.currentTab--;
    }

    this.updateTabDetails();
  }

  updateTabDetails() {
    this.tabs.forEach((tab, idx) => {
      if (idx >= this.currentTab) {
        tab.status = EnumTabStatus.pristine;
      } else {
        tab.status = EnumTabStatus.done;
      }
    });
  }

  addSingleOrder(params: CustomOrderPayloadMapping) {
    const endpoint = '';
    return this.http.requestToEndpoint<unknown>(endpoint, params);
  }

  updatePayloadMapping() {
    const c = new CustomOrderPayloadMapping();
    const { buyer, order } = this.orderDetailDump.value ?? {};

    if (buyer) {
      c.fcIds = buyer.pickupAddr ? [buyer.pickupAddr] : [];
      c.customerDetails.firstName = buyer.shipping.fullname;
      c.customerDetails.contact.mobileNumber = buyer.shipping.phone?.toString();
      c.customerDetails.email = buyer.shipping.email;
      c.customerDetails.contact.callingCode = buyer.shipping.callingCode;
      c.customerDetails.alternateContact.mobileNumber =
        buyer.shipping.altPhone?.toString();
      c.customerDetails.billingAddress.firstLine = buyer.shipping.companyAddr;
      c.customerDetails.billingAddress.pincode =
        buyer.shipping.pincode?.toString();

      c.shippingAddress.landmark = buyer.shipping.landmark;
      c.shippingAddress.name =
        buyer.shipping.shippingName ?? buyer.shipping.fullname;
      c.shippingAddress.email =
        buyer.shipping.shippingEmail ?? buyer.shipping.email;
      c.shippingAddress.contact.mobileNumber =
        buyer.shipping.shippingPhone ?? buyer.shipping.phone;
      c.shippingAddress.contact.callingCode = buyer.shipping.callingCode;
      c.shippingAddress.firstLine = buyer.shipping.companyAddr;
      c.shippingAddress.pincode = buyer.shipping.pincode?.toString();
      c.shippingAddress.city = buyer.shipping.city;
      c.shippingAddress.state = buyer.shipping.state;
      c.shippingAddress.country = buyer.shipping.country;

      c.customerDetails.billingAddress.name = buyer.billing.fullname;
      c.customerDetails.billingAddress.email = buyer.billing.email;
      c.customerDetails.billingAddress.contact.callingCode =
        buyer.shipping.callingCode;
      c.customerDetails.billingAddress.contact.mobileNumber =
        buyer.billing.phone?.toString();
      c.customerDetails.billingAddress.firstLine = buyer.billing.companyAddr;
      c.customerDetails.billingAddress.landmark = buyer.billing.landmark;
      c.customerDetails.billingAddress.pincode =
        buyer.billing.pincode?.toString();
      c.customerDetails.billingAddress.city = buyer.billing.city;
      c.customerDetails.billingAddress.state = buyer.billing.state;
      c.customerDetails.billingAddress.country = buyer.billing.country;
    }

    if (order) {
      c.channelOrderId = order?.channelOrderId;
      c.channelOrderDate = order.channelOrderDate;
      c.channel = order.channel[0];
      c.tags = order.tags;
      c.items = this.updateProductItemsMapping(order.items);
      c.paymentStatus.paymentType = order.paymentType;
      c.pricingDetails.shippingCharge = order.shippingCharge;
      c.pricingDetails.giftwrapCharge = order.giftwrapCharge;
      c.pricingDetails.transactionFee = order.transactionFee;
      c.pricingDetails.discount = order.discount;
      c.pricingDetails.subTotal = order.subTotal;
      c.pricingDetails.otherCharges = order.otherCharges;
      c.pricingDetails.discount = order.discount;
      c.pricingDetails.netAmount = order.netAmount;
    }

    return c;
  }

  updateProductItemsMapping(items: IProduct[]): Array<ProductItemMapping> {
    return items.map((item) => {
      const mapping = new ProductItemMapping();
      mapping.productDetails.name = item.name;
      mapping.productDetails.skuId = item.skuId;
      mapping.productDetails.category = item.category;
      mapping.productDetails.hsn = item.hsn;
      mapping.itemPricingDetails.discount = item.discount;
      mapping.itemPricingDetails.unitPrice = item.unitPrice;
      mapping.quantity = item.quantity;
      mapping.itemPricingDetails.taxPercentage.otherCharges = item.taxRate;

      return mapping;
    });
  }
}
