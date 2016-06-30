angular.module('content.type', ['ibuildweb.factorys', 'ibuildweb.factorys.services'])
    .controller('typeCtrl', typeCtrl)

function typeCtrl($rootScope, Paginator, deviceSysTypeList, deviceTypeList, $state, $log, $mdSidenav, $scope, $mdComponentRegistry, DeviceField) {
    $scope.$on('$stateChangeSuccess', function() {
        load();
    });
    var query = {};

    $scope.$on("loadFromParrent", load);

    function load() {
        $rootScope.query = null;
        $scope.searchDeviceType = null;
        $scope.sysTypeData = null;
        $scope.showData = Paginator(deviceTypeList.filter, 10);
        $scope.DeviceField = DeviceField;
        deviceSysTypeList.filter(null, null, function(data) {
            $scope.DeviceSysTypeList = data;
            sysIdMap();
        });
    }

    $scope.search = function() {
        $scope.showData._load(0);
    }

    function sysIdMap() {
        for (var s in $scope.showData.data) {
            for (var o in $scope.DeviceSysTypeList) {
                if ($scope.showData.data[s][DeviceField.SYS_TYPE_ID] == $scope.DeviceSysTypeList[o][DeviceField.SYS_TYPE_ID])
                    $scope.showData.data[s][DeviceField.SYS_TYPE_ID] = $scope.DeviceSysTypeList[o];
            }
        }
    }

    $scope.$watch('showData.data', sysIdMap);

    $scope.$watch('sysTypeData', function() {
        query[DeviceField.SYS_TYPE_ID] = $scope.sysTypeData;
        $rootScope.query = query;
    });

    $scope.$watch('searchDeviceType', function() {
        query[DeviceField.TYPE_NAME] = angular.copy($scope.searchDeviceType);
        $rootScope.query = query;
    });

    $scope.save = function(obj, type) {
        if (type === 'save') {
            deviceTypeList.isExists(obj).then(function(data) {
                if (data.data.exists) {
                    console.log('数据已存在...')
                } else {
                    save(obj, type);
                }
            })
        } else {
            save(obj, type);
        }
    }

    function save(obj, type) {
        obj[DeviceField.SYS_TYPE_ID] = $scope.DeviceSysTypeList.editOptionData;
        deviceTypeList.saveOne(obj, type).then(function() {
            console.log('save....');
            $scope.showData._load()
        });
    }

    $scope.delete = function(obj) {
        deviceTypeList.deleteOne(obj).then(function(data) { $scope.showData._load() })
    }
    $scope.toggleRight = function(obj) {
        if (obj) {
            $state.go("ibuildweb.category.content.edit", { systype: obj[DeviceField.TYPE_ID] });
            $scope.deviceTypeFieldName = angular.copy(obj);
            $scope._deviceTypeFieldName = angular.copy(obj);
            $scope.DeviceSysTypeList.editOptionData = obj[DeviceField.SYS_TYPE_ID][DeviceField.SYS_TYPE_ID];
        } else {
            $scope.DeviceSysTypeList.editOptionData = null;
            $state.go("ibuildweb.category.content.create");
        }
        // 'No instance found for handle'
        $mdComponentRegistry.when('right').then(function(it) {
            it.toggle();
        });
    };

    $scope._oldSelectedRowObj = [];
    // 自定义设备 查看列表数据 
    $scope.selectedRow = function(index, obj) {
        if ($scope._oldSelectedRowObj.length > 1) {
            $scope._oldSelectedRowObj.pop();
        }
        $scope._oldSelectedRowObj.unshift(obj);
        $scope.isDel = true;
    };

    $scope.getSelectedText = function(obj) {
        if (obj !== undefined) {
            return obj;
        } else {
            return "Please select an item";
        }
    };


}
