angular.module('content.deviceInfo', ['ibuildweb.factorys', 'ibuildweb.factorys.services'])
    .controller('deviceInfoCtrl', deviceInfoCtrl)

function deviceInfoCtrl($scope, $rootScope, deviceInfo, map, deviceTypeList, Paginator, $timeout, $log, $mdSidenav, $state, $mdComponentRegistry, DeviceField) {
    $scope.$on("loadFromParrent", load);
    $scope.$on('$stateChangeSuccess', function() {
        if ($state.current.name == "ibuildweb.category.content") {
            load();
        }
    });

    var query = {};

    function load() {
        $rootScope.query = null;
        $scope.showData = Paginator(deviceInfo.filter, 10);
        $scope.DeviceField = DeviceField;
        $scope.sysTypeData = null;

        map.filter(null, null, function(data) {
            $scope.mapData = data;
        });
        deviceTypeList.filter(null, null, function(data) {
            $scope.DeviceTypeList = data;
            //  sysIdMap();
        });
        $timeout(sysIdMap, 100);
    }

    $scope.$watch('showData.data', sysIdMap);

    function sysIdMap() {
        for (var s in $scope.showData.data) {
            for (var o in $scope.DeviceTypeList) {
                if ($scope.showData.data[s][DeviceField.TYPE_ID] == $scope.DeviceTypeList[o][DeviceField.TYPE_ID])
                    $scope.showData.data[s][DeviceField.TYPE_ID] = $scope.DeviceTypeList[o];
            }
        }

        for (var m in $scope.showData.data) {
            for (var n in $scope.mapData) {
                if ($scope.showData.data[m][DeviceField.MAP_ID] && $scope.showData.data[m][DeviceField.MAP_ID] == $scope.mapData[n][DeviceField.MAP_ID])
                    $scope.showData.data[m][DeviceField.MAP_ID] = $scope.mapData[n];
            }
        }

    }

    $scope.search = function() {
        $rootScope.query = query;
        $scope.showData._load(0);
    }

    $scope.$watch('sysTypeData', function() {
        if ($scope.sysTypeData) {
            query[DeviceField.TYPE_ID] = angular.copy($scope.sysTypeData);
        } else {
            delete query[DeviceField.TYPE_ID];
        }
    });


    $scope.save = function(obj, type) {
        /*        if (type === 'save') {
                    deviceTypeList.isExists(obj).then(function(data) {
                        if (data.data.exists) {
                            console.log('数据已存在...')
                        } else {
                            save(obj, type);
                        }
                    })
                } else {
                }*/
        save(obj, type);
    }

    function save(obj, type) {
        obj[DeviceField.MAP_ID] = $scope.mapData.editData;
        obj[DeviceField.TYPE_ID] = $scope.DeviceTypeList.editData;
        deviceInfo.saveOne(obj, type).then(function() { $scope.showData._load() });
    }

    $scope.delete = function(obj) {
        deviceInfo.deleteOne(obj).then(function(data) { $scope.showData._load() })
    }

    $scope.getSelectedText = function(o) {
        if (o) {
            return o;
        } else {
            return " ";
        }
    };

    $scope._oldSelectedRowObj = [];
    // 自定义设备 查看列表数据 
    $scope.selectedRow = function(index, obj) {
        if ($scope._oldSelectedRowObj.length > 0) {
            $scope._oldSelectedRowObj.pop();
        }
        $scope._oldSelectedRowObj.unshift(obj);
        /*   query[DeviceField.SYS_TYPE_ID] = obj[DeviceField.SYS_TYPE_ID];
        $rootScope.query = query;
        deviceTypeList.filter(null, null, function(data) {
                if (data.length > 0) {
                    $scope.isDel = false;
                    console.log('存在子数据...');
                } else {
                    $scope.isDel = true;
                }
                $rootScope.query = null;
            })
            */
    };

    $scope.cancel = function() {
        $mdSidenav('right').close();
    };
    $scope.toggleRight = function(obj) {
        if (obj) {
            $state.go("ibuildweb.category.content.edit", { systype: obj[DeviceField.DEVICE_ID] });
            $scope.mapData.editData = obj[DeviceField.MAP_ID][DeviceField.MAP_ID];
            $scope.DeviceTypeList.editData = obj[DeviceField.TYPE_ID][DeviceField.TYPE_ID];
        } else {
            $state.go("ibuildweb.category.content.create");
        }
        // 'No instance found for handle'
        $mdComponentRegistry.when('right').then(function(it) {
            it.toggle();
        });
        $scope.groupFieldName = angular.copy(obj);
    };

}
