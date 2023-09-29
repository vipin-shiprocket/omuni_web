export interface IDetail {
  phone: number;
  fullname: string;
  email: string;
  companyAddr: string;
  landmark: string;
  pincode: number;
  city: string;
  state: string;
  country: string;
  callingCode: string;
}

export interface IShippingDetail extends IDetail {
  altPhone: number;
  companyName: string;
  companyGstin: string;
  shippingName: string;
  shippingPhone: string;
  shippingEmail: string;
}

export interface IBuyerDetail {
  billing: IDetail;
  pickupAddr: number | null;
  shippingIsBilling: boolean | null;
  shipping: IShippingDetail;
}

export interface IOrderDetail {
  channelOrderId: string;
  channelOrderDate: string;
  channel: string[];
  tags: string[];
  items: IProduct[];
  paymentType: string;
  shippingCharge: number;
  transactionFee: number;
  discount: number;
  giftwrapCharge: number;
  subTotal: number;
  otherCharges: number;
  netAmount: number;
}

export interface IProduct {
  name: string;
  category: string;
  unitPrice: number;
  quantity: number;
  hsn: string;
  discount: number;
  taxRate: number;
  skuId: string;
}
