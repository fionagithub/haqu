angular.module('ibuildweb.factorys.resources', ['ibuildweb.factorys'])
    .factory('Resources', Resources);

function Resources($http, DeviceField, $rootScope) {
    // body...
    function ResourceConstructor(options) {

        var dataInfo = { 
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
                    if (i == options.param && obj[i]) {
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
                    'resave': options.uri + '/' + obj[options.param]
                };
                return $http.put(saveUri[type], obj).success(function(data) {
                    console.log('save one success!'); 
                });
            },
            deleteOne: function(obj) {
                return $http.delete(options.uri + '/' + obj[options.param]).success(function(_data) {
                    console.log('delete one success!');
                });
            }
        };

        return dataInfo;
    }

    return ResourceConstructor;
}

Resources.$injector = ['$http'];
