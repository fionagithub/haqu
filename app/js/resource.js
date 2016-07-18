angular.module('ibuildweb.factorys.resources', ['ibuildweb.factorys'])
    .factory('Resources', Resources);

function Resources($http, DeviceField, $rootScope) {
    // body...
    function ResourceConstructor(options) {

        var dataInfo = {
            exists: null,
            //   maxID: null,
            paramsSysId: null, //最大ID号或者是
            filter: function(offset, limit, callback) {
                var _obj = {},
                    _params = {};
                for (var i in $rootScope.query) {
                    if ($rootScope.query[i]) {
                        var _where = {};
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
            getMaxID: function(callback) {
                var _obj = {},
                    _where = {},
                    _params = {};
                if ($rootScope.query) {
                    for (var i in $rootScope.query) {
                        if ($rootScope.query[i]) {
                            _where[i] = $rootScope.query[i];
                            dataInfo.paramsSysId = _where[i];
                        }
                    }
                    _params.where = _where;
                }
                _params.order = options.paramId + ' DESC';
                _params.limit = 1;
                if (options.paramId) {
                    _obj = { params: { filter: _params } };
                }
                $http.get(options.uri, _obj).success(callback);
            },
            saveOne: function(obj, type, callback) {
                var saveUri = {
                    'save': options.uri,
                    'resave': options.uri + '/' + obj[options.param]
                };
                /*    var saveUri = options.uri;*/
                if (type == 'save') {
                    this.getMaxID(function(data) {
                        var autoId = dataInfo.paramsSysId;
                        if (data[0]) {
                            var _data = data[0][options.paramId];
                            if (autoId && parseInt(_data / Math.pow(10, 2)) / autoId === 1) {
                                obj[options.paramId] = parseInt(_data) + 1;
                            } else {
                                obj[options.paramId] = parseInt(_data) + 1;
                            }
                        } else {
                            obj[options.paramId] = Math.pow(10, 2) * autoId + 1;
                        }
                    });
                    $http.put(saveUri[type], obj).success(callback);
                } else {
                    $http.put(saveUri[type], obj).success(callback);

                }
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
/*      saveOne: function(obj, type) {
                var saveUri = {
                    'save': options.uri,
                    'resave': options.uri + '/' + obj[options.param]
                };
                return $http.put(saveUri[type], obj).success(function(data) {
                    console.log('save one success!'); 
                });
            },
            getMaxID:function(callback){
          var _obj={}, _params = {};
                _params.order = options.param+'DESC';
                _params.limit = limit;
                _obj = { params: { filter: _params } };
                $http.get(options.uri, _obj).success(callback);
            }*/
