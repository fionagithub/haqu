angular.module('ibuildweb.factorys', [])
    .constant('API_BASE', 'http://' + location.host + '/api/')
    .factory('AppInfo', AppInfo)
    .factory('API_URI', ApiUri)
    .constant('DeviceField', {
        TYPE_ID: "devicetypeid",
        TYPE_NAME: "devicetypename",
        SYS_TYPE_ID: "devicesystemtypeid",
        SYS_TYPE_NAME: "devicesystemtypename",
        ICON_SRC: "iconsrc",
        MNT_GROUP_ID: "monitortypegroupid",
        MNT_TYPE_ID: "monitortypeid",
        DEV_TYPE_ID: "devtypeid",
        CMD_NAME: "cmdname",
        DESC: "description",

        MONITOR: "monitor"
    });

function AppInfo($http) {
    var _appInfo = { appname: 'iBuildWeb' };
    $http.get('/version').then(function(res) {
        _appInfo.version = res.data;
    });
    return _appInfo;
}

function ApiUri(API_BASE) {
    return {
        MAP: API_BASE + 'ts_maps',
        MONITOR_TYPE: API_BASE + 'ts_monitortypes',
        MONITOR_GROUP: API_BASE + 'ts_newmonitortypegroups',
        DEVICE_TYPE: API_BASE + 'ts_devicetypes',
        DEVICE_SYS_TYPE: API_BASE + 'ts_devicesystypes'
    };
};

/*
        ID: "autoid",
        DEVICE_ID: "deviceid",
        DEVICE_NO: "deviceno", // 回路号
        NAME: "devicename",
        X: "axisx",
        Y: "axisy",
        MAP_ID: "mapid",
        MAP_NO: "mapno",
        MAP_NAME: "mapname",
        MAP_TYPE: "maptype",
        MAP: "map",
        SOURCE: "source",*/
