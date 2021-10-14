const CANCEL_REQUEST_MESSAGE = 'cancel request';
const CONST_GLOBAL = {
  SESSION: '_s',
  TOKEN_KEY: 'x-sid',
  OLD_TOKEN_KEY: 'Authorization',
  AUTH: 'AUTH',
  POLICY: 'POLICY',
  CURRENT_LOCALE: 'sei_locale',
  CURRENT_USER: 'CURRENT_USER',
  FEATURE_KEY: 'FEATURE_KEY',
};
const AUTH_POLICY = {
  USER: 'NormalUser',
  TENANT_ADMIN: 'TenantAdmin',
  ADMIN: 'GlobalAdmin',
};
const EXT_TABLE_TOOL = {
  SET_COLUMNS: 'SET_COLUMNS',
};
export default {
  CANCEL_REQUEST_MESSAGE,
  CONST_GLOBAL,
  AUTH_POLICY,
  EXT_TABLE_TOOL,
};
