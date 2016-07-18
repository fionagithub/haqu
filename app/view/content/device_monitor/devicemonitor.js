angular.module('content.deviceMonitor', ['ibuildweb.factorys', 'ibuildweb.factorys.services'])
    .controller('deviceMonitorCtrl', deviceMonitorCtrl)

function deviceMonitorCtrl(deviceMonitor, $rootScope, delDialogService, Paginator, DeviceField, monitorGroup, deviceTypeList, $timeout, $scope, $mdSidenav, $state, $log, $mdComponentRegistry) {
    $scope.$on('$stateChangeSuccess', function() {
        if ($state.current.name == "ibuildweb.category.content") {
            load();
        }
    });
    $scope.$on("loadFromParrent", load);

    var query = {};

    function load() {
        $scope.showData = Paginator(deviceMonitor.filter, 10);
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

    $scope.deviceMap = {};
    $scope.monitorMap = {};
    var k, v;
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
        obj[DeviceField.TYPE_ID] = $scope.selected.device[DeviceField.TYPE_ID]
        obj[DeviceField.MNT_GROUP_ID] = $scope.selected.monitor[DeviceField.MNT_GROUP_ID]
        deviceMonitor.saveOne(obj, type, function() {
            if ($scope.selected.data) {
                query[DeviceField.MNT_GROUP_ID] = $scope.selected.data[DeviceField.MNT_GROUP_ID];
                $rootScope.query = query;
            }
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
            $state.go("ibuildweb.category.content.edit", { systype: obj[DeviceField.MNT_GROUP_ID][DeviceField.MNT_GROUP_ID] });
            if (obj[DeviceField.TYPE_ID]) {
                $scope.selected.device = obj[DeviceField.TYPE_ID];
            }
            if (obj[DeviceField.MNT_GROUP_ID]) {
                $scope.selected.monitor = obj[DeviceField.MNT_GROUP_ID];
            }
        } else {
            $state.go("ibuildweb.category.content.create");
        }
        // 'No instance found for handle'
        $mdComponentRegistry.when('right').then(function(it) {
            it.toggle();
        });
        $scope.groupFieldName = angular.copy(obj);
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
/*

    $scope.$watch('showData.data', sysIdMap);

  function sysIdMap() {
        angular.forEach($scope.showData.data, function(data, index) {
            if (data[DeviceField.TYPE_ID] && typeof data[DeviceField.TYPE_ID] == 'number') {
                query[DeviceField.TYPE_ID] = data[DeviceField.TYPE_ID];
                $rootScope.query = query;
                deviceTypeList.filter(null, null, function(_data) {
                    data[DeviceField.TYPE_ID] = _data[0];
                    delete query[DeviceField.TYPE_ID];
                });
            }

        });
        angular.forEach($scope.showData.data, function(data, index) {
            delete query[DeviceField.TYPE_ID]; 
            if (data[DeviceField.MNT_GROUP_ID] && typeof data[DeviceField.MNT_GROUP_ID] == 'number') {
                query[DeviceField.MNT_GROUP_ID] = data[DeviceField.MNT_GROUP_ID];
                $rootScope.query = query;
                monitorGroup.filter(null, null, function(_data) {
                    data[DeviceField.MNT_GROUP_ID] = _data[0];
                    delete query[DeviceField.MNT_GROUP_ID];
                });
            }
        });
    }
    */
