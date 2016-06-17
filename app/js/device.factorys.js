angular.module('ibuildweb.device.factorys', ['ibuildweb.factorys'])
    .factory('DeviceSysTypeList', DeviceSysTypeList)
    .factory('DeviceTypeList', DeviceTypeList); 
 

function DeviceSysTypeList($http, API_URI, DeviceField, $q) {
    var deviceSysTypeList = {
        data: [{
            "deviceSystemTypeId": 1,
            "deviceSystemTypeName": "综合"
        }],
        customData: [{
            "deviceSystemTypeId": 1,
            "deviceSystemTypeName": "综合"
        }],
        count: null,
        exists: null,
/*        getCount: function(obj) {
            var uri = API_URI.DEVICE_SYS_TYPE + '/count';
            var w = {},
                o = {};
            if (obj && obj._status == 'isExistsChild') {
                for (var i in obj) {
                    if (i == DeviceField.SYS_TYPE_ID) {
                      w[i] = obj[i]
                        o = { params: { "where": w } };
                    }
                }
            }
            return $http.get(uri, o).success(function(_data) {
                deviceSysTypeList.count = _data.count;
            });
        },*/
        filterCount: function(obj) {
           var o = {},
                uri = API_URI.DEVICE_SYS_TYPE + '/count';
            for (var i in obj) {
                if (i == "devicesystemtypeid") {
                    o = { params: { "where": { "devicesystemtypeid": obj[i] } } };
                }
            }
            return $http.get(uri, o).success(function(_data) {
                deviceSysTypeList.count = _data.count;
            });
        },
        filter: function(obj) {
            var _obj = {},
                skip = {};
            for (var i in obj) {
                if (i == DeviceField.SYS_TYPE_ID) {
                    _obj[i] = obj[i];
                    i = "\"" + i + "\"";
                }
                if (i == '_skip') {
                    skip[i] = obj[i];
                    i = "\"" + i + "\"";
                }
            }
            console.log(_obj);
            if (skip["_skip"]) {
                _obj = { params: { filter: { "limit": 10, "where": _obj, "skip": skip["_skip"] } } };
            } else {
                _obj = { params: { filter: { "limit": 10, "where": _obj } } };
            }
            return $http.get(API_URI.DEVICE_SYS_TYPE, _obj).success(function(_data) {
                deviceSysTypeList.customData = _data;
            });
        },
        get: function(obj) {
            var _obj = { params: { filter: { limit: obj } } };
            return $http.get(API_URI.DEVICE_SYS_TYPE).success(function(_data) {
                deviceSysTypeList.data = _data;
            });
        },
        isExists: function(obj) {
            var uri = API_URI.DEVICE_SYS_TYPE;
            for (var key in obj) {
                if (key == "devicesystemtypeid") {
                    uri += '/' + obj[key] + '/exists';
                }
            }
            return $http.get(uri).success(function(_data) {
                deviceSysTypeList.exists = _data.exists;
            });
        },
        saveOne: function(obj, _deviceSysType) {
            if (_deviceSysType && _deviceSysType._status === "modify") {
                var _result = {};
                angular.copy(_deviceSysType, _result);
                delete _result._status;
                var saveObj = {
                    'save': API_URI.DEVICE_SYS_TYPE,
                    'reSave': API_URI.DEVICE_SYS_TYPE + '/' + _deviceSysType[DeviceField.SYS_TYPE_ID]
                };

                console.log('--save--' + saveObj[obj]);
                return $http.put(saveObj[obj], _result).success(function(_data) {
                    console.log('save one success!', _deviceSysType[DeviceField.SYS_TYPE_NAME]);
                    _deviceSysType._status = 'saved';
                });
            }
        },
        deleteOne: function(_deviceSysType) {
            if (_deviceSysType && _deviceSysType._status === "deleted") {
                return $http.delete(API_URI.DEVICE_SYS_TYPE + '/' + _deviceSysType[DeviceField.SYS_TYPE_ID]).success(function(_data) {
                    console.log('delete one success!', _deviceSysType[DeviceField.SYS_TYPE_NAME]);
                    _deviceSysType._status = 'deleted';
                });
            }
        }
    };
    return deviceSysTypeList;
}

