angular.module('ibuildweb.factorys.resources', ['ibuildweb.factorys'])
    .factory('Resources', Resources);

function Resources($http) {
    // body...
    function ResourceConstructor(url, field) {

        var dataInfo = {
            data: [],
            customData: [],
            count: null,
            exists: null,
            filterCount: function(obj) {
                var _obj = {},
                    o = {},
                    uri = url + '/count';
                for (var i in obj) {
                    if (i == field) {
                        _obj[i] = obj[i];
                        i = "\"" + i + "\"";
                    }
                }
                o = { params: { "where": _obj } };
                return $http.get(uri, o).success(function(_data) {
                    dataInfo.count = _data.count;
                });
            },
            filter: function(obj) {
                var _obj = {},
                    skip = {};
                for (var i in obj) {
                    if (i == field) {
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
                return $http.get(url, _obj).success(function(_data) {
                    dataInfo.customData = _data;
                });
            },
        /*    get: function(obj) {
                var _obj = { params: { filter: { limit: obj } } };
                return $http.get(url).success(function(_data) {
                    dataInfo.data = _data;
                });
            },*/
            isExists: function(obj) {
                // var uri = API_URI.DEVICE_SYS_TYPE;
                for (var key in obj) {
                    if (i == field) {
                        url += '/' + obj[key] + '/exists';
                    }
                }
                return $http.get(url).success(function(_data) {
                    dataInfo.exists = _data.exists;
                });
            },
            saveOne: function(obj, _deviceSysType) {
                if (_deviceSysType && _deviceSysType._status === "modify") {
                    var _result = {};
                    angular.copy(_deviceSysType, _result);
                    delete _result._status;
                    var saveObj = {
                        'save': url,
                        'reSave': url + '/' + _deviceSysType[field]
                    };

                    console.log('--save--' + saveObj[obj]);
                    return $http.put(saveObj[obj], _result).success(function(_data) {
                        console.log('save one success!', _deviceSysType[field]);
                        _deviceSysType._status = 'saved';
                    });
                }
            },
            deleteOne: function(_deviceSysType) {
                if (_deviceSysType && _deviceSysType._status === "deleted") {
                    return $http.delete(url + '/' + _deviceSysType[field]).success(function(_data) {
                        console.log('delete one success!', _deviceSysType[field]);
                        _deviceSysType._status = 'deleted';
                    });
                }
            }
        };
        return dataInfo;

    }
    return ResourceConstructor;
}
