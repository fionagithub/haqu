angular.module('content.deviceDefine', ['ibuildweb.factorys', 'ibuildweb.factorys.services'])
    .controller('deviceDefineCtrl', deviceDefineCtrl)

function deviceDefineCtrl($scope, monitorType,   $mdDialog,deviceTypeList, deviceDefines, $timeout, $rootScope, Paginator, $mdSidenav, $state, $mdComponentRegistry, DeviceField) {
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
        $rootScope.query = query;
        $scope.showData._load(0); 
    }
    $scope.$watch('sysTypeData', function() {
        if ($scope.sysTypeData) {
            query[DeviceField.TYPE_ID] = angular.copy($scope.sysTypeData);
        } else {
            delete query[DeviceField.TYPE_ID];
        }
    });


 
    $scope.save = function(obj, type) {
        save(obj, type);
    }

    function save(obj, type) {
        obj[DeviceField.ALARM_LVL] = $scope.alarmLevel.editData;
        obj[DeviceField.MNT_TYPE_ID] = $scope.MonitorType.editData;
        obj[DeviceField.TYPE_ID] = $scope.DeviceTypeList.editData;
        obj[DeviceField.VAL] = $scope.valueOpartor.editData;
        deviceDefines.saveOne(obj, type,function() { $scope.showData._load() });
    }


    $scope.delete = function(ev, obj) { 
        var confirm = $mdDialog.confirm()
            .title('确定要删除这条数据么?')
            .ok('确定')
            .cancel('取消');

        $mdDialog.show(confirm).then(function() {
            console.log( 'delete...');
            deviceDefines.deleteOne(obj).then(function(data) { $scope.showData._load() })
        }, function() {
            console.log( 'cancel...');
        });
    };


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
