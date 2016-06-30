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
            filter: function(offset, limit, callback) {
                var _obj = {},
                    _where = {},
                    _params = {};
                for (var i in $rootScope.query) {
                    if ($rootScope.query[i]) {
                        _where[i] = $rootScope.query[i];
                    }
                }
                _params.where = _where;
                _params.offset = offset;
                _params.limit = limit;

                _obj = { params: { filter: _params } };
                $http.get(options.uri, _obj).success(callback);
            },
            isExists: function(obj, type) {
                var uri = options.uri;
                for (var i in obj) {
                    if (i == options.field.uri_param && obj[i]) {
                        uri += '/' + obj[i] + '/exists';
                    }
                }
                return $http.get(uri).success(function(data) {
                    dataInfo.exists = data.exists;
                });
            },
            saveOne: function(obj, type) {
                var saveUri = {
                    'save': options.uri,
                    'resave': options.uri + '/' + obj[options.field.uri_param]
                };
                return $http.put(saveUri[type], obj).success(function(data) {
                    console.log('save one success!'); 
                });
            },
            deleteOne: function(obj) {
                return $http.delete(options.uri + '/' + obj[options.field.uri_param]).success(function(_data) {
                    console.log('delete one success!');
                });
            }
        };

        return dataInfo;
    }

    return ResourceConstructor;
}

Resources.$injector = ['$http'];
/*
            filterCount: function(obj, callback) {
                var uri = options.uri;
                var _obj = {},
                    o = {},
                    uri = uri + '/count';
                if (obj) {
                    for (var i in obj) {
                        if (i == options.field.uri_parent && obj[i]) {
                            _obj[i] = obj[i];
                        }
                    }

                } else {
                    for (var i in $rootScope.query) {
                        if ($rootScope.query[i]) {
                            _obj[i] = $rootScope.query[i];
                        }
                    }
                }
                o = { params: { "where": _obj } };
                $http.get(uri, o).success(function(data) {

                });
            }, filterCount: function(obj, callback) {
                var uri = options.uri;
                var _obj = {},
                    o = {},
                    uri = uri + '/count';
                if (obj) {
                    for (var i in obj) {
                        if (i == options.field.uri_parent && obj[i]) {
                            _obj[i] = obj[i];
                        }
                    }

                } else {
                    for (var i in $rootScope.query) {
                        if ($rootScope.query[i]) {
                            _obj[i] = $rootScope.query[i];
                        }
                    }
                }
                o = { params: { "where": _obj } };
                $http.get(uri, o).success(callback);
            },*/
