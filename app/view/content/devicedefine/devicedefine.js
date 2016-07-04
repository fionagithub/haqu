angular.module('content.deviceDefine', ['ibuildweb.factorys', 'ibuildweb.factorys.services'])
    .controller('deviceDefineCtrl', deviceDefineCtrl)

function deviceDefineCtrl($scope, monitorType, deviceTypeList, deviceDefines, $timeout, $rootScope, Paginator, $mdSidenav, $state, $mdComponentRegistry, DeviceField) {
    $scope.$on("loadFromParrent", load);
    /* */
    $scope.$on('$stateChangeSuccess', function() {
        /* */
        if ($state.current.name == "ibuildweb.category.content") {
            load();
        }
    });

    var query = {};
    var valueOpartor = ['<', '>', '[]'];
    var alarmLevel = ['0', '1'];
    $scope.toggleRight = function(obj) {
        $scope.valueOpartor = valueOpartor;
        $scope.alarmLevel = alarmLevel;
        if (obj) {
            $state.go("ibuildweb.category.content.edit", { systype: obj[DeviceField.TYPE_ID][DeviceField.TYPE_ID] });
            $scope.MonitorType.editData = obj[DeviceField.MNT_TYPE_ID][DeviceField.MNT_TYPE_ID];
            $scope.DeviceTypeList.editData = obj[DeviceField.TYPE_ID][DeviceField.TYPE_ID];
            $scope.valueOpartor.editData = obj[DeviceField.VAL];
            $scope.alarmLevel.editData = obj[DeviceField.ALARM_LVL];
        } else {
            $state.go("ibuildweb.category.content.create");
        }
        // 'No instance found for handle'
        $mdComponentRegistry.when('right').then(function(it) {
            it.toggle();
        });
        $scope.groupFieldName = angular.copy(obj);
    };

    function load() {
        $rootScope.query = null;
        $scope.showData = Paginator(deviceDefines.filter, 10);
        $scope.DeviceField = DeviceField;
        $scope.sysTypeData = null;

        monitorType.filter(null, null, function(data) {
            $scope.MonitorType = data;
        });
        deviceTypeList.filter(null, null, function(data) {
            $scope.DeviceTypeList = data;
            // sysIdMap();
            $timeout(sysIdMap, 100);
        });
    }

    /* */
    $scope.$watch('showData.data', sysIdMap);

    function sysIdMap() {
        for (var s in $scope.showData.data) {
            for (var o in $scope.DeviceTypeList) {
                if ($scope.showData.data[s][DeviceField.TYPE_ID] == $scope.DeviceTypeList[o][DeviceField.TYPE_ID])
                    $scope.showData.data[s][DeviceField.TYPE_ID] = $scope.DeviceTypeList[o];
            }
        }

        for (var m in $scope.showData.data) {
            for (var n in $scope.MonitorType) {
                if ($scope.showData.data[m][DeviceField.MNT_TYPE_ID] && $scope.showData.data[m][DeviceField.MNT_TYPE_ID] == $scope.MonitorType[n][DeviceField.MNT_TYPE_ID])
                    $scope.showData.data[m][DeviceField.MNT_TYPE_ID] = $scope.MonitorType[n];
            }
        }

    }

    $scope.search = function() {
        $scope.showData._load(0);
        query[DeviceField.TYPE_ID] = $scope.sysTypeData;
        $rootScope.query = query;
    }


    $scope.$watch('sysTypeData', function() {});
    $scope.save = function(obj, type) {
        save(obj, type);
    }

    function save(obj, type) {
        obj[DeviceField.ALARM_LVL] = $scope.alarmLevel.editData;
        obj[DeviceField.MNT_TYPE_ID] = $scope.MonitorType.editData;
        obj[DeviceField.TYPE_ID] = $scope.DeviceTypeList.editData;
        obj[DeviceField.VAL] = $scope.valueOpartor.editData;
        deviceDefines.saveOne(obj, type).then(function() { $scope.showData._load() });
    }

    $scope.delete = function(obj) {
        deviceDefines.deleteOne(obj).then(function(data) { $scope.showData._load() })
    }

    $scope.getSelectedText = function(o) {
        if (o) {
            return o;
        } else {
            return " ";
        }
    };

    $scope._oldSelectedRowObj = [];
    // 自定义设备 查看列表数据 
    $scope.selectedRow = function(index, obj) {
        if ($scope._oldSelectedRowObj.length > 0) {
            $scope._oldSelectedRowObj.pop();
        }
        $scope._oldSelectedRowObj.unshift(obj);
    };


}
