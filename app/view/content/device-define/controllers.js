angular.module('content.deviceDefine', ['ams.factorys', 'ams.factorys.services'])
    .controller('DeviceDefineCtrl', DeviceDefineCtrl)
    .controller('DeviceDefineDetailCtrl', DeviceDefineDetailCtrl)

function DeviceDefineCtrl($scope, monitorType, deviceTypeList, deviceDefines, paginator, delDialogService, toastService, DeviceField, $rootScope, $state, $stateParams, $mdSidenav, $mdComponentRegistry) {
    $scope.$on("loadFromParrent", load);
    $scope.$on('$stateChangeSuccess', function() {
        if ($state.current.name == "ams.category.content") {
            load();
        }
    });

    var query = {};

    function load() {
        $rootScope.query = null;
        $scope.showData = paginator(deviceDefines.filter, 10);
        $rootScope.showData = $scope.showData;

        monitorType.filter(null, null, function(data) {
            $rootScope.MonitorType = angular.copy(data);
            $scope.MonitorType = data;
        });
        deviceTypeList.filter(null, null, function(data) {
            $rootScope.DeviceTypeList = angular.copy(data);
            $scope.DeviceTypeList = data;
        });
    }

    $scope.toggleRight = function(obj) {
        var uri = {
            category: $stateParams.category
        };

        if (obj) {
            uri.id = obj[DeviceField.ID];
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

    $scope.$watch('DeviceTypeList', function() {
        $scope.deviceMap = {};
        if ($scope.DeviceTypeList) {
            for (var i in $scope.DeviceTypeList) {
                k = $scope.DeviceTypeList[i][DeviceField.TYPE_ID];
                v = $scope.DeviceTypeList[i][DeviceField.TYPE_NAME];
                $scope.deviceMap[k] = v;
            }
        }
    });


    $scope.search = function() {
        $rootScope.query = angular.copy(query);
        $rootScope.search = angular.copy(query);
        $scope.showData._load(0);
    }

    $scope.$watch('selectedData', function() {
        if ($scope.selectedData) {
            query[DeviceField.TYPE_ID] = angular.copy($scope.selectedData);
        } else {
            delete query[DeviceField.TYPE_ID];
        }
    });

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
        $scope.isDel = true;
        if ($scope._oldSelectedRowObj.length > 0) {
            $scope._oldSelectedRowObj.pop();
        }
        $scope._oldSelectedRowObj.unshift(obj);
    };

    $scope.deleteData = function(obj) {
        delDialogService(function() {
            console.log('delete...');
            deviceDefines.deleteOne(obj).then(function(data) {
                if ($scope.selectedData) {
                    query[DeviceField.TYPE_ID] = angular.copy($scope.selectedData);
                    $rootScope.query = query;
                }
                $scope.showData._load()
            })
        })
    };

}

function DeviceDefineDetailCtrl($scope, deviceDefines, toastService, $rootScope, $mdSidenav) {
    $scope.groupFieldName = $rootScope.groupFieldName;
    $scope.MonitorType = $rootScope.MonitorType;
    $scope.DeviceTypeList = $rootScope.DeviceTypeList;

    $scope.ValueOpartor = ['<', '>', '=', '[]'];
    $scope.AlarmLevel = ['0', '1'];
    $scope.save = function(obj, type) {
        deviceDefines.saveOne(obj, type, function() {
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
