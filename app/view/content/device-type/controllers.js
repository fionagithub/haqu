angular.module('content.deviceType', ['ams.factorys', 'ams.factorys.services'])
    .controller('DeviceTypeCtrl', DeviceTypeCtrl)
    .controller('DeviceTypeDetailCtrl', DeviceTypeDetailCtrl)

function DeviceTypeCtrl($scope, deviceTypeList, deviceSysTypeList, deviceInfo, paginator, delDialogService, toastService, DeviceField, $rootScope, $state, $stateParams, $mdSidenav, $mdComponentRegistry) {
    $scope.$on("loadFromParrent", load);
    $scope.$on('$stateChangeSuccess', function() {
        if ($state.current.name == "ams.category.content") {
            load();
        }
    });

    var query = {};

    function load() {
        $rootScope.query = null;
        //搜索条件    
        $scope.selected = {
            searchDeviceType: null,
            deviceSysTypeData: null
        };
        $scope.showData = paginator(deviceTypeList.filter, 10);
        $rootScope.showData = $scope.showData;
        deviceSysTypeList.filter(null, null, function(data) {
            $scope.DeviceSysTypeList = data;
        });
    }

    $scope.toggleRight = function(obj) {
        var uri = {
            category: $stateParams.category
        };
        if (obj) {
            uri.id = obj[DeviceField.TYPE_ID];
            $state.go("ams.category.content.edit", uri);
            $rootScope.groupFieldName = angular.copy(obj);
        } else {
            $state.go("ams.category.content.create");
        }
        // 'No instance found for handle'
        $mdComponentRegistry.when('right').then(function(it) {
            it.toggle();
        });
    };

    //数据列表中匹配父名称
    $scope.$watch('DeviceSysTypeList', function() {
        var k, v;
        $scope.sysMap = {};
        if ($scope.DeviceSysTypeList) {
            for (var i in $scope.DeviceSysTypeList) {
                k = $scope.DeviceSysTypeList[i][DeviceField.SYS_TYPE_ID];
                v = $scope.DeviceSysTypeList[i][DeviceField.SYS_TYPE_NAME];
                $scope.sysMap[k] = v;
            }
        }
    });


    $scope.deleteData = function(obj) {
        delDialogService(function() {
            console.log('delete...');
            deviceTypeList.deleteOne(obj).then(function(data) {
                $rootScope.query = angular.copy(query);
                $scope.showData._load(0);
            })
        })
    };

    //搜索条件 
    $scope.$watch('selected.searchDeviceType', function() {
        if ($scope.selected.searchDeviceType) {
            query[DeviceField.TYPE_NAME] = { "like": '%' + angular.copy($scope.selected.searchDeviceType) + '%' };
            console.log("----" + query);
        } else {
            delete query[DeviceField.TYPE_NAME];
        }
    });

    $scope.$watch('selected.deviceSysTypeData', function() {
        if ($scope.selected.deviceSysTypeData) {
            query[DeviceField.SYS_TYPE_ID] = angular.copy($scope.selected.deviceSysTypeData);
        } else {
            delete query[DeviceField.SYS_TYPE_ID];
        }
    });
    $scope.search = function() {
        $rootScope.query = angular.copy(query);
        $rootScope.search = angular.copy(query);
        $scope.showData._load(0);
    }

    $scope._oldSelectedRowObj = [];
    // 自定义设备 查看列表数据 
    $scope.selectedRow = function(index, obj) {
        if ($scope._oldSelectedRowObj.length > 0) {
            $scope._oldSelectedRowObj.pop();
        }
        $scope._oldSelectedRowObj.unshift(obj);
        query = {};
        query[DeviceField.TYPE_ID] = obj[DeviceField.TYPE_ID];
        $rootScope.query = angular.copy(query);
        deviceInfo.filter(null, null, function(data) {
            if (data.length > 0) {
                $scope.isDel = false;
                console.log('存在子数据...');
            } else {
                $scope.isDel = true;
            }
            delete query[DeviceField.TYPE_ID];

        })
    };
}

function DeviceTypeDetailCtrl($scope, deviceTypeList, toastService, $rootScope, $mdSidenav) {
    $scope.save = function(obj, type) {
        deviceTypeList.saveOne(obj, type, function() {
            toastService();
            $rootScope.groupFieldName = null;
            $rootScope.query = angular.copy($rootScope.search);
            $rootScope.search = null;
            $rootScope.showData._load();
        });
    };

    $scope.cancel = function() {
        $mdSidenav('right').close();
        $rootScope.groupFieldName = null;
    };
}
