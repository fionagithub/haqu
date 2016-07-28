angular.module('content.deviceType', ['ams.factorys', 'ams.factorys.services'])
    .controller('DeviceTypeCtrl', DeviceTypeCtrl)

function DeviceTypeCtrl($scope, deviceTypeList, deviceSysTypeList, deviceInfo, paginator, delDialogService, toastService, DeviceField, $rootScope, $state, $stateParams, $mdSidenav, $mdComponentRegistry) {
    $scope.$on('$stateChangeSuccess', function() {
        if ($state.current.name == "ams.category.content") {
            load();
        }
    });
    var query = {};

    $scope.$on("loadFromParrent", load);

    function load() {
        $rootScope.query = null;

        //搜索条件
        $scope.searchDeviceType = null;
        $scope.deviceSysTypeData = null;
        $scope.showData = paginator(deviceTypeList.filter, 10);
        $scope.DeviceField = DeviceField;
        deviceSysTypeList.filter(null, null, function(data) {
            $scope.DeviceSysTypeList = data;
        });
    }

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
        console.log($scope.sysMap)
    });

    $scope.$watch('searchDeviceType', function() {
        if ($scope.searchDeviceType) {
            query[DeviceField.TYPE_NAME] = { "like": '%' + angular.copy($scope.searchDeviceType) + '%' };
            console.log("----" + query);
        } else {
            delete query[DeviceField.TYPE_NAME];
        }
    });
    $scope.$watch('deviceSysTypeData', function() {
        if ($scope.deviceSysTypeData) {
            query[DeviceField.SYS_TYPE_ID] = angular.copy($scope.deviceSysTypeData);
        } else {
            delete query[DeviceField.SYS_TYPE_ID];
        }
    });

    $scope.toggleRight = function(obj) {
        var uri = {
            category: $stateParams.category
        };
        var relatedData = {
            'DeviceField': $scope.DeviceField,
            'DeviceSysTypeList': $scope.DeviceSysTypeList
        };
        $scope.$emit('relatedData', relatedData);

        if (obj) {
            uri.id = obj[DeviceField.TYPE_ID];
            $state.go("ams.category.content.edit", uri);
            $scope.$emit('groupFieldName', angular.copy(obj));
        } else {
            $state.go("ams.category.content.create");
            $scope.$emit('reopen');
        }
        // 'No instance found for handle'
        $mdComponentRegistry.when('right').then(function(it) {
            it.toggle();
        });
    };
    $scope.deleteData = function(obj) {
        delDialogService(function() {
            console.log('delete...');
            deviceTypeList.deleteOne(obj).then(function(data) {
                if ($scope.deviceSysTypeData) {
                    query[DeviceField.SYS_TYPE_ID] = angular.copy($scope.deviceSysTypeData);
                    $rootScope.query = query;
                }
                $scope.showData._load(0);
            })
        })
    };
    $scope.search = function() {
        $rootScope.query = query;
        $scope.showData._load(0);
    }

    $scope._oldSelectedRowObj = [];
    // 自定义设备 查看列表数据 
    $scope.selectedRow = function(index, obj) {
        if ($scope._oldSelectedRowObj.length > 0) {
            $scope._oldSelectedRowObj.pop();
        }
        $scope._oldSelectedRowObj.unshift(obj);
        query = [];
        query[DeviceField.TYPE_ID] = obj[DeviceField.TYPE_ID];
        $rootScope.query = query;
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

    $scope.$on("saveFromParent", function(event, obj, type) {
        obj ? obj : obj = {};
        deviceTypeList.saveOne(obj, type, function() {
            delete query[DeviceField.SYS_TYPE_ID];
            if ($scope.deviceSysTypeData) {
                query[DeviceField.SYS_TYPE_ID] = $scope.deviceSysTypeData;
                $rootScope.query = query;
            }
            toastService();
            $scope.showData._load()
        })
    })
}
