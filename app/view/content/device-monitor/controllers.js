angular.module('content.deviceMonitor', ['ams.factorys', 'ams.factorys.services'])
    .controller('DeviceMonitorCtrl', DeviceMonitorCtrl)

function DeviceMonitorCtrl($scope, deviceMonitor, monitorGroup, deviceTypeList, paginator, delDialogService, toastService, DeviceField, $rootScope, $state, $mdSidenav, $mdComponentRegistry) {
    $scope.$on('$stateChangeSuccess', function() {
        if ($state.current.name == "ams.category.content") {
            load();
        }
    });
    $scope.$on("loadFromParrent", load);

    var query = {};

    $scope.deviceMap = {};
    $scope.monitorMap = {};
    var k, v;

    function load() {
        $scope.showData = paginator(deviceMonitor.filter, 10);
        $scope.selected = {
            data: null,
            device: null,
            monitor: null
        };
        $rootScope.query = null;
        $scope.DeviceField = DeviceField;
        deviceTypeList.filter(null, null, function(data) {
            $scope.DeviceTypeList = data;
        });
        monitorGroup.filter(null, null, function(data) {
            $scope.MonitorGroupList = data;
        });
    }

    $scope.search = function() {
        $rootScope.query = query;
        $scope.showData._load(0);
    }
    $scope.$watch('selected.data', function() {
        if ($scope.selected.data) {
            query[DeviceField.MNT_GROUP_ID] = angular.copy($scope.selected.data[DeviceField.MNT_GROUP_ID]);
        } else {
            delete query[DeviceField.MNT_GROUP_ID];
        }
    });

    $scope.$watch('DeviceTypeList', function() {
        if ($scope.DeviceTypeList) {
            for (var i in $scope.DeviceTypeList) {
                k = $scope.DeviceTypeList[i][DeviceField.TYPE_ID];
                v = $scope.DeviceTypeList[i][DeviceField.TYPE_NAME];
                $scope.deviceMap[k] = v;
            }
        }
        console.log($scope.deviceMap)
    });

    $scope.$watch('MonitorGroupList', function() {
        if ($scope.MonitorGroupList) {
            for (var i in $scope.MonitorGroupList) {
                k = $scope.MonitorGroupList[i][DeviceField.MNT_GROUP_ID];
                v = $scope.MonitorGroupList[i][DeviceField.DESC];
                $scope.monitorMap[k] = v;
            }
        }
        console.log($scope.monitorMap)
    });

    // 自定义设备 保存按钮
    $scope.save = function(type) {
        var obj = {};
        obj[DeviceField.TYPE_ID] = $scope.selected.device;
        obj[DeviceField.MNT_GROUP_ID] = $scope.selected.monitor;
        deviceMonitor.saveOne(obj, type, function() {
            if ($scope.selected.data) {
                query[DeviceField.MNT_GROUP_ID] = $scope.selected.data[DeviceField.MNT_GROUP_ID];
                $rootScope.query = query;
            }
            toastService();
            $scope.showData._load();
        });
    };

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


    $scope.toggleRight = function(obj) {
        if (obj) {
            $state.go("ams.category.content.edit", { id: obj[DeviceField.MNT_GROUP_ID] });
            if (obj[DeviceField.TYPE_ID]) {
                $scope.selected.device = obj[DeviceField.TYPE_ID];
            }
            if (obj[DeviceField.MNT_GROUP_ID]) {
                $scope.selected.monitor = obj[DeviceField.MNT_GROUP_ID];
            }
            $scope.groupFieldName = angular.copy(obj);
        } else {
            $state.go("ams.category.content.create");
        }
        // 'No instance found for handle'
        $mdComponentRegistry.when('right').then(function(it) {
            it.toggle();
        });
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


    $scope.cancel = function() {
        $mdSidenav('right').close();
    };


}
