angular.module('ibuildweb.factorys.services', ['ibuildweb.factorys.resources','ibuildweb.factorys'])
   .factory('deviceSysTypeList', deviceSysTypeList);
 

function deviceSysTypeList(Resources, API_URI, DeviceField) {
  return new Resources({ 
    uri: API_URI.DEVICE_SYS_TYPE ,
    field:  DeviceField.SYS_TYPE_ID 
  });
}