angular.module('ibuildweb.factorys.resources', ['ibuildweb.factorys'])
    .factory('Resources', Resources);

function Resources($http, DeviceField, $rootScope) {
    // body...
    function ResourceConstructor(options) {

        var dataInfo = {
            data: [],
            customData: [],
            count: null,
            exists: null,
            filterCount: function(callback) {
                var uri = options.uri;
                var _obj = {},
                    o = {},
                    uri = uri + '/count';
                for (var i in $rootScope.query) {
                    if ($rootScope.query[i]) {
                        _obj[i] = $rootScope.query[i];
                    }
                }
                o = { params: { "where": _obj } };
                $http.get(uri, o).success(callback);
            },
            filter: function(obj, callback) {
                var _obj = {},
                    _where = {},
                    _params = {};
                for (var i in $rootScope.query) {
                    if ($rootScope.query[i]) {
                        _where[i] = $rootScope.query[i];
                    }
                }
                _params.where = _where;
                for (var i in obj) {
                    if (i == 'skip') {
                        _params.skip = obj[i];
                    }
                    if (i == 'limit') {
                        _params.limit = obj[i];
                    }
                }

                _obj = { params: { filter: _params } };
                $http.get(options.uri, _obj).success(callback);
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
