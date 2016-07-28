angular.module('content.deviceInfo', ['ams.factorys', 'ams.factorys.services'])
    .controller('DeviceInfoCtrl', DeviceInfoCtrl)

function DeviceInfoCtrl($scope, deviceInfo, deviceTypeList, map, devicePoint, paginator, delDialogService, toastService, DeviceField, $rootScope, $state, $stateParams, $mdSidenav, $mdComponentRegistry) {
    $scope.$on("loadFromParrent", load);
    $scope.$on('$stateChangeSuccess', function() {
        if ($state.current.name == "ams.category.content") {
            load();
        }
    });

    var query = {};

    function load() {
        $rootScope.query = null;
        $scope.showData = paginator(deviceInfo.filter, 10);
        $scope.DeviceField = DeviceField;
        $scope.selected = {
            data: null
        };

        map.filter(null, null, function(data) {
            $scope.mapData = data;
        });
        deviceTypeList.filter(null, null, function(data) {
            $scope.DeviceTypeList = data;
        });
    }


    $scope.toggleRight = function(obj) {
        var uri = {
            category: $stateParams.category
        };
        var relatedData = {
            'DeviceField': $scope.DeviceField,
            'mapData': $scope.mapData,
            'DeviceTypeList': $scope.DeviceTypeList
        };
        $scope.$emit('relatedData', relatedData);

        if (obj) {
            uri.id = obj[DeviceField.DEVICE_ID];
            $state.go("ams.category.content.edit", uri);
            $scope.$emit('groupFieldName', obj);
        } else {
            $state.go("ams.category.content.create");
            $scope.$emit('reopen');
        }
        // 'No instance found for handle'
        $mdComponentRegistry.when('right').then(function(it) {
            it.toggle();
        });
    };

    var k, v;
    $scope.$watch('DeviceTypeList', function() {
        $scope.deviceMap = {};
        if ($scope.DeviceTypeList) {
            for (var i in $scope.DeviceTypeList) {
                k = $scope.DeviceTypeList[i][DeviceField.TYPE_ID];
                v = $scope.DeviceTypeList[i][DeviceField.TYPE_NAME];
                $scope.deviceMap[k] = v;
            }
        }
    });

    $scope.$watch('mapData', function() {
        $scope.mapMap = {};
        if ($scope.mapData) {
            for (var i in $scope.mapData) {
                k = $scope.mapData[i][DeviceField.MAP_ID];
                v = $scope.mapData[i][DeviceField.MAP_NAME];
                $scope.mapMap[k] = v;
            }
        }
    });

    $scope.search = function() {
        $rootScope.query = query;
        $scope.showData._load(0);
    }

    $scope.$watch('selected.data', function() {
        if ($scope.selected.data) {
            query[DeviceField.TYPE_ID] = angular.copy($scope.selected.data[DeviceField.TYPE_ID]);
        } else {
            delete query[DeviceField.TYPE_ID];
        }
    });

    $scope.$on("saveFromParent", function(event, obj, type) {
        obj ? obj : obj = {};
        deviceInfo.saveOne(obj, type, function() {
            if ($scope.selected.data) {
                query[DeviceField.TYPE_ID] = angular.copy($scope.selected.data[DeviceField.TYPE_ID]);
                $rootScope.query = query;
            }
            toastService();
            $scope.showData._load()
        });
    });

    $scope.deleteData = function(obj) {
        delDialogService(function() {
            console.log('delete...');
            deviceInfo.deleteOne(obj).then(function(data) { $scope.showData._load() })
        })
    };




    $scope._oldSelectedRowObj = [];
    // 自定义设备 查看列表数据 
    $scope.selectedRow = function(index, obj) {
        if ($scope._oldSelectedRowObj.length > 0) {
            $scope._oldSelectedRowObj.pop();
        }
        $scope._oldSelectedRowObj.unshift(obj);

        query[DeviceField.DEVICE_ID] = obj[DeviceField.DEVICE_ID];
        $rootScope.query = query;
        devicePoint.filter(null, null, function(data) {
            if (data.length > 0) {
                $scope.isDel = false;
                console.log('存在子数据...');
            } else {
                $scope.isDel = true;
            }
            $rootScope.query = null;
        })
    };

}
