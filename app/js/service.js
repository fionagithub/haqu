angular.module('ams.factorys.services', ['ams.factorys.resources', 'ams.factorys'])
    .factory('map', map)
    .factory('deviceSysTypeList', deviceSysTypeList)
    .factory('monitorGroup', monitorGroup)
    .factory('monitorType', monitorType)
    .factory('deviceMonitor', deviceMonitor)
    .factory('deviceInfo', deviceInfo)
    .factory('devicePoint', devicePoint)
    .factory('deviceDefines', deviceDefines)
    .factory('deviceGroupDefine', deviceGroupDefine)
    .factory('uploadService', uploadService)
    .factory('fileService', fileService)
    .factory('deviceTypeList', deviceTypeList);

// imgUir Config
function fileService(Resources, API_URI) {
    return new Resources({
        uri: API_URI.FILE
    })
}
// imgUir UPLOAD
function uploadService(Resources, API_URI) {
    return new Resources({
        uri: API_URI.UPLOAD
    })
}


function map(Resources, API_URI, DeviceField) {
    return new Resources({
        uri: API_URI.MAP,
        param: DeviceField.MAP_ID,
        paramId: DeviceField.MAP_ID
    })
}

function deviceSysTypeList(Resources, API_URI, DeviceField) {
    return new Resources({
        uri: API_URI.DEVICE_SYS_TYPE,
        param: DeviceField.SYS_TYPE_ID,
        paramId: DeviceField.SYS_TYPE_ID
    })

}

function deviceTypeList(Resources, API_URI, DeviceField) {
    return new Resources({
        uri: API_URI.DEVICE_TYPE,
        param: DeviceField.TYPE_ID,
        paramId: DeviceField.TYPE_ID
    });
}

function monitorGroup(Resources, API_URI, DeviceField) {
    return new Resources({
        uri: API_URI.MONITOR_GROUP,
        param: DeviceField.MNT_GROUP_ID,
        paramId: DeviceField.MNT_GROUP_ID
    });
}


function monitorType(Resources, API_URI, DeviceField) {
    return new Resources({
        uri: API_URI.MONITOR_TYPE,
        param: DeviceField.MNT_TYPE_ID,
        paramId: DeviceField.MNT_TYPE_ID
    });
}

function deviceMonitor(Resources, API_URI, DeviceField) {
    return new Resources({
        uri: API_URI.DEVICE_MONITOR,
        param: DeviceField.TYPE_ID
    })
}
/*DeviceField.MAP_TYPE,*/
function deviceInfo(Resources, API_URI, DeviceField) {
    return new Resources({
        uri: API_URI.DEVICE_INFO,
        param: DeviceField.DEVICE_ID,
        paramId: DeviceField.DEVICE_ID
    })
}

function devicePoint(Resources, API_URI, DeviceField) {
    return new Resources({
        uri: API_URI.DEVICE_POINT,
        param: DeviceField.DEVICE_ID
    })
}

function deviceDefines(Resources, API_URI, DeviceField) {
    return new Resources({
        uri: API_URI.DEVICE_DEFINES,
        param: DeviceField.ID
    })
}

function deviceGroupDefine(Resources, API_URI, DeviceField) {
    return new Resources({
        uri: API_URI.DEVICE_INFO_DEFINE,
        param: DeviceField.DEVICE_ID
    })
}
