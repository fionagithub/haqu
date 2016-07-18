angular.module('content.type', ['ibuildweb.factorys', 'ibuildweb.factorys.services'])
    .controller('typeCtrl', typeCtrl)

function typeCtrl($rootScope, Paginator, delDialogService, deviceInfo, deviceSysTypeList, deviceTypeList, $state, $timeout, $log, $mdSidenav, $scope, $mdComponentRegistry, DeviceField) {
    $scope.$on('$stateChangeSuccess', function() {
        if ($state.current.name == "ibuildweb.category.content") {
            load();
        }
    });
    var query = {},
        oldQuery = {};

    $scope.$on("loadFromParrent", load);

    function load() {
        $rootScope.query = null;
        $scope.searchDeviceType = null;
        $scope.deviceSysTypeData = null;
        $scope.selected = {
            device: null
        };
        $scope.showData = Paginator(deviceTypeList.filter, 10);
        $scope.DeviceField = DeviceField;
        deviceSysTypeList.filter(null, null, function(data) {
            $scope.DeviceSysTypeList = data;
        });
    }
    $scope.sysMap = {};
    var k, v;
    $scope.$watch('DeviceSysTypeList', function() {
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
        /*   delete query[DeviceField.SYS_TYPE_ID];*/
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

    $scope.save = function(obj, type) {
        if (type === 'save') {
            $rootScope.query = query;
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
        obj[DeviceField.SYS_TYPE_ID] = angular.copy($scope.selected.device[DeviceField.SYS_TYPE_ID]);
        deviceTypeList.saveOne(obj, type, function() {
            if ($scope.deviceSysTypeData) {
                query[DeviceField.SYS_TYPE_ID] = $scope.deviceSysTypeData;
                $rootScope.query = query;
            }
            $scope.showData._load()
        })
    }

    $scope.cancel = function() {
        $mdSidenav('right').close();
        $scope.selected = {
            device: null
        };
    };

    $scope.$watch('selected.device ', function() {
        if ($scope.selected.device) {

        }
    });
    $scope.getSelectedText = function(obj) {
        if (obj !== undefined) {
            return obj;
        } else {
            return " ";
        }
    };

    $scope.toggleRight = function(obj) {
        oldQuery = angular.copy($rootScope.query);
        if (obj) {
            $state.go("ibuildweb.category.content.edit", { systype: obj[DeviceField.TYPE_ID] });
            $scope.deviceTypeFieldName = angular.copy(obj);
            $scope.selected.device = obj[DeviceField.SYS_TYPE_ID];
        } else {
            $state.go("ibuildweb.category.content.create");
        }
        // 'No instance found for handle'
        $mdComponentRegistry.when('right').then(function(it) {
            it.toggle();
        });
    };
}

/* */
