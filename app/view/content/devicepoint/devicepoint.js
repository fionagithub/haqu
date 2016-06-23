angular.module('content.devicePoint', ['ibuildweb.factorys', 'ibuildweb.factorys.services'])
    .controller('devicePointCtrl', devicePointCtrl)

function devicePointCtrl($scope, $log, DeviceField, monitorGroup, deviceTypeList, deviceMonitor, $mdSidenav, $state, $mdComponentRegistry) {
    $scope.$on('$stateChangeSuccess', function() {});

    $scope.$on("loadFromParrent", load);
    load();

    function load() {
        $scope.page = null;
        $scope.mdSelectedData = monitorGroup;
        monitorGroup.filter();
        $scope.mdSelectedData.selectedData = null;
        deviceTypeList.filter().then(function(data) {
            $scope.DeviceTypeList = data.data;
        });
        $scope.DeviceField = DeviceField;
        getData();
    }

    function getData() {
        var obj = {};
        /**/
        if ($scope.mdSelectedData.selectedData) {
            obj[DeviceField.MNT_GROUP_ID] = angular.copy($scope.mdSelectedData.selectedData);
        }
        deviceMonitor.filterCount(obj).then(function(data) {
            var count = data.data.count;
            $scope.deviceMonitorCount = Math.floor(count / 10) * 10;
            //是否有上下页
            count && count > 10 ? $scope.isPagination = true : $scope.isPagination = false;
            if ($scope.page) {
                obj._skip = $scope.page;
            }
            obj.limit = 10;
            sysTypeMap(obj);
            $scope.isEditButton = false;
            if ($scope.page == $scope.deviceMonitorCount) {
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
        deviceMonitor.filter(obj).then(function(data) {
            var objList = data.data;
            var device = angular.copy($scope.DeviceTypeList);
            var objMap = angular.copy($scope.mdSelectedData.data);
            for (var s in objList) {
                for (var o in objMap) {
                    if (objList[s][DeviceField.MNT_GROUP_ID] == objMap[o][DeviceField.MNT_GROUP_ID])
                        objList[s][DeviceField.MNT_GROUP_ID] = objMap[o];
                }
            }
            for (var m in objList) {
                for (var n in device) {
                    if (objList[m][DeviceField.TYPE_ID] && objList[m][DeviceField.TYPE_ID] == device[n][DeviceField.TYPE_ID])
                        objList[m][DeviceField.TYPE_ID] = device[n];
                }
            }
            $scope.showDataList = objList;
        });
    }
    $scope.toggleRight = function(obj) {
        if (obj) {
            $state.go("ibuildweb.category.content.edit", { systype: obj[DeviceField.MNT_GROUP_ID][DeviceField.MNT_GROUP_ID] });
            $scope.DeviceTypeList.data = obj[DeviceField.TYPE_ID][DeviceField.TYPE_ID];
            $scope.mdSelectedData._data = obj[DeviceField.MNT_GROUP_ID][DeviceField.MNT_GROUP_ID];
        } else {
            $state.go("ibuildweb.category.content.create");

        }
        // 'No instance found for handle'
        $mdComponentRegistry.when('right').then(function(it) {
            it.toggle();
        });
        $scope.groupFieldName = angular.copy(obj);
        $scope._groupFieldName = angular.copy(obj);
    };

    // 自定义设备 删除按钮
    $scope.removeMonitorGroup = function(o) {
        if (!o) return;
        o._status = 'deleted';
        deviceMonitor.deleteOne(o).then(function() {
            getData();
        });
    };

    // 自定义设备 查看列表数据
    $scope.selectedRow = function(index, obj) {
        $scope.selectedIndex = index;
        $scope.isDel = true;
        /*      monitorType.filterCount(obj).then(function(data) {
            if (data.data.count > 0) {
                $scope.isDel = false;
                console.log('存在子数据...');
            } else {
            }
        })  */

    };


    $scope.getSelectedText = function(obj) {
        if (obj !== undefined) {
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

    // 自定义设备 重新保存按钮
    $scope.resave = function() {
        var obj = {};
        obj[DeviceField.TYPE_ID] = $scope.DeviceTypeList.data;
        obj[DeviceField.MNT_GROUP_ID] = $scope.mdSelectedData._data;
        obj._status = 'modify';
        deviceMonitor.saveOne('reSave', obj).then(function() {
            getData();
        });
    };

    // 自定义设备 保存按钮
    $scope.save = function() {
        var obj = {};
        obj[DeviceField.TYPE_ID] = $scope.DeviceTypeList.data;
        obj[DeviceField.MNT_GROUP_ID] = $scope.mdSelectedData._data;
        deviceMonitor.isExists(obj).then(function(data) {
            if (data.data.exists) {
                $scope.exists = true;
                $scope.isSave = true;
                console.log('数据已存在...')
            } else {
                $scope.exists = false;
                $scope.isSave = false;
                console.log('saving...');
                obj._status = 'modify';
                deviceMonitor.saveOne('save', obj).then(function() {
                    getData();
                });
            }
        })
    };
    $scope.$watch('page', function() {
        $scope.$broadcast('page', $scope.page);
    });

    $scope.searchMonitorGroup = function() {
        $scope.selectedIndex = null;
        getData()
    };

    $scope.previousPage = function() {
        $scope.page -= 10;
        $scope.selectedIndex = null;
        var obj = {};
        if ($scope.mdSelectedData.selectedData) {
            obj[DeviceField.MNT_GROUP_ID] = angular.copy($scope.mdSelectedData.selectedData);
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
        if ($scope.mdSelectedData.selectedData) {
            obj[DeviceField.MNT_GROUP_ID] = angular.copy($scope.mdSelectedData.selectedData);
        }


        if ($scope.monitorGroupCount >= $scope.page) {
            obj._skip = $scope.page;
            sysTypeMap(obj);
            $scope.isLoadTop = false;
            if ($scope.page == $scope.monitorGroupCount) {
                $scope.isLoadEnd = true;
            }
        }
    };


}
