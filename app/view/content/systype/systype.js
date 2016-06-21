angular.module('content.systype', ['ibuildweb.factorys', 'ibuildweb.factorys.services'])
    .controller('systypeCtrl', systypeCtrl)

function systypeCtrl($scope, $state, $log, deviceSysTypeList,deviceTypeList, $mdSidenav, $mdComponentRegistry, DeviceField) {

    $scope.$on("loadFromParrent", load);
    load();

    function load() {
        $scope.page = null;
        $scope.DeviceSysTypeList = deviceSysTypeList;
        deviceSysTypeList.filter();
        $scope.DeviceSysTypeList.data.sysTypeData = null;
        $scope.DeviceField = DeviceField;
        getData();
    }
    $scope.getSelectedText = function() {
        if ($scope.DeviceSysTypeList.data.sysTypeData) {
            return $scope.DeviceSysTypeList.data.sysTypeData;
        } else {
            return "Please select an $scope.systemType";
        }
    };

    function getData() {
        var obj = {};
        if ($scope.DeviceSysTypeList.data.sysTypeData) {
            obj[DeviceField.SYS_TYPE_ID] = angular.copy($scope.DeviceSysTypeList.data.sysTypeData);
        }

        deviceSysTypeList.filterCount(obj).then(function(data) {
            var count = data.data.count;
            $scope.deviceTypeCount = Math.floor(count / 10) * 10;
            console.log($scope.deviceTypeCount)
                //是否有上下页
            count && count > 10 ? $scope.isPagination = true : $scope.isPagination = false;
            if ($scope.page)
                obj._skip = $scope.page;
            sysTypeMap(obj);
            $scope.isEditButton = false;
            if ($scope.page == $scope.deviceTypeCount) {
                $scope.isLoadEnd = true;
                $scope.isLoadTop = false;
                //  $scope.page -= 10;
            } else {
                $scope.isLoadEnd = false;
                $scope.isLoadTop = true;
            }
        });
    }

    function sysTypeMap(obj) {
        deviceSysTypeList.filter(obj).then(function(data) {
            var objList = data.data;
            $scope.showDeviceTypeList = objList;
        });
    }
    $scope.$watch('page', function() {
        $scope.$broadcast('page', $scope.page);
    });

    // 自定义设备 查看列表数据 
    $scope.selectedDeviceType = function(index, obj) {
        $scope.selectedIndex = index;
        deviceTypeList.filterCount(obj).then(function(data) {
            if (data.data.count > 0) {
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
            getData();
        });
    };

    $scope.searchDevice = function() {
        $scope.selectedIndex = null;
        $scope.page=null;
        getData()
    };

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
