angular.module('content.deviceInfo', ['ams.factorys', 'ams.factorys.services'])
    .controller('DeviceInfoCtrl', DeviceInfoCtrl)
    .controller('DeviceInfoDetailCtrl', DeviceInfoDetailCtrl)

function DeviceInfoCtrl($scope, deviceInfo, deviceTypeList, map, devicePoint, paginator, delDialogService, DeviceField, $rootScope, $state, $stateParams, $mdSidenav, $mdComponentRegistry) {
    $scope.$on("loadFromParrent", load);
    $scope.$on('$stateChangeSuccess', function() {
        if ($state.current.name == "ams.category.content") {
            load();
        }
    });

    var query = {};

    function load() {
        $scope.selected = {
            data: null
        };
        $rootScope.query = null;
        $scope.editData.showData = paginator(deviceInfo.filter, 10);

        map.filter(null, null, function(data) {
            $scope.editData.mapData = data;
        });
        deviceTypeList.filter(null, null, function(data) {
            $scope.editData.DeviceTypeList = data;
        });
    }


    $scope.toggleRight = function(obj) {
        var uri = {
            category: $stateParams.category
        };

        if (obj) {
            uri.id = obj[DeviceField.DEVICE_ID];
            $state.go("ams.category.content.edit", uri);
            $scope.editData.groupFieldName = angular.copy(obj);
        } else {
            $state.go("ams.category.content.create");
        }
        // 'No instance found for handle'
        $mdComponentRegistry.when('right').then(function(it) {
            it.toggle();
        });
    };

    var k, v;
    $scope.$watch('editData.DeviceTypeList', function() {
        $scope.deviceMap = {};
        if ($scope.editData.DeviceTypeList) {
            for (var i in $scope.editData.DeviceTypeList) {
                k = $scope.editData.DeviceTypeList[i][DeviceField.TYPE_ID];
                v = $scope.editData.DeviceTypeList[i][DeviceField.TYPE_NAME];
                $scope.deviceMap[k] = v;
            }
        }
    });

    $scope.$watch('editData.mapData', function() {
        $scope.mapMap = {};
        if ($scope.editData.mapData) {
            for (var i in $scope.editData.mapData) {
                k = $scope.editData.mapData[i][DeviceField.MAP_ID];
                v = $scope.editData.mapData[i][DeviceField.MAP_NAME];
                $scope.mapMap[k] = v;
            }
        }
    });

    $scope.$watch('selected.data', function() {
        if ($scope.selected.data) {
            query[DeviceField.TYPE_ID] = angular.copy($scope.selected.data[DeviceField.TYPE_ID]);
        } else {
            delete query[DeviceField.TYPE_ID];
        }
    });

    $scope.search = function() {
        $rootScope.query = angular.copy(query);
        $scope.editData.search = angular.copy(query);
        $scope.editData.showData._load(0);
    }


    $scope.deleteData = function(obj) {
        delDialogService(function() {
            console.log('delete...');
            deviceInfo.deleteOne(obj).then(function(data) { $scope.editData.showData._load() })
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

function DeviceInfoDetailCtrl($scope, deviceInfo, toastService, $rootScope, $mdSidenav) {
    $scope.save = function(obj, type) {
        deviceInfo.saveOne(obj, type, function() {
            toastService();
            $rootScope.query = angular.copy($scope.editData.search);
            $scope.editData.groupFieldName = null;
            $scope.editData.search = null;
            $rootScope.editData.showData._load();
        });
    };

    $scope.cancel = function() {
        $mdSidenav('right').close();
        $scope.editData.groupFieldName = null;
    };
}
