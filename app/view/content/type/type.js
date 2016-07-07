angular.module('content.type', ['ibuildweb.factorys', 'ibuildweb.factorys.services'])
    .controller('typeCtrl', typeCtrl)

function typeCtrl($rootScope, Paginator, $mdDialog,deviceInfo, deviceSysTypeList, deviceTypeList, $state, $timeout, $log, $mdSidenav, $scope, $mdComponentRegistry, DeviceField) {
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
        $scope.sysTypeData = null;
        $scope.showData = Paginator(deviceTypeList.filter, 10);
        $scope.DeviceField = DeviceField;
        deviceSysTypeList.filter(null, null, function(data) {
            $scope.DeviceSysTypeList = data;
            //  sysIdMap();
        });
        $timeout(sysIdMap, 100);
    }

    $scope.search = function() {
        $rootScope.query = query;
        $scope.showData._load(0);
    }

    $scope.$watch('sysTypeData', function() {
        if ($scope.sysTypeData) {
            query[DeviceField.SYS_TYPE_ID] = angular.copy($scope.sysTypeData);
            console.log("----" + query);
        } else {
            delete query[DeviceField.SYS_TYPE_ID];
        }
    });

    $scope.$watch('searchDeviceType', function() {
        if ($scope.searchDeviceType) {
            query[DeviceField.TYPE_NAME] = { "like": '%' + angular.copy($scope.searchDeviceType) + '%' };
            console.log("----" + query);
        } else {
            delete query[DeviceField.TYPE_NAME];
        }
    });

    function sysIdMap() {
        for (var s in $scope.showData.data) {
            for (var o in $scope.DeviceSysTypeList) {
                if ($scope.showData.data[s][DeviceField.SYS_TYPE_ID] == $scope.DeviceSysTypeList[o][DeviceField.SYS_TYPE_ID])
                    $scope.showData.data[s][DeviceField.SYS_TYPE_ID] = $scope.DeviceSysTypeList[o];
            }
        }
    }

    $scope.$watch('showData.data', sysIdMap);

    $scope.getSelectedText = function(obj) {
        if (obj !== undefined) {
            return obj;
        } else {
            return " ";
        }
    };

    $scope.$watch('DeviceSysTypeList.editOptionData', function() {
        if ($state.current.name == "ibuildweb.category.content.create") {
            query = {};
            if ($scope.DeviceSysTypeList.editOptionData) {
                query[DeviceField.SYS_TYPE_ID] = $scope.DeviceSysTypeList.editOptionData;
                console.log("----" + query);
            } else {
                delete query[DeviceField.SYS_TYPE_ID];
            }
        }

    });

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
        obj[DeviceField.SYS_TYPE_ID] = $scope.DeviceSysTypeList.editOptionData;
        deviceTypeList.saveOne(obj, type, function() {
            console.log('save....');
            $rootScope.query = oldQuery;
            $scope.showData._load()
        })
    }

    $scope.cancel = function() {
        $mdSidenav('right').close();
    };



    $scope.delete = function(ev, obj) {
        var confirm = $mdDialog.confirm()
            .title('确定要删除这条数据么?')
            .ok('确定')
            .cancel('取消');

        $mdDialog.show(confirm).then(function() {
            console.log('delete...');
            deviceTypeList.deleteOne(obj).then(function(data) { $scope.showData._load() })
        }, function() {
            console.log('cancel...');
        });
    };

    $scope.toggleRight = function(obj) {
        oldQuery = angular.copy($rootScope.query);
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
        if ($scope._oldSelectedRowObj.length > 0) {
            $scope._oldSelectedRowObj.pop();
        }
        $scope._oldSelectedRowObj.unshift(obj);
        
        query[DeviceField.TYPE_ID] = obj[DeviceField.TYPE_ID];
        $rootScope.query = query;
        deviceInfo.filter(null, null, function(data) {
            if (data.length > 0) {
                $scope.isDel = false;
                console.log('存在子数据...');
            } else {
                $scope.isDel = true;
            }
            $rootScope.query = null;
        })
    };




}
