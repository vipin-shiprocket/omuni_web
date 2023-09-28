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
  shipping: IShippingDetail;
}
