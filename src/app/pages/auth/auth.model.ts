export interface IVerifyEmailResp {
  idtableUserId: number;
  isSelf: null | boolean;
  sessionid: null | string;
  tableClient: null | IFindUser;
  tableFullName: string;
  tableUserContext: number;
  tableUserEmailId: string;
  tableUserFirstName: string;
  tableUserIsDeleted: 0 | 1;
  tableUserIsEmailVerified: boolean;
  tableUserIsFirstTime: boolean;
  tableUserLastName: string;
  tableUserOTP: null | number;
  tableUserPassword: null | string;
  tableUserPhoneNo: string;
  tableUserStatusType: {
    idtableUserStatusTypeId: number;
    tableUserStatusTypeString: 'Active'; // Todo: add other types
  };
  tableUserUserId: string;
  userRole: IRole;
}

export type AuthenticateResp = Partial<IVerifyEmailResp>;

export type IRole = 'ROLE_API' | 'ADMIN'; // Todo: add other types

export interface IFindUser {
  idtableClientId: number;
  tableClientCompanyName: string;
  tableClientCreatedOn: string;
  tableClientDomain: string;
  tableClientDomainAlias: null | string;
  tableClientIsFirstTime: boolean;
  tableClientOnboarding: boolean;
  tableClientStatusType: {
    idtableClientStatusTypeId: number;
    tableClientStatusTypeString: 'Active'; // Todo: add other types
  };
  idtableClientStatusTypeId: number;
  tableClientStatusTypeString: 'Active'; // Todo: add other types
  tableClientSystemNo: string;
  tableClientTimeZone: string;
}

export type TFindUserResp = IFindUser[];
export interface IErrorResp {
  status: number;
  errorMessage?: string;
}

export const PasswordPattern = new RegExp(
  '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{8,14}$',
);
