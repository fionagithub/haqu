angular.module('content.deviceMonitor', ['ams.factorys', 'ams.factorys.services'])
    .controller('DeviceMonitorCtrl', DeviceMonitorCtrl)
    .controller('DeviceMonitorDetailCtrl', DeviceMonitorDetailCtrl)

function DeviceMonitorCtrl($scope, deviceMonitor, monitorGroup, deviceTypeList, paginator, delDialogService, DeviceField, $rootScope, $state, $stateParams, $mdSidenav, $mdComponentRegistry) {
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
        $scope.showData = paginator(deviceMonitor.filter, 10);
        $rootScope.showData = $scope.showData;
        deviceTypeList.filter(null, null, function(data) {
            $scope.DeviceTypeList = data;
        });
        monitorGroup.filter(null, null, function(data) {
            $scope.MonitorGroupList = data;
        });
    }
    $scope.toggleRight = function(obj) {
        var uri = {
            category: $stateParams.category
        };
        if (obj) {
            uri.id = obj[DeviceField.MNT_GROUP_ID];
            $state.go("ams.category.content.edit", uri);
            $rootScope.groupFieldName = angular.copy(obj);
        } else {
            $state.go("ams.category.content.create");
        }
        // 'No instance found for handle'
        $mdComponentRegistry.when('right').then(function(it) {
            it.toggle();
        });
    };

    $scope.search = function() {
        $rootScope.query = angular.copy(query);
        $rootScope.search = angular.copy(query);
        $scope.showData._load(0);
    }

    var k, v;
    $scope.$watch('selected.data', function() {
        if ($scope.selected.data) {
            query[DeviceField.MNT_GROUP_ID] = angular.copy($scope.selected.data[DeviceField.MNT_GROUP_ID]);
        } else {
            delete query[DeviceField.MNT_GROUP_ID];
        }
    });


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

    $scope.$watch('MonitorGroupList', function() {
        $scope.monitorMap = {};
        if ($scope.MonitorGroupList) {
            for (var i in $scope.MonitorGroupList) {
                k = $scope.MonitorGroupList[i][DeviceField.MNT_GROUP_ID];
                v = $scope.MonitorGroupList[i][DeviceField.DESC];
                $scope.monitorMap[k] = v;
            }
        }
    });

    $scope.deleteData = function(obj) {
        delDialogService(function() {
            console.log('delete...');
            deviceMonitor.deleteOne(obj).then(function(data) {
                if ($scope.selected.data) {
                    query[DeviceField.MNT_GROUP_ID] = $scope.selected.data[DeviceField.MNT_GROUP_ID];
                    $rootScope.query = query;
                }
                $scope.showData._load();
            })
        })
    };
    $scope._oldSelectedRowObj = [];
    // 自定义设备 查看列表数据
    $scope.selectedRow = function(index, obj) {
        $scope.isDel = true;
        if ($scope._oldSelectedRowObj.length > 0) {
            $scope._oldSelectedRowObj.pop();
        }
        $scope._oldSelectedRowObj.unshift(obj);
    };

}

function DeviceMonitorDetailCtrl($scope, deviceMonitor, toastService, $rootScope, $mdSidenav) {
    $scope.save = function(obj, type) {
        deviceMonitor.saveOne(obj, type, function() {
            toastService();
            $rootScope.groupFieldName = null;
            $rootScope.query = $rootScope.search;
            $rootScope.showData._load();
        });
    };

    $scope.cancel = function() {
        $mdSidenav('right').close();
        $rootScope.groupFieldName = null;
    };
}
