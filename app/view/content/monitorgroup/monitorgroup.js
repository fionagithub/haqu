angular.module('content.monitorgroup', ['ibuildweb.factorys', 'ibuildweb.factorys.services'])
    .controller('monitorgroupCtrl', monitorgroupCtrl)

function monitorgroupCtrl($scope, $log, DeviceField, monitorGroup, monitorType, $mdSidenav, $state, $mdComponentRegistry) {
    $scope.$on('$stateChangeSuccess', function() {});

    $scope.$on("loadFromParrent", load);
    load();

    function load() {
        $scope.page = null;
        $scope.MonitorGroupList = monitorGroup;
        $scope.MonitorGroupList.data.groupData = null;
        monitorGroup.filter();
        $scope.DeviceField = DeviceField;
        getData();
    }

    function getData() {
        var obj = {};
        if ($scope.MonitorGroupList.data.groupData) {
            obj[DeviceField.MNT_GROUP_ID] = angular.copy($scope.MonitorGroupList.data.groupData);
        }

        monitorGroup.filterCount(obj).then(function(data) {
            var count = data.data.count;
            $scope.monitorGroupCount = Math.floor(count / 10) * 10;
            //是否有上下页
            count && count > 10 ? $scope.isPagination = true : $scope.isPagination = false;
            if ($scope.page) {
                obj._skip = $scope.page;
            }
            obj.limit = 10;
            sysTypeMap(obj);
            $scope.isEditButton = false;
            if ($scope.page == $scope.monitorGroupCount) {
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
        monitorGroup.filter(obj).then(function(data) {
            var objList = data.data;
            $scope.showMonitorGroup = objList;
        });
    }

    // 自定义设备 删除按钮
    $scope.removeMonitorGroup = function(o) {
        if (!o) return;
        o._status = 'deleted';
        monitorGroup.deleteOne(o).then(function() {
            getData();
        });
    };

    // 自定义设备 查看列表数据
    $scope.selectedMonitorGroup = function(index, obj) {
        $scope.selectedIndex = index;
        /*   */
        monitorType.filterCount(obj).then(function(data) {
            if (data.data.count > 0) {
                $scope.isDel = false;
                console.log('存在子数据...');
            } else {
                $scope.isDel = true;
            }
        })
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
    $scope.toggleRight = function(obj) {
        if (obj) {
            $state.go("ibuildweb.category.content.edit", { systype: obj[DeviceField.MNT_GROUP_ID] });

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

    // 自定义设备 重新保存按钮
    $scope.reSaveGroupType = function(o) {
        var obj = angular.copy(o);
        obj._status = 'modify';
        monitorGroup.saveOne('reSave', obj).then(function() {
            getData();
        });
    };

    // 自定义设备 保存按钮
    $scope.saveGroupType = function(o) {
        var obj = angular.copy(o);
        monitorGroup.isExists(obj).then(function(data) {
            if (data.data.exists) {
                $scope.exists = true;
                $scope.isSave = true;
                console.log('数据已存在...')
            } else {
                $scope.exists = false;
                $scope.isSave = false;
                console.log('saving...');
                obj._status = 'modify';
                monitorGroup.saveOne('save', obj).then(function() {
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
        if ($scope.MonitorGroupList.data.groupData) {
            obj[DeviceField.MNT_GROUP_ID] = angular.copy($scope.MonitorGroupList.data.groupData);
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
        if ($scope.MonitorGroupList.data.groupData) {
            obj[DeviceField.MNT_GROUP_ID] = angular.copy($scope.MonitorGroupList.data.groupData);
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
