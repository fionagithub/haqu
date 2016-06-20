angular.module('ibuildweb.monitor.factorys', ['ibuildweb.factorys'])
    .factory('MonitorGroup', MonitorGroup)
.factory('MonitorType', MonitorType);


function MonitorGroup($http, API_URI, DeviceField) {
    var MonitorGroupList = {
        data: [],
        customData: [],
        count: null,
        exists: null,
        filterCount: function(obj) {
            var o = {},
                w = {},
                uri =API_URI.MONITOR_GROUP + '/count';
            for (var i in obj) {
                if (i == DeviceField.MNT_GROUP_ID) {
                    w[i] = obj[i]
                }
                if (i == DeviceField.DESC) {
                    w[i] = obj[i]
                }
            }
            o = { params: { "where": w } };
            return $http.get(uri, o).success(function(_data) {
                MonitorGroupList.count = _data.count;
            });
        },
        filter: function(obj) {
            var _obj = {},
                skip = {};
            for (var i in obj) {
                if (i == DeviceField.MNT_GROUP_ID) {
                    _obj[i] = obj[i];
                    i = "\"" + i + "\"";
                }
                if (i == DeviceField.DESC && obj[i]) {
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
            return $http.get(API_URI.MONITOR_GROUP, _obj).success(function(_data) {
                MonitorGroupList.customData = _data;
            });
        },
        get: function() {
            var _obj = { params: { filter: { limit: 10 } } };
            return $http.get(API_URI.MONITOR_GROUP).success(function(_data) {
                MonitorGroupList.data = _data;
            });
        },
        isExists: function(obj) {
            var uri = API_URI.MONITOR_GROUP;
            for (var key in obj) {
                if (key == DeviceField.MNT_GROUP_ID) {
                    uri += '/' + obj[key] + '/exists';
                }
            }
            return $http.get(uri).success(function(_data) {
                MonitorGroupList.exists = _data.exists;
            });
        },
        saveOne: function(obj, type) {
            if (type && type._status === "modify") {
                var _result = {};
                angular.copy(type, _result);
                delete _result._status;
                var saveObj = {
                    'save': API_URI.MONITOR_GROUP,
                    'reSave': API_URI.MONITOR_GROUP + '/' + type[DeviceField.MNT_GROUP_ID]
                };

                console.log('--save--' + saveObj[obj]);
                return $http.put(saveObj[obj], _result).success(function(_data) {
                    console.log('save one success!', type[DeviceField.SYS_TYPE_NAME]);
                    type._status = 'saved';
                });
            }
        },
        deleteOne: function(obj) {
            if (obj && obj._status === "deleted") {
                return $http.delete(API_URI.MONITOR_GROUP + '/' + obj[DeviceField.MNT_GROUP_ID]).success(function(_data) {
                    console.log('delete one success!', obj[DeviceField.MNT_GROUP_ID]);
                    obj._status = 'deleted';
                });
            }
        }
    };
    return MonitorGroupList;
};
function MonitorType($http, API_URI, DeviceField) {
    var MonitorTypeList = {
        data: [ ],
        customData: [],
        count: null,
        exists: null,
        filterCount: function(obj) {
            var o = {},
                w = {},
                uri = API_URI.MONITOR_TYPE + '/count';
            for (var i in obj) {
                if (i == DeviceField.MNT_GROUP_ID) {
                    w[i] = obj[i]
                }
                if (i == DeviceField.CMD_NAME) {
                    w[i] = obj[i]
                }
            }
            o = { params: { "where": w } };
            return $http.get(uri, o).success(function(_data) {
                MonitorTypeList.count = _data.count;
            });
        },
        filter: function(obj) {
            var _obj = {},
                skip = {};
            for (var i in obj) {
                if (i == DeviceField.MNT_GROUP_ID) {
                    _obj[i] = obj[i];
                    i = "\"" + i + "\"";
                }
                if (i == DeviceField.CMD_NAME && obj[i]) {
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
            return $http.get(API_URI.MONITOR_TYPE, _obj).success(function(_data) {
                MonitorTypeList.customData = _data;
            });
        },
        isExists: function(obj) {
            var uri = API_URI.MONITOR_TYPE;
            for (var key in obj) {
                if (key ==DeviceField.MNT_TYPE_ID) {
                    uri += '/' + obj[key] + '/exists';
                }
            }
            return $http.get(uri).success(function(_data) {
                MonitorTypeList.exists = _data.exists;

            });

        },
        get: function() {
            var _obj = { params: { filter: { limit: 10 } } };
            return $http.get(API_URI.MONITOR_TYPE).success(function(_data) {
                MonitorTypeList.data = _data;
            });
        },
        saveOne: function(obj, _deviceType) {
            if (_deviceType && _deviceType._status === "modify") {
                var _result = {};
                angular.copy(_deviceType, _result);
                delete _result._status;
                var saveObj = {
                    'save': API_URI.MONITOR_TYPE,
                    'reSave': API_URI.MONITOR_TYPE + '/' + _deviceType[DeviceField.MNT_TYPE_ID]
                };

                console.log('----' + saveObj[obj]);
                return $http.put(saveObj[obj], _result).success(function(_data) {
                    console.log('save one success!', _deviceType[DeviceField.MNT_TYPE_ID]);
                    _deviceType._status = 'saved';
                });
            }
        },
        deleteOne: function(_deviceType) {
            if (_deviceType && _deviceType._status === "deleted") {
                return $http.delete(API_URI.DEVICE_TYPE + '/' + _deviceType[DeviceField.MNT_TYPE_ID]).success(function(_data) {
                    console.log('delete one success!', _deviceType[DeviceField.MNT_TYPE_ID]);
                    _deviceType._status = 'deleted';
                });
            }
        }
    };
    return MonitorTypeList;
};
