angular.module('content.deviceSystype', ['ams.factorys', 'ams.factorys.services'])
    .controller('DeviceSystypeCtrl', DeviceSystypeCtrl)

function DeviceSystypeCtrl($scope, deviceSysTypeList, deviceTypeList, paginator, delDialogService, toastService, DeviceField, $rootScope, $state, $mdSidenav, $mdComponentRegistry) {
    $scope.$on("loadFromParrent", load);
    $scope.$on('$stateChangeSuccess', function() {
        if ($state.current.name == "ams.category.content") {
            load();
        }
    });
    var query = {};

    function load() {
        $scope.data = {
            edit: null
        };
        $rootScope.query = null;
        $scope.showData = paginator(deviceSysTypeList.filter, 10);
        $scope.DeviceField = DeviceField;
    }
    $scope.save = function(obj, type) {
        deviceSysTypeList.saveOne(obj, type, function() {
            toastService();
            $scope.showData._load()
        });
    }

    $scope.deleteData = function(obj) {
        delDialogService(function() {
            console.log('delete...');
            deviceSysTypeList.deleteOne(obj).then(function(data) { $scope.showData._load() })
        })
    };
    $scope._oldSelectedRowObj = [];
    //deviceTypeFieldName 自定义设备 查看列表数据 
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
                delete query[DeviceField.SYS_TYPE_ID];
            })
            /*    */
    };
    $scope.cancel = function() {
        $scope.data = {
            edit: null
        };
        $mdSidenav('right').close();
    };
    $scope.toggleRight = function(obj) {
        if (obj) {
            $state.go("ams.category.content.edit", { id: obj[DeviceField.SYS_TYPE_ID] });
            $scope.data.edit = angular.copy(obj);
        } else {
            $state.go("ams.category.content.create");
            $scope.data = {
                edit: null
            };
        }
        // 'No instance found for handle'
        $mdComponentRegistry.when('right').then(function(it) {
            it.toggle();
        });
    };

}
/*
        $scope.deviceSysTypeData = null;
        deviceSysTypeList.filter(null, null, function(data) {
            $scope.DeviceSysTypeList = data;
        });
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
*/
