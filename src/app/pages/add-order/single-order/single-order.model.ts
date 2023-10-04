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

export class CustomOrderPayloadMapping {
  channelOrderId = '';
  channelOrderDate = '';
  channel = '';
  fcIds: number[] = [];
  tags: string[] = [];
  customerDetails = {
    firstName: '',
    middleName: null,
    lastName: null,
    gender: null,
    contact: {
      callingCode: '',
      mobileNumber: '',
    },
    alternateContact: {
      callingCode: '',
      mobileNumber: '',
    },
    email: '',
    billingAddress: {
      name: '',
      firstLine: '',
      secondLine: '',
      landmark: '',
      pincode: '',
      city: '',
      state: '',
      country: '',
      contact: {
        callingCode: '',
        mobileNumber: '',
      },
      email: '',
    },
  };
  shippingAddress = {
    name: '',
    firstLine: '',
    secondLine: '',
    landmark: '',
    pincode: '',
    city: '',
    state: '',
    country: '',
    contact: {
      callingCode: '',
      mobileNumber: '',
    },
    email: '',
  };
  paymentStatus = {
    paymentType: '',
    amount: 0,
  };
  items: Array<ProductItemMapping> = [];
  pricingDetails = {
    subTotal: 0,
    discount: 0,
    shippingCharge: 0,
    giftwrapCharge: 0,
    transactionFee: 0,
    otherCharges: 0,
    netAmount: 0,
    taxPercentage: {
      shipping: 0,
      otherCharges: 0,
    },
  };
}

export class ProductItemMapping {
  productDetails = {
    skuId: '',
    name: '',
    category: '',
    hsn: '',
  };
  quantity = 0;
  fcId = [];
  itemPricingDetails = {
    unitPrice: 0,
    discount: 0,
    shippingCost: 0,
    otherCharges: 0,
    taxPercentage: {
      shipping: 0,
      otherCharges: 0,
    },
  };
  channelItemId = '';
}
