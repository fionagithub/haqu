angular.module('content.deviceDefine', ['ams.factorys', 'ams.factorys.services'])
    .controller('DeviceDefineCtrl', DeviceDefineCtrl)

function DeviceDefineCtrl($scope, monitorType, deviceTypeList, deviceDefines, paginator, delDialogService, toastService, DeviceField, $rootScope, $state, $mdSidenav, $mdComponentRegistry) {
    $scope.$on("loadFromParrent", load);

    $scope.$on('$stateChangeSuccess', function() {
        if ($state.current.name == "ams.category.content") {
            load();
        }
    });

    var query = {};

    $scope.monitorMap = {};
    $scope.deviceMap = {};
    var k, v;

    function load() {
        $rootScope.query = null;
        $scope.showData = paginator(deviceDefines.filter, 10);
        $scope.DeviceField = DeviceField;
        $scope.selected = {
            device: null,
            monitor: null
        };
        $scope.data = {
            valueOpartor: ['<', '>', '[]'],
            alarmLevel: ['0', '1']
        };
        monitorType.filter(null, null, function(data) {
            $scope.MonitorType = data;
        });
        deviceTypeList.filter(null, null, function(data) {
            $scope.DeviceTypeList = data;
        });
    }

    $scope.toggleRight = function(obj) {
        if (obj) {
            if (obj[DeviceField.MNT_TYPE_ID]) {
                $scope.selected.monitor = obj[DeviceField.MNT_TYPE_ID];
            }
            if (obj[DeviceField.TYPE_ID]) {
                $scope.selected.device = obj[DeviceField.TYPE_ID];
            }
            $scope.selected.valueOpartor = obj[DeviceField.VAL];
            $scope.selected.alarmLevel = obj[DeviceField.ALARM_LVL];
            $state.go("ams.category.content.edit", { id: obj[DeviceField.ID] });
            $scope.groupFieldName = angular.copy(obj);
        } else {
            $state.go("ams.category.content.create");
        }
        // 'No instance found for handle'
        $mdComponentRegistry.when('right').then(function(it) {
            it.toggle();
        });
    };
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
        obj ? obj : obj = {};
        obj[DeviceField.MNT_TYPE_ID] = $scope.selected.monitor || null;
        obj[DeviceField.TYPE_ID] = $scope.selected.device || null;
        obj[DeviceField.VAL] = $scope.selected.valueOpartor || null;
        obj[DeviceField.ALARM_LVL] = $scope.selected.alarmLevel || null;
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


    $scope.cancel = function() {
        $mdSidenav('right').close();
    };
}
