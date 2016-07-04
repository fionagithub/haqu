angular.module('content.deviceMonitor', ['ibuildweb.factorys', 'ibuildweb.factorys.services'])
    .controller('deviceMonitorCtrl', deviceMonitorCtrl)

function deviceMonitorCtrl(deviceMonitor, $rootScope, Paginator, DeviceField, monitorGroup, deviceTypeList, $timeout, $scope, $mdSidenav, $state, $log, $mdComponentRegistry) {
    $scope.$on('$stateChangeSuccess', function() {
        if ($state.current.name == "ibuildweb.category.content") {
            load();
        }
    });
    $scope.$on("loadFromParrent", load);

    var query = {};

    function load() {
        $scope.showData = Paginator(deviceMonitor.filter, 10);
        /*  */
        $rootScope.query = null;
        $scope.DeviceField = DeviceField;
        deviceTypeList.filter(null, null, function(data) {
            $scope.DeviceTypeList = data;
        });
        monitorGroup.filter(null, null, function(data) {
            $scope.MonitorGroupList = data;
            //  sysIdMap();
        });
        $timeout(sysIdMap, 100);
    }

    $scope.search = function() {
            $scope.showData._load(0);
            query[DeviceField.MNT_GROUP_ID] = $scope.sysTypeData;
            $rootScope.query = query;
        }
        /*    $scope.$watch('sysTypeData', function() {
                query[DeviceField.MNT_GROUP_ID] = $scope.sysTypeData;
                $rootScope.query = query;
            });*/
    
  $scope.$watch('showData.data', sysIdMap);

    function sysIdMap() {
        var showData = $scope.showData.data,
            device = $scope.DeviceTypeList,
            monitor = $scope.MonitorGroupList;
        for (var s in showData) {
            for (var o in device) {
                if (showData[s][DeviceField.TYPE_ID] == device[o][DeviceField.TYPE_ID])
                    showData[s][DeviceField.TYPE_ID] = device[o];
            }
        }
        for (var m in showData) {
            for (var n in monitor) {
                if (showData[m][DeviceField.MNT_GROUP_ID] && showData[m][DeviceField.MNT_GROUP_ID] == monitor[n][DeviceField.MNT_GROUP_ID])
                    showData[m][DeviceField.MNT_GROUP_ID] = monitor[n];
            }
        }

    }


    $scope.toggleRight = function(obj) {
        if (obj) {
            $state.go("ibuildweb.category.content.edit", { systype: obj[DeviceField.MNT_GROUP_ID][DeviceField.MNT_GROUP_ID] });
            $scope.DeviceTypeList.data = obj[DeviceField.TYPE_ID][DeviceField.TYPE_ID];
            $scope.MonitorGroupList.editOptionData = obj[DeviceField.MNT_GROUP_ID][DeviceField.MNT_GROUP_ID];
        } else {
            $state.go("ibuildweb.category.content.create");

        }
        // 'No instance found for handle'
        $mdComponentRegistry.when('right').then(function(it) {
            it.toggle();
        });
        $scope.groupFieldName = angular.copy(obj);
        $scope._groupFieldName = angular.copy(obj);
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


    $scope.getSelectedText = function(obj) {
        if (obj !== undefined) {
            return obj;
        } else {
            return " ";
        }
    };

    // 自定义设备 重新保存按钮
    $scope.resave = function() {
        var obj = {};
        obj[DeviceField.TYPE_ID] = $scope.DeviceTypeList.data;
        obj[DeviceField.MNT_GROUP_ID] = $scope.MonitorGroupList.editOptionData;

    };

    // 自定义设备 保存按钮
    $scope.save = function() {
        var obj = {};
        obj[DeviceField.TYPE_ID] = $scope.DeviceTypeList.data;
        obj[DeviceField.MNT_GROUP_ID] = $scope.MonitorGroupList.editOptionData;
    };




}
