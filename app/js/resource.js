angular.module('ibuildweb.factorys.resources', [])
    .factory('Resources', Resources);

function Resources($http) {
    // body...
    function ResourceConstructor(options) {

        var dataInfo = {
            data: [],
            customData: [],
            count: null,
            exists: null,
            filterCount: function(obj) {
                var uri = options.uri;
                var _obj = {},
                    o = {},
                    uri = uri + '/count';
                for (var i in obj) {
                    for (var n in options.field.filter_param) {
                        if (typeof options.field.filter_param[n] !== 'object') {
                            if (i == options.field.filter_param[n]) { // && obj[i]
                                _obj[i] = obj[i];
                            }
                        } else {
                            for (var key in options.field.filter_param[n]) {
                                if (i == options.field.filter_param[n][key]) {
                                    _obj[i] = { "like": "%" + obj[i] + "%" };
                                    i = "\"" + i + "\"";
                                }
                            }
                        }
                    }
                }
                o = { params: { "where": _obj } };
                return $http.get(uri, o).success(function(_data) {
                    dataInfo.count = _data.count;
                });
            },
            filter: function(obj) {
                var _obj = {},
                    lmt = {},
                    skip = {};
                var _params = {};
                if (obj) {
                    for (var i in obj) {
                        for (var n in options.field.filter_param) {
                            if (typeof options.field.filter_param[n] !== 'object') {
                                if (i == options.field.filter_param[n]) { // && obj[i]
                                    _obj[i] = obj[i];
                                }
                            } else {
                                for (var key in options.field.filter_param[n]) {
                                    if (i == options.field.filter_param[n][key]) {
                                        _obj[i] = { "like": "%" + obj[i] + "%" };
                                        i = "\"" + i + "\"";
                                    }
                                }
                            }
                        }
                        _params.where = _obj;
                        if (i == '_skip') {
                            _params.skip = obj[i];
                        }
                        if (i == 'limit') {
                            _params.limit = obj[i];
                        }
                    }
                    console.log('_obj==--');
                    _obj = { params: { filter: _params } };
                    return $http.get(options.uri, _obj).success(function(_data) {
                        dataInfo.customData = _data;
                    });
                } else {
                    return $http.get(options.uri).success(function(_data) {
                        dataInfo.data = _data;
                    });
                }
            },
            isExists: function(obj) {
                var uri = options.uri;
                for (var i in obj) {
                    if (i == options.field.uri_param && obj[i]) {
                        uri += '/' + obj[i] + '/exists';
                    }
                }
                return $http.get(uri).success(function(_data) {
                    dataInfo.exists = _data.exists;
                });
            },
            saveOne: function(obj, _deviceSysType) {
                if (_deviceSysType && _deviceSysType._status === "modify") {
                    var _result = {};
                    angular.copy(_deviceSysType, _result);
                    delete _result._status;
                    var saveObj = {
                        'save': options.uri,
                        'reSave': options.uri + '/' + _deviceSysType[options.field.uri_param]
                    };

                    console.log('--save--');
                    return $http.put(saveObj[obj], _result).success(function(_data) {
                        console.log('save one success!');
                        _deviceSysType._status = 'saved';
                    });
                }
            },
            deleteOne: function(_deviceSysType) {
                if (_deviceSysType && _deviceSysType._status === "deleted") {
                    return $http.delete(options.uri + '/' + _deviceSysType[options.field.uri_param]).success(function(_data) {
                        console.log('delete one success!');
                        _deviceSysType._status = 'deleted';
                    });
                }
            }
        };
        return dataInfo;
    }
    return ResourceConstructor;
}
Resources.$injector = ['$http'];

/*     get: function(obj) {
         var _obj = { params: { filter: { limit: obj } } };
         return $http.get(options.uri).success(function(_data) {
             dataInfo.data = _data;
         });
     },*/
