angular.module('content.systype', ['ibuildweb.factorys', 'ibuildweb.factorys.services'])
    .controller('systypeCtrl', systypeCtrl) 
function systypeCtrl($scope, $state, $rootScope,  delDialogService, deviceSysTypeList, $mdSidenav, deviceTypeList, Paginator, $mdComponentRegistry, DeviceField) {
    $scope.$on("loadFromParrent", load);
    $scope.$on('$stateChangeSuccess', function() {
        if ($state.current.name == "ibuildweb.category.content") {
            load();
        }
    });
    var query = {};

    function load() {
        $rootScope.query = null;
        $scope.showData = Paginator(deviceSysTypeList.filter, 10);
        $scope.DeviceField = DeviceField;
        $scope.deviceSysTypeData = null;

        deviceSysTypeList.filter(null, null, function(data) {
            $scope.DeviceSysTypeList = data;
        });
    }

    $scope.$watch('deviceSysTypeData', function() {
        if ($scope.deviceSysTypeData) {
            query[DeviceField.SYS_TYPE_ID] = angular.copy($scope.deviceSysTypeData[DeviceField.SYS_TYPE_ID]);
        } else {
            delete query[DeviceField.SYS_TYPE_ID];
        }
    });

    $scope.search = function() {
        $rootScope.query = query;
        $scope.showData._load(0);
    } 
    $scope.save = function(obj, type) {
        deviceSysTypeList.saveOne(obj, type, function() { $scope.showData._load() });
    }
  

    $scope.deleteData = function(obj) {
        delDialogService(function() {
            console.log('delete...');
            deviceSysTypeList.deleteOne(obj).then(function(data) { $scope.showData._load() })
        
        })
    };
    $scope._oldSelectedRowObj = [];
    // 自定义设备 查看列表数据 
    $scope.selectedRow = function(index, obj) {
        if ($scope._oldSelectedRowObj.length > 0) {
            $scope._oldSelectedRowObj.pop();
        }
        $scope._oldSelectedRowObj.unshift(obj);
        query[DeviceField.SYS_TYPE_ID] = obj[DeviceField.SYS_TYPE_ID];
        $rootScope.query = query;
        deviceTypeList.filter(null, null, function(data) {
                if (data.length > 0) {
                    $scope.isDel = false;
                    console.log('存在子数据...');
                } else {
                    $scope.isDel = true;
                }
                $rootScope.query = null;
            })
            /*    */
    };


    $scope.cancel = function() {
        $mdSidenav('right').close();
    };
    $scope.toggleRight = function(obj) {
        if (obj) {
            $state.go("ibuildweb.category.content.edit", { systype: obj[DeviceField.SYS_TYPE_ID] });
        } else {
            $state.go("ibuildweb.category.content.create");
        }
        // 'No instance found for handle'
        $mdComponentRegistry.when('right').then(function(it) {
            it.toggle();
        });
        $scope.deviceTypeFieldName = angular.copy(obj);
        $scope._deviceTypeFieldName = angular.copy(obj);
    };

}
