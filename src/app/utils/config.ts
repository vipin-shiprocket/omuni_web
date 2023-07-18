import { environment } from 'src/environments/environment';

export const MavenAppConfig = {
  APP_NAME: 'Maven',
  appDomain: 'localhost.in',
  SSH: 'http://',
  Environment: 'testsku.',
  baseUrlSource: 'http://testfrontend.gscmaven.in//api/oms',
  s3: 'https://s3-us-west-2.amazonaws.com/glmetadata/',
  apigatewayoms: 'http://testfrontend.gscmaven.in//api/oms',
  apigatewayauth: 'http://testfrontend.gscmaven.in//api/auth',
  downloadCustomersTemplateUrl:
    'templates/Glaucus_Customer_Bulk_Upload_Template.xls',
  downloadSkuSalesChannelMapTemplateUrl:
    '/omsservices/webapi/saleschannels/skusaleschannelmapuploadtemplate',
  downloadSkuTemplateUrl: 'templates/Glaucus_SKU_Bulk_Upload_Template.xls',
  downloadVendorsTemplateUrl:
    'templates/Glaucus_Vendor_Bulk_Upload_Template.xls',
  commonPathUrl: '/omsservices/webapi/common/file?path=',
  downloadOrderTemplateUrl: '/omsservices/webapi/orders/bulkuploadtemplate',
  downloadPOTemplateUrl: 'templates/Glaucus_PO_Bulk_Upload_Template.xls',
  downloadSTOTemplateUrl:
    '/omsservices/webapi/stock/transfer/gettemplateforstocktransfer',
  downloadMastersTemplateUrl:
    'templates/Glaucus_Masters_SKU_Customer_Vendor_Bulk_Upload_Template.xls',
  downloadBulkCancelTemplateUrl:
    'templates/Glaucus_Sale_Order_Bulk_Cancel_Template.xls',
  filePathUrl: '/omsservices/webapi/saleschannels/file?path=',
  formsUrl: 'forms/',
  downloadAWBTemplateUrl: 'templates/Glaucus_Awb_Bulk_Upload_Template.xls',
  authApiUrl: '',

  setUrls(url: string, callback: () => void) {
    this.baseUrlSource = url + '/api/oms';
    this.apigatewayoms = url + '/api/oms';
    this.apigatewayauth = url + '/api/auth';
    if (environment.production) {
      //Todo: Backend Issue .resolve it and then uncomment it.
      // MavenAppConfig.authApiUrl =  MavenAppConfig.SSH +"auth." + MavenAppConfig.appDomain+"/api/auth";
      this.authApiUrl = this.apigatewayauth;
    } else {
      this.authApiUrl = this.apigatewayauth;
    }
    callback();
  },
};
