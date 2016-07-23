angular.module('ams.factorys.resources', ['ams.factorys'])
    .factory('Resources', Resources);

function Resources($http, DeviceField, $rootScope) {
    // body...
    function ResourceConstructor(options) {

        var dataInfo = {
            exists: null,
            maxID: null, 
            paramsSysId: null, //最大ID号或者是
            fileConfig: function() {
                return $http.get(options.uri).success(function(result) { 
                        console.log("图片路径",result);
                })
            },
            post: function(obj) {
                return $http.post(options.uri, obj, {
                        transformRequest: angular.identity,
                        headers: { 'Content-Type': undefined }
                    })
                    .success(function() {
                        console.log("上传成功!!");
                    })
                    .error(function() {
                        console.log("上传失败!!");
                    });
            },
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
            getMaxID: function() {
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
                return $http.get(options.uri, _obj).success(function(data) {
                    var autoId = parseInt(dataInfo.paramsSysId);
                    if (data[0]) {
                        var _data = data[0][options.paramId];
                        if (autoId && parseInt(_data / Math.pow(10, 2)) / autoId === 1) {
                            dataInfo.maxID = parseInt(_data) + 1;
                        } else {
                            dataInfo.maxID = parseInt(_data) + 1;
                        }
                    } else {
                        dataInfo.maxID = Math.pow(10, 2) * autoId + 1;
                    }
                });
            },
            saveOne: function(obj, type, callback) {
                var saveUri = {
                    'save': options.uri,
                    'resave': options.uri + '/' + obj[options.param]
                };
                /*    var saveUri = options.uri;*/
                this.getMaxID().then(function() {
                    if (options.paramId) {
                        obj[options.paramId] = obj[options.paramId] || dataInfo.maxID;
                    }
                    $http.put(saveUri[type], obj).success(callback);
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
