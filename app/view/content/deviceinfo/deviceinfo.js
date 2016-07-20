angular.module('content.deviceInfo', ['ibuildweb.factorys', 'ibuildweb.factorys.services'])
    .controller('deviceInfoCtrl', deviceInfoCtrl)

function deviceInfoCtrl($scope, $rootScope, devicePoint, delDialogService,toastService, deviceInfo, map, deviceTypeList, Paginator, $timeout, $log, $mdSidenav, $state, $mdComponentRegistry, DeviceField) {
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
        $scope.selected = {
            data: null,
            device: null,
            map: null
        };

        map.filter(null, null, function(data) {
            $scope.mapData = data;
        });
        deviceTypeList.filter(null, null, function(data) {
            $scope.DeviceTypeList = data;
        });
    }

    $scope.deviceMap = {};
    $scope.mapMap = {};
    var k, v;
    $scope.$watch('DeviceTypeList', function() {
        if ($scope.DeviceTypeList) {
            for (var i in $scope.DeviceTypeList) {
                k = $scope.DeviceTypeList[i][DeviceField.TYPE_ID];
                v = $scope.DeviceTypeList[i][DeviceField.TYPE_NAME];
                $scope.deviceMap[k] = v;
            }
        }
    });

    $scope.$watch('mapData', function() {
        if ($scope.mapData) {
            for (var i in $scope.mapData) {
                k = $scope.mapData[i][DeviceField.MAP_ID];
                v = $scope.mapData[i][DeviceField.MAP_NAME];
                $scope.mapMap[k] = v;
            }
        }
    });

    $scope.search = function() {
        $rootScope.query = query;
        $scope.showData._load(0);
    }

    $scope.$watch('selected.data', function() {
        if ($scope.selected.data) {
            query[DeviceField.TYPE_ID] = angular.copy($scope.selected.data[DeviceField.TYPE_ID]);
        } else {
            delete query[DeviceField.TYPE_ID];
        }
    });


    $scope.save = function(obj, type) {
        obj[DeviceField.MAP_ID] = $scope.selected.map;
        obj[DeviceField.TYPE_ID] = $scope.selected.device;
        deviceInfo.saveOne(obj, type, function() {
            if ($scope.selected.data) {
                query[DeviceField.TYPE_ID] = angular.copy($scope.selected.data[DeviceField.TYPE_ID]);
                $rootScope.query = query;
            }
            toastService();
            $scope.showData._load()
        });

    }
 $scope.deleteData = function(obj) {
           delDialogService(function() {
               console.log('delete...');
           
            deviceInfo.deleteOne(obj).then(function(data) { $scope.showData._load() })
           })
       };

 


    $scope._oldSelectedRowObj = [];
    // 自定义设备 查看列表数据 
    $scope.selectedRow = function(index, obj) {
        if ($scope._oldSelectedRowObj.length > 0) {
            $scope._oldSelectedRowObj.pop();
        }
        $scope._oldSelectedRowObj.unshift(obj);

        query[DeviceField.DEVICE_ID] = obj[DeviceField.DEVICE_ID];
        $rootScope.query = query;
        devicePoint.filter(null, null, function(data) {
            if (data.length > 0) {
                $scope.isDel = false;
                console.log('存在子数据...');
            } else {
                $scope.isDel = true;
            }
            $rootScope.query = null;
        })
    };

    $scope.cancel = function() {
        $mdSidenav('right').close();
    };
    $scope.toggleRight = function(obj) {
        if (obj) {
            $state.go("ibuildweb.category.content.edit", { systype: obj[DeviceField.DEVICE_ID] });
            if (obj[DeviceField.MAP_ID]) {
                $scope.selected.map = obj[DeviceField.MAP_ID];
            }
            if (obj[DeviceField.TYPE_ID]) {
                $scope.selected.device = obj[DeviceField.TYPE_ID];
            }
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
