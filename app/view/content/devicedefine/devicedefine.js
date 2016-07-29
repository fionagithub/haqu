angular.module('content.deviceDefine', ['ibuildweb.factorys', 'ibuildweb.factorys.services'])
    .controller('deviceDefineCtrl', deviceDefineCtrl)

function deviceDefineCtrl($scope, monitorType, deviceTypeList, delDialogService, toastService,deviceDefines, $timeout, $rootScope, Paginator, $mdSidenav, $state, $mdComponentRegistry, DeviceField) {
    $scope.$on("loadFromParrent", load);

    $scope.$on('$stateChangeSuccess', function() {
        if ($state.current.name == "ibuildweb.category.content") {
            load();
        }
    });

    var query = {};
    var valueOpartor = ['<', '>', '[]'];
    var alarmLevel = ['0', '1'];

    var checkboxMap = { '0': false, '1': true, 'false': 0, 'true': 1 };

    $scope.toggleRight = function(obj) {
        $scope.valueOpartor = valueOpartor;
        $scope.alarmLevel = alarmLevel;
        if (obj) {

            $state.go("ibuildweb.category.content.edit", { systype: obj[DeviceField.TYPE_ID][DeviceField.TYPE_ID] });
            if (obj[DeviceField.MNT_TYPE_ID]) {
                $scope.MonitorType.editData = angular.copy(obj[DeviceField.MNT_TYPE_ID][DeviceField.MNT_TYPE_ID]);
            }
            obj[DeviceField.ALARM_FLG] = checkboxMap[obj[DeviceField.ALARM_FLG]];
            obj[DeviceField.IS_DEFAULT] = checkboxMap[obj[DeviceField.IS_DEFAULT]];
            obj[DeviceField.IS_ANALOGIO] = checkboxMap[obj[DeviceField.IS_ANALOGIO]];

            $scope.DeviceTypeList.editData = angular.copy(obj[DeviceField.TYPE_ID][DeviceField.TYPE_ID]);
            $scope.valueOpartor.editData = angular.copy(obj[DeviceField.VAL]);
            $scope.alarmLevel.editData = angular.copy(obj[DeviceField.ALARM_LVL]);

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
        $scope.selected = {
            device: null,
            monitor: null
        };

        monitorType.filter(null, null, function(data) {
            $scope.MonitorType = data;
        });
        deviceTypeList.filter(null, null, function(data) {
            $scope.DeviceTypeList = data;
        });
    }

    $scope.$watch('showData.data', sysIdMap);

    /* 
    function boolMap() {
        for (var s in $scope.showData.data) {
            $scope.showData.data[s][DeviceField.ALARM_FLG] = checkboxMap[$scope.showData.data[s][DeviceField.ALARM_FLG]];
            $scope.showData.data[s][DeviceField.IS_DEFAULT] = checkboxMap[$scope.showData.data[s][DeviceField.IS_DEFAULT]];
            $scope.showData.data[s][DeviceField.IS_ANALOGIO] = checkboxMap[$scope.showData.data[s][DeviceField.IS_ANALOGIO]];

        }
        sysIdMap();
    }
*/

    function sysIdMap() {
        for (var m in $scope.showData.data) {
            for (var n in $scope.MonitorType) {
                if ($scope.showData.data[m][DeviceField.MNT_TYPE_ID] && $scope.showData.data[m][DeviceField.MNT_TYPE_ID] == $scope.MonitorType[n][DeviceField.MNT_TYPE_ID])
                    $scope.showData.data[m][DeviceField.MNT_TYPE_ID] = $scope.MonitorType[n];
            }
        }
        for (var s in $scope.showData.data) {
            for (var o in $scope.DeviceTypeList) {
                if ($scope.showData.data[s][DeviceField.TYPE_ID] == $scope.DeviceTypeList[o][DeviceField.TYPE_ID])
                    $scope.showData.data[s][DeviceField.TYPE_ID] = $scope.DeviceTypeList[o];
            }
        }


    }


    $scope.search = function() {
        $rootScope.query = query;
        $scope.showData._load(0);
    }
    $scope.$watch('selectedData', function() {
        if ($scope.selectedData) {
            query[DeviceField.TYPE_ID] = angular.copy($scope.selectedData);
        } else {
            delete query[DeviceField.TYPE_ID];
        }
    });



    $scope.save = function(obj, type) {
        save(obj, type);
    }

    function save(obj, type) {
        obj[DeviceField.ALARM_FLG] = checkboxMap[obj[DeviceField.ALARM_FLG]];
        obj[DeviceField.IS_DEFAULT] = checkboxMap[obj[DeviceField.IS_DEFAULT]];
        obj[DeviceField.IS_ANALOGIO] = checkboxMap[obj[DeviceField.IS_ANALOGIO]];

        obj[DeviceField.ALARM_LVL] = $scope.alarmLevel.editData;
        obj[DeviceField.MNT_TYPE_ID] = $scope.selected.monitor[DeviceField.MNT_TYPE_ID];
        obj[DeviceField.TYPE_ID] = $scope.selected.device[DeviceField.TYPE_ID];
        obj[DeviceField.VAL] = $scope.valueOpartor.editData;
        deviceDefines.saveOne(obj, type, function() {
            if ($scope.selectedData) {
                query[DeviceField.TYPE_ID] = angular.copy($scope.selectedData);
                $rootScope.query = query;
            }
            toastService();
            $scope.showData._load()
        });
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