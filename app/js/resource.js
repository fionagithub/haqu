angular.module('ams.factorys.resources', ['ams.factorys'])
    .factory('Resources', Resources);

function Resources($http, DeviceField, $rootScope) {
    // body...
    function ResourceConstructor(options) {

        var dataInfo = {
            exists: null,
            maxID: null,
            paramsSysId: null, //最大ID号或者是
            v_paramsSysId: null,
            fileConfig: function() {
                return $http.get(options.uri)
            },
            post: function(obj) {
                return $http.post(options.uri, obj, {
                        transformRequest: angular.identity,
                        headers: { 'Content-Type': undefined }
                    })
                    .then(function() {
                        console.log("上传成功!!");
                    },function() {
                        console.log("上传失败!!");
                    })
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
                $http.get(options.uri, _obj).then(callback);
            },
            isExists: function(obj, type) {
                var uri = options.uri;
                for (var i in obj) {
                    if (i == options.param && obj[i]) {
                        uri += '/' + obj[i] + '/exists';
                    }
                }
                return $http.get(uri).then(function(data) {
                    dataInfo.exists = data.exists;
                });
            },
            getMaxID: function() {
                var _obj = {},
                    _params = {};
                _params.limit = 1;
                _params.order = options.paramId + ' DESC';
                var obj = {};
                obj[options.paramId] = parseInt(dataInfo.paramsSysId);
                _params.where = obj;
                _obj = { params: { filter: _params } };
                return $http.get(options.uri, _obj).then(function(data) {
                    var _paramsSysId = parseInt(dataInfo.v_paramsSysId);
                    if (data[0]) {
                        var _maxID = data[0][options.paramId];
                        if (_paramsSysId && parseInt(_maxID / _paramsSysId) === 1) {
                            dataInfo.maxID = parseInt(_maxID) + 1;
                        }
                    } else {
                        dataInfo.maxID = _paramsSysId + 1;
                    }
                });
            },
            saveOne: function(obj, type, callback) {
                var saveUri = {
                    'save': options.uri,
                    'resave': options.uri + '/' + obj[options.param]
                };
                type === 'save' ? $http.post(saveUri[type], obj).then(callback) : $http.put(saveUri[type], obj).then(callback);
            },
            deleteOne: function(obj) {
                return $http.delete(options.uri + '/' + obj[options.param]).then(function(_data) {
                    console.log('delete one success!');
                });
            }
        };

        return dataInfo;
    }

    return ResourceConstructor;
}

Resources.$injector = ['$http'];
