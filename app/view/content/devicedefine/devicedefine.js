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


    $scope.deleteData = function(obj) {
        delDialogService(function() {
            console.log('delete...');
            deviceDefines.deleteOne(obj).then(function(data) {
                if ($scope.selectedData) {
                    query[DeviceField.TYPE_ID] = angular.copy($scope.selectedData);
                    $rootScope.query = query;
                }
                $scope.showData._load()
            })
        })
    };

    $scope.toggleRight = function(obj) {
        $scope.valueOpartor = valueOpartor;
        $scope.alarmLevel = alarmLevel;
        if (obj) {
            if (obj[DeviceField.MNT_TYPE_ID]) {
                $state.go("ibuildweb.category.content.edit", { systype: obj[DeviceField.ID] });
                $scope.selected.monitor = obj[DeviceField.MNT_TYPE_ID];
            } else {
                $state.go("ibuildweb.category.content.edit");
            }
            if (obj[DeviceField.TYPE_ID]) {
                $scope.selected.device = obj[DeviceField.TYPE_ID];
            }
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
    $scope.monitorMap = {};
    $scope.deviceMap = {};
    var k, v;
    $scope.$watch('MonitorType', function() {
        if ($scope.MonitorType) {
            for (var i in $scope.MonitorType) {
                k = $scope.MonitorType[i][DeviceField.MNT_TYPE_ID];
                v = $scope.MonitorType[i][DeviceField.DESC];
                $scope.monitorMap[k] = v;
            }
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
    });
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