function DeviceTypeList($http, API_URI, DeviceField) {
    var deviceTypeList = {
        data: [{
            "deviceTypeId": 101,
            "deviceTypeName": "视频监控",
            "deviceSystemTypeId": 1,
            "iconSrc": null
        }],
        customData: [{
            "deviceTypeId": 101,
            "deviceTypeName": "视频监控",
            "deviceSystemTypeId": 1,
            "iconSrc": null
        }],
        count: null,
        exists: null,
        filterCount: function(obj) {
            var o = {},
                w = {},
                uri = API_URI.DEVICE_TYPE + '/count';
            for (var i in obj) {
                if (i == DeviceField.SYS_TYPE_ID) {
                    w[i] = obj[i]
                }
                if (i == DeviceField.TYPE_NAME) {
                    w[i] = obj[i]
                }
            }
            o = { params: { "where": w } };
            return $http.get(uri, o).success(function(_data) {
                deviceTypeList.count = _data.count;
            });
        },
        filter: function(obj) {
            var _obj = {},
                skip = {};
            for (var i in obj) {
                if (i == DeviceField.SYS_TYPE_ID) {
                    _obj[i] = obj[i];
                    i = "\"" + i + "\"";
                }
                if (i == DeviceField.TYPE_NAME && obj[i]) {
                    _obj[i] = { "like": "%" + obj[i] + "%" };
                    i = "\"" + i + "\"";
                }
                if (i == '_skip') {
                    skip[i] = obj[i];
                    i = "\"" + i + "\"";
                }
            }
            console.log(_obj);
            if (skip["_skip"]) {
                _obj = { params: { filter: { "limit": 10, "where": _obj, "skip": skip["_skip"] } } };
            } else {
                _obj = { params: { filter: { "limit": 10, "where": _obj } } };
            }
            return $http.get(API_URI.DEVICE_TYPE, _obj).success(function(_data) {
                deviceTypeList.customData = _data;
            });
        },
 /*       getCount: function(obj) {
            var uri = API_URI.DEVICE_TYPE + '/count';
            if (obj && obj._status == 'isExistsChild') {
                for (var key in obj) {
                    if (key == "devicesystemtypeid") {
                        // api/ts_devicetypes?filter[where][key]=value
                        uri += '?[where][' + key + ']=' + obj[key];
                    }
                }
            }
            return $http.get(uri).success(function(_data) {
                deviceTypeList.count = _data.count;
            });
        },*/
        isExists: function(obj) {
            var uri = API_URI.DEVICE_TYPE;
            for (var key in obj) {
                if (key == "devicetypeid") {
                    uri += '/' + obj[key] + '/exists';
                }
            }
            return $http.get(uri).success(function(_data) {
                deviceTypeList.exists = _data.exists;

            });

        },
        get: function() {
            var _obj = { params: { filter: { limit: 10 } } };
            return $http.get(API_URI.DEVICE_TYPE).success(function(_data) {
                deviceTypeList.data = _data;
            });
        },
        saveOne: function(obj, _deviceType) {
            if (_deviceType && _deviceType._status === "modify") {
                var _result = {};
                angular.copy(_deviceType, _result);
                delete _result._status;
                var saveObj = {
                    'save': API_URI.DEVICE_TYPE,
                    'reSave': API_URI.DEVICE_TYPE + '/' + _deviceType[DeviceField.TYPE_ID]
                };

                console.log('----' + saveObj[obj]);
                return $http.put(saveObj[obj], _result).success(function(_data) {
                    console.log('save one success!', _deviceType[DeviceField.TYPE_NAME]);
                    _deviceType._status = 'saved';
                });
            }
        },
        deleteOne: function(_deviceType) {
            if (_deviceType && _deviceType._status === "deleted") {
                return $http.delete(API_URI.DEVICE_TYPE + '/' + _deviceType[DeviceField.TYPE_ID]).success(function(_data) {
                    console.log('delete one success!', _deviceType[DeviceField.TYPE_NAME]);
                    _deviceType._status = 'deleted';
                });
            }
        }
    };
    return deviceTypeList;
};
