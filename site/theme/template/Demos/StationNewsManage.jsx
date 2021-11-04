import React from 'react';
import { StationNewsManage } from 'seid';

const props = {
  getNewsListUrl: 'http://10.4.69.36:1100/mq-api/mq/seo/getOutbox',
  getNewsDetailUrl: 'http://10.4.69.36:1100/mq-api/mq/seo/findOne',
  saveNewsUrl: 'http://10.4.69.36:1100/mq-api/mq/seo/sendSave',
  editNewsUrl: 'http://10.4.69.36:1100/mq-api/mq/seo/sendEdit',
  delNewsUrl: 'http://10.4.69.36:1100/mq-api/mq/seo/deletes',
  receiverUrl: 'http://10.4.208.124/api-gateway/basic-service/employee/findByPage',
  orgUrl: 'http://10.4.208.124:19805/ocss-basic/baseOrganization/findByAuthorityTree',
  // 附件上传地址
  uploadDocumentsAPI: 'http://10.4.208.124/zt-contract-service/uploadFile/uploadDocuments',
  // 附件下载地址
  downloadDocumentAPI: 'http://10.4.208.124/zt-contract-service/uploadFile/download',
  // 预览地址
  EDM_URL: 'http://10.4.208.124:19011/edm-service/preview',
  // userId: '33b15633b6b349b19c3a42dbac54911b',
  userId: '3C34A20C-52AE-11E9-9246-0242C0A8450E',
  modalProps: { width: 800 },
  initModalData: { publisherNick: '123' },
  receiverAccountUrl: 'http://10.4.208.124/api-gateway/basic-service/userAccount/findByUserId', //查找接收人的账号信息
};
const StationNewsListDemo = () => <StationNewsManage {...props} />;

export default StationNewsListDemo;
