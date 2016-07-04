angular.module('ibuildweb.factorys.services', ['ibuildweb.factorys.resources', 'ibuildweb.factorys'])
    .factory('deviceSysTypeList', deviceSysTypeList)
    .factory('monitorGroup', monitorGroup)
    .factory('monitorType', monitorType)
    .factory('deviceMonitor', deviceMonitor)
    .factory('map', map)
    .factory('deviceInfo', deviceInfo)
    .factory('devicePoint', devicePoint)
    .factory('deviceDefines', deviceDefines)
    .factory('deviceGroupDefine', deviceGroupDefine)

.factory('deviceTypeList', deviceTypeList);

 
function map(Resources, API_URI, DeviceField) {
    return new Resources({
        uri: API_URI.MAP,
        param: DeviceField.MAP_ID
    })
}

function deviceSysTypeList(Resources, API_URI, DeviceField) {
    return new Resources({
        uri: API_URI.DEVICE_SYS_TYPE,
        param: DeviceField.SYS_TYPE_ID
    })

}

function deviceTypeList(Resources, API_URI, DeviceField) {
    return new Resources({
        uri: API_URI.DEVICE_TYPE,
        param: DeviceField.TYPE_ID
    });
}

function monitorGroup(Resources, API_URI, DeviceField) {
    return new Resources({
        uri: API_URI.MONITOR_GROUP,
        param: DeviceField.MNT_GROUP_ID
    });
}


function monitorType(Resources, API_URI, DeviceField) {
    return new Resources({
        uri: API_URI.MONITOR_TYPE,
        param: DeviceField.MNT_TYPE_ID
    });
}

function deviceMonitor(Resources, API_URI, DeviceField) {
    return new Resources({
        uri: API_URI.DEVICE_MONITOR,
        param: DeviceField.MNT_GROUP_ID
    })
}
/*DeviceField.MAP_TYPE,*/
function deviceInfo(Resources, API_URI, DeviceField) {
    return new Resources({
        uri: API_URI.DEVICE_INFO,
        param: DeviceField.MAP_ID
    })
}

function devicePoint(Resources, API_URI, DeviceField) {
    return new Resources({
        uri: API_URI.DEVICE_POINT,
        param: DeviceField.MNT_TYPE_ID
    })
}

function deviceDefines(Resources, API_URI, DeviceField) {
    return new Resources({
        uri: API_URI.DEVICE_DEFINES,
        param: DeviceField.TYPE_ID
    })
}

function deviceGroupDefine(Resources, API_URI, DeviceField) {
    return new Resources({
        uri: API_URI.DEVICE_INFO_DEFINE,
        param: DeviceField.DEVICE_ID
    })
}
