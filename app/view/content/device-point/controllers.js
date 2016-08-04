angular.module('content.devicePoint', ['ams.factorys', 'ams.factorys.services'])
    .controller('DevicePointCtrl', DevicePointCtrl)
    .controller('DevicePointDetailCtrl', DevicePointDetailCtrl)

function DevicePointCtrl($scope, devicePoint, monitorType, paginator, delDialogService,  DeviceField, $rootScope, $state, $stateParams, $mdSidenav, $mdComponentRegistry) {
    $scope.$on("loadFromParrent", load);
    $scope.$on('$stateChangeSuccess', function() {
        if ($state.current.name == "ams.category.content") {
            load();
        }
    });
    var query = {};

    function load() {
        $scope.selected = {
            data: null
        };
        $rootScope.query = null;
        $scope.showData = paginator(devicePoint.filter, 10);
        $scope.DeviceField = DeviceField;
        monitorType.filter(null, null, function(data) {
            $scope.MonitorType = data;
            $rootScope.MonitorType = angular.copy(data);
        });
    }

    $scope.toggleRight = function(obj) {
        var uri = {
            category: $stateParams.category
        }; 
        if (obj) {
            uri.id = obj[DeviceField.DEVICE_ID]; 
            $state.go("ams.category.content.edit", uri);
            $rootScope.groupFieldName = angular.copy(obj);
        } else {
            $state.go("ams.category.content.create");
            $rootScope.groupFieldName = null;
        }
        // 'No instance found for handle'
        $mdComponentRegistry.when('right').then(function(it) {
            it.toggle();
        });
    };

    $scope.search = function() {
        $rootScope.query = angular.copy(query);
        $rootScope.search = angular.copy(query);
        $scope.showData._load(0);
    }
    
    $scope.$watch('selectedData', function() {
        if ($scope.selectedData) {
            query[DeviceField.MNT_TYPE_ID] = angular.copy($scope.selectedData[DeviceField.MNT_TYPE_ID]);
        } else {
            delete query[DeviceField.MNT_TYPE_ID];
        }
    });

    var k, v;
    $scope.$watch('MonitorType', function() {
        $scope.monitorMap = {};
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

}
function DevicePointDetailCtrl($scope, devicePoint, toastService, $rootScope, $mdSidenav) {
    $scope.groupFieldName = $rootScope.groupFieldName;
    $scope.MonitorType = $rootScope.MonitorType; 
 
    $scope.save = function(obj, type) {
        devicePoint.saveOne(obj, type, function() {
            toastService();
            $scope.groupFieldName = null;
            $rootScope.query = $rootScope.search;
            $rootScope.showData._load();
        });
    };
 

    $scope.cancel = function() {
        $mdSidenav('right').close();
        $scope.groupFieldName = null;
    };
}

