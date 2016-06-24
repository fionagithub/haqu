angular.module('content.systype', ['ibuildweb.factorys', 'ibuildweb.factorys.services'])
    .controller('systypeCtrl', systypeCtrl)

function systypeCtrl($scope, $http, $state, $rootScope, $log, API_URI, deviceSysTypeList, deviceTypeList, Paginator, $mdSidenav, $mdComponentRegistry, DeviceField) {

    /*  var fun = function(obj, limit, callback) {
            console.log(obj, limit)
            $http.get(API_URI.DEVICE_TYPE, { params: obj }).success(callback);
        }
        $scope.searchDevice = Paginator(fun, 10);
        $scope.searchDevice.currentPage = 4;*/




    $scope.$on("loadFromParrent", load);
    load();
    var query = {};

    function load() {
        var obj = {};
        obj['skip'] = 0;
        obj.limit = null;
        $rootScope.data = Paginator(null, deviceSysTypeList.filter, obj);
        $scope.DeviceSysTypeList = Paginator(null, deviceSysTypeList.filter, obj);
        obj.limit = 10;
        $scope.searchDevice = Paginator(deviceSysTypeList.filterCount, deviceSysTypeList.filter, obj);
        $scope.DeviceField = DeviceField;
    }

    $scope.$watch('DeviceSysTypeList.data.sysTypeData', function() {
        query[DeviceField.SYS_TYPE_ID] = $scope.DeviceSysTypeList.data.sysTypeData;
        $rootScope.query = query;
    });
    $scope.getSelectedText = function() {
        if ($scope.DeviceSysTypeList.data.sysTypeData) {
            return $scope.DeviceSysTypeList.data.sysTypeData;
        } else {
            return "Please select an item";
        }
    };


    // 自定义设备 查看列表数据 
    $scope.selectedDeviceType = function(index, obj) {
        $scope.selectedIndex = index;
        query[DeviceField.SYS_TYPE_ID] = obj[DeviceField.SYS_TYPE_ID];
        $rootScope.query = query;
        deviceTypeList.filterCount(function(data) {
            if (data.count > 0) {
                $scope.isDel = false;
                console.log('存在子数据...');
            } else {
                $scope.isDel = true;
            }
        })
    };
    // 自定义设备 删除按钮
    $scope.removeDeviceType = function(o) {
        if (!o) return;
        o._status = 'deleted';
        deviceSysTypeList.deleteOne(o).then(function() {
            console.log($rootScope.data.data.length);
            /*  var obj = {};
            obj['limit'] = 10;
         */
            $rootScope.query = {};
            /*
            Paginator(deviceSysTypeList.filterCount, deviceSysTypeList.filter, $scope.searchDevice.field);*/
        });
    };

  
    // 自定义设备 重新保存按钮
    $scope.reSaveDeviceType = function(o) {
        var _device = angular.copy(o);
        _device._status = 'modify';
        deviceSysTypeList.saveOne('reSave', _device).then(function() {
            getData();
        });
    };


    // 自定义设备 保存按钮
    $scope.saveDeviceType = function(o) {
        var obj = angular.copy(o);
        deviceTypeList.isExists(obj).then(function(data) {
            if (data.data.exists) {
                $scope.exists = true;
                $scope.isSave = true;
                console.log('数据已存在...')
            } else {
                $scope.exists = false;
                $scope.isSave = false;
                console.log('saving...');
                obj._status = 'modify';
                deviceSysTypeList.saveOne('save', obj).then(function() {
                    getData();
                });
            }
        })
    };
    $scope.$on('$stateChangeSuccess', function() {

    });
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

    // 自定义设备 取消按钮
    $scope.cancelDeviceType = function() {
        $mdSidenav('right').close()
            .then(function() {
                $log.debug("close RIGHT is done");
            });
    };
}
/*
 $scope.previousPage = function() {
        $scope.page -= 10;
        $scope.selectedIndex = null;
        var obj = {};
        if ($scope.DeviceSysTypeList.data.sysTypeData) {
            obj[DeviceField.SYS_TYPE_ID] = angular.copy($scope.DeviceSysTypeList.data.sysTypeData);
        }
        if ($scope.page == Math.abs($scope.page)) {
            obj._skip = $scope.page;
            sysTypeMap(obj);
            $scope.isLoadEnd = false;
            if ($scope.page == 0) {
                $scope.isLoadTop = true;
            }
        }
    };


    $scope.nextPage = function() {
        $scope.page += 10;
        $scope.selectedIndex = null;
        var obj = {};
        if ($scope.DeviceSysTypeList.data.sysTypeData) {
            obj[DeviceField.SYS_TYPE_ID] = angular.copy($scope.DeviceSysTypeList.data.sysTypeData);
        }
        if ($scope.deviceTypeCount >= $scope.page) {
            obj._skip = $scope.page;
            sysTypeMap(obj);
            $scope.isLoadTop = false;
            if ($scope.page == $scope.deviceTypeCount) {
                $scope.isLoadEnd = true;
            }
        }
    };*/
