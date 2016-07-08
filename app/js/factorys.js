angular.module('ibuildweb.factorys', [])
    .constant('API_BASE', 'http://' + location.host + '/api/')
    .factory('AppInfo', AppInfo)
    .factory('API_URI', ApiUri)

.constant('DeviceField', {
    ID: "autoid",
    NAME: "devicename",
    DEVICE_ID: "deviceid",
    DEVICE_NO: "deviceno", // 回路号
    X: "axisx",
    Y: "axisy",
    TYPE_ID: "devicetypeid",
    TYPE_NAME: "devicetypename",
    SYS_TYPE_ID: "devicesystemtypeid",
    SYS_TYPE_NAME: "devicesystemtypename",
    ICON_SRC: "iconsrc",
    MNT_GROUP_ID: "monitortypegroupid",
    MNT_TYPE_ID: "monitortypeid",
    TMP_NAME: "templatename",
    SUBDEVICE_ID: "subdeviceid",
    MONITOR: "monitor",
    MAP_ID: "mapid",
    MAP_NO: "mapno",
    MAP_NAME: "mapname",
    SOURCE: "source",
    MAP_TYPE: "maptype",
    CMD_NAME: "cmdname",
    DESC: "description",
    STATUS_VAL: "statusvalue",
    ALARM_FLG: "alarmflg",
    ALARM_LVL: "alarmlevel",
    IS_DEFAULT: "isdefault",
    IS_ANALOGIO: "isanalogio",
    VAL: "valuecompareoprator",
    0: false,
    1: true
})

.factory('config', function($http, $q) {
    var deferred = $q.defer();
    $http.get('/config').success(function(result) {
        deferred.resolve(result);
    }).error(function(result) {
        deferred.reject("network error");
    });
    return deferred.promise;
})

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
        DEVICE_SYS_TYPE: API_BASE + 'ts_devicesystypes',
        DEVICE_DEFINES: API_BASE + 'ts_device_defines',
        DEVICE_POINT: API_BASE + 'ts_devicepoints',

        DEVICE_INFO: API_BASE + 'ts_deviceinfos',
        DEVICE_INFO_DEFINE: API_BASE + 'ts_deviceinfogroupdefines',
        DEVICE_MONITOR: API_BASE + 'ts_devicetypemonitortypegroups',

    };
};
