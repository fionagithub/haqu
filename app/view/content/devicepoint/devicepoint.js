angular.module('content.devicePoint', ['ibuildweb.factorys', 'ibuildweb.factorys.services'])
    .controller('devicePointCtrl', devicePointCtrl)

function devicePointCtrl($scope, delDialogService,toastService, monitorType, devicePoint, $rootScope, Paginator, $timeout, $mdSidenav, $state, $mdComponentRegistry, DeviceField) {
    $scope.$on("loadFromParrent", load);
    $scope.$on('$stateChangeSuccess', function() {
        if ($state.current.name == "ibuildweb.category.content") {
            load();
        }
    });
    var query = {};

    function load() {
        $rootScope.query = null;
        $scope.showData = Paginator(devicePoint.filter, 10);
        $scope.DeviceField = DeviceField;
        monitorType.filter(null, null, function(data) {
            $scope.MonitorType = data;
        });
        $scope.selected = {
            data: null
        };
    }

    $scope.search = function() {
        $rootScope.query = query;
        $scope.showData._load(0);
    }
    $scope.$watch('selectedData', function() {
        if ($scope.selectedData) {
            query[DeviceField.MNT_TYPE_ID] = angular.copy($scope.selectedData[DeviceField.MNT_TYPE_ID]);
        } else {
            delete query[DeviceField.MNT_TYPE_ID];
        }
    });

    $scope.monitorMap = {};
    var k, v;
    $scope.$watch('MonitorType', function() {
        if ($scope.MonitorType) {
            for (var i in $scope.MonitorType) {
                k = $scope.MonitorType[i][DeviceField.MNT_TYPE_ID];
                v = $scope.MonitorType[i][DeviceField.DESC];
                $scope.monitorMap[k] = v;
            }
        }
    });

    $scope._oldSelectedRowObj = [];
    $scope.selectedRow = function(index, obj) {
        $scope.isDel = true;
        if ($scope._oldSelectedRowObj.length > 0) {
            $scope._oldSelectedRowObj.pop();
        }
        $scope._oldSelectedRowObj.unshift(obj);
    };


    $scope.toggleRight = function(obj) {
        if (obj) {
            $state.go("ibuildweb.category.content.edit", { systype: obj[DeviceField.DEVICE_ID] });
            /**/
            $scope.selected.data = obj[DeviceField.MNT_TYPE_ID];
        } else {
            $state.go("ibuildweb.category.content.create");
        }
        // 'No instance found for handle'
        $mdComponentRegistry.when('right').then(function(it) {
            it.toggle();
        });
        /*  */
        $scope.groupFieldName = angular.copy(obj);
    };

    $scope.save = function(obj, type) {
        obj[DeviceField.MNT_TYPE_ID] = $scope.selected.data;
        devicePoint.saveOne(obj, type, function() {
            if ($scope.selectedData) {
                query[DeviceField.MNT_TYPE_ID] = angular.copy($scope.selectedData[DeviceField.MNT_TYPE_ID]);
                $rootScope.query = query;
            }
            toastService();
            $scope.showData._load()
        });
    }

    $scope.deleteData = function(obj) {
        delDialogService(function() {
            console.log('delete...');
            devicePoint.deleteOne(obj).then(function(data) {
                if ($scope.selectedData) {
                    query[DeviceField.MNT_TYPE_ID] = angular.copy($scope.selectedData[DeviceField.MNT_TYPE_ID]);
                    $rootScope.query = query;
                }
                $scope.showData._load()
            })
        })
    };



    $scope.cancel = function() {
        $mdSidenav('right').close();
    };
}