angular.module('content.type', ['ibuildweb.factorys', 'ibuildweb.factorys.services'])
    .controller('typeCtrl', typeCtrl)
    /*, DeviceTypeList, DeviceSysTypeList, 
            'ui.router', 'ngMaterial', 'ngMessages', 'material.svgAssetsCache'*/
function typeCtrl($scope, deviceSysTypeList, deviceTypeList, $state, $log, $mdSidenav, $mdComponentRegistry, DeviceField) {
    $scope.$on('$stateChangeSuccess', function() {});
    $scope.$on("loadFromParrent", load);
    load();
    $scope.$watch('page', function() {
        $scope.$broadcast('pageOfType', $scope.page);
    });

    function load() {
        $scope.page = null;
        $scope.searchDeviceType = null;

        $scope.DeviceSysTypeList = deviceSysTypeList;
        deviceSysTypeList.filter();
        $scope.DeviceSysTypeList.data.sysTypeData = null;
        $scope.DeviceField = DeviceField;
        getData();
    }

    function getData() {
        var obj = {};
        if ($scope.DeviceSysTypeList.data.sysTypeData) {
            obj[DeviceField.SYS_TYPE_ID] = angular.copy($scope.DeviceSysTypeList.data.sysTypeData);
        }
        if ($scope.searchDeviceType) {
            obj[DeviceField.TYPE_NAME] = angular.copy($scope.searchDeviceType);
        }


        deviceTypeList.filterCount(obj).then(function(data) {
            var count = data.data.count;
            $scope.deviceTypeCount = Math.floor(count / 10) * 10;
            console.log($scope.deviceTypeCount)
                //是否有上下页
            count && count > 10 ? $scope.isPagination = true : $scope.isPagination = false;
            if ($scope.page) {
                obj._skip = $scope.page;
            }
            obj.limit = 10;
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
        deviceTypeList.filter(obj).then(function(data) {
            var objList = data.data;
            var objMap = angular.copy($scope.DeviceSysTypeList.data);
            for (var s in objList) {
                for (var o in objMap) {
                    if (objList[s][DeviceField.SYS_TYPE_ID] == objMap[o][DeviceField.SYS_TYPE_ID])
                        objList[s][DeviceField.SYS_TYPE_ID] = objMap[o];
                }
            }
            $scope.showDeviceTypeList = objList;
        });
    }
    $scope.getSelectedText = function(obj) {
        if (obj !== undefined) {
            // $scope.DeviceSysTypeList.data = obj;
            return obj;
        } else {
            return "Please select an item";
        }
    };

    // 自定义设备 取消按钮
    $scope.cancelDeviceType = function() {
        $mdSidenav('right').close()
            .then(function() {
                $log.debug("close RIGHT is done");
            });
    };
    $scope.toggleRight = function(obj) {
        if (obj) {
            $state.go("ibuildweb.category.content.edit", { systype: obj[DeviceField.TYPE_ID] });
            $scope.deviceTypeFieldName = angular.copy(obj);
            $scope._deviceTypeFieldName = angular.copy(obj);
            $scope.DeviceSysTypeList.data.editSysTypeData = obj[DeviceField.SYS_TYPE_ID][DeviceField.SYS_TYPE_ID];
        } else {
            $state.go("ibuildweb.category.content.create");
        }
        // 'No instance found for handle'
        $mdComponentRegistry.when('right').then(function(it) {
            it.toggle();
        });
    };
    // 自定义设备 查看列表数据 
    $scope.selectedDeviceType = function(index, obj) {
        $scope.selectedIndex = index;
    };
    // 自定义设备 删除按钮
    $scope.removeDeviceType = function(o) {
        if (!o) return;
        o._status = 'deleted';
        deviceTypeList.deleteOne(o).then(function() {
            getData();
        });
    };

    $scope.searchDevice = function() {
        $scope.selectedIndex = null;
        getData()
    };

    $scope.previousPage = function() {
        $scope.page -= 10;
        $scope.selectedIndex = null;
        var obj = {};
        if ($scope.DeviceSysTypeList.data.sysTypeData) {
            obj[DeviceField.SYS_TYPE_ID] = angular.copy($scope.DeviceSysTypeList.data.sysTypeData);
        }
        if ($scope.searchDeviceType) {
            obj[DeviceField.TYPE_NAME] = angular.copy($scope.searchDeviceType);
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
        if ($scope.searchDeviceType) {
            obj[DeviceField.TYPE_NAME] = angular.copy($scope.searchDeviceType);
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
        var obj = angular.copy(o);
        obj[DeviceField.SYS_TYPE_ID] = $scope.DeviceSysTypeList.data.editSysTypeData;
        obj._status = 'modify';
        deviceTypeList.saveOne('reSave', obj).then(function() {
            getData();
        });
    };


    // 自定义设备 保存按钮
    $scope.saveDeviceType = function(o) {
        var obj = angular.copy(o);
        obj[DeviceField.SYS_TYPE_ID] = $scope.DeviceSysTypeList.data.editSysTypeData;
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
                deviceTypeList.saveOne('save', obj).then(function() {
                    getData();
                });
            }
        })
    };

}
