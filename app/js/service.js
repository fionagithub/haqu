angular.module('ibuildweb.factorys.services', ['ibuildweb.factorys.resources', 'ibuildweb.factorys'])
    .factory('deviceSysTypeList', deviceSysTypeList)

.factory('deviceTypeList', deviceTypeList);

function deviceSysTypeList(Resources, API_URI, DeviceField) {
    return new Resources({
        uri: API_URI.DEVICE_SYS_TYPE,
        field: {
            'uri_param': DeviceField.SYS_TYPE_ID,
            'filter_param': [DeviceField.SYS_TYPE_ID]
        }
    })

}

function deviceTypeList(Resources, API_URI, DeviceField) {
    return new Resources({
        uri: API_URI.DEVICE_TYPE,
        field: {
            'uri_param': DeviceField.TYPE_ID,
            'filter_param': [DeviceField.SYS_TYPE_ID, DeviceField.TYPE_NAME]
        }
    });
}
