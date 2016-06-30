angular.module('ibuildweb.factorys.services', ['ibuildweb.factorys.resources', 'ibuildweb.factorys'])
    .factory('deviceSysTypeList', deviceSysTypeList)
    .factory('monitorGroup', monitorGroup)
    .factory('monitorType', monitorType)
    .factory('deviceMonitor', deviceMonitor)
    .factory('map', map)
    .factory('deviceInfo', deviceInfo)
    .factory('devicePoint', devicePoint)

.factory('deviceTypeList', deviceTypeList);

function map(Resources, API_URI, DeviceField) {
    return new Resources({
        uri: API_URI.MAP,
        field: {
            'uri_param': DeviceField.MAP_ID,
            'filter_param': [DeviceField.MAP_NO]
        }
    })
}
/*DeviceField.MAP_TYPE,*/
function deviceInfo(Resources, API_URI, DeviceField) {
    return new Resources({
        uri: API_URI.DEVICE_INFO,
        field: {
            'uri_param': DeviceField.MAP_ID,
            'filter_param': [DeviceField.MAP_ID]
        }
    })
}

function devicePoint(Resources, API_URI, DeviceField) {
    return new Resources({
        uri: API_URI.DEVICE_POINT,
        field: {
            'uri_param': DeviceField.DEVICE_ID,
            'filter_param': [DeviceField.DEVICE_NO]
        }
    })
}

function deviceMonitor(Resources, API_URI, DeviceField) {
    return new Resources({
        uri: API_URI.DEVICE_MONITOR,
        field: {
            'uri_param': DeviceField.MNT_GROUP_ID,
            'filter_param': [DeviceField.MNT_GROUP_ID]
        }
    })
}

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
            'uri_parent': DeviceField.SYS_TYPE_ID,
            'uri_param': DeviceField.TYPE_ID,
            'filter_param': [DeviceField.SYS_TYPE_ID, { 'keyword': DeviceField.TYPE_NAME }]
        }
    });
}

function monitorGroup(Resources, API_URI, DeviceField) {
    return new Resources({
        uri: API_URI.MONITOR_GROUP,
        field: {
            'uri_param': DeviceField.MNT_GROUP_ID,
            'filter_param': [DeviceField.MNT_GROUP_ID]
        }
    });
}


function monitorType(Resources, API_URI, DeviceField) {
    return new Resources({
        uri: API_URI.MONITOR_TYPE,
        field: {
            'uri_param': DeviceField.MNT_TYPE_ID,
            'filter_param': [DeviceField.MNT_GROUP_ID, { 'keyword': DeviceField.DESC }]
        }
    });
}
