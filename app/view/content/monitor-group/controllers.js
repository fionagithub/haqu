angular.module('content.monitorgroup', ['ams.factorys', 'ams.factorys.services'])
    .controller('MonitorgroupCtrl', MonitorgroupCtrl)

function MonitorgroupCtrl($scope, monitorGroup, monitorType, paginator, delDialogService, toastService, DeviceField, $rootScope, $state, $mdSidenav, $mdComponentRegistry) {
    $scope.$on('$stateChangeSuccess', function() {
        if ($state.current.name == "ams.category.content") {
            load();
        }
    });
    $scope.$on("loadFromParrent", load);

    var query = {};

    function load() {
        $scope.data = {
            edit: null
        };
        $rootScope.query = null;
        $scope.DeviceField = DeviceField;
        $scope.selectedData = null;
        $scope.showData = paginator(monitorGroup.filter, 10);
        monitorGroup.filter(null, null, function(data) {
            $scope.MonitorGroupList = data;
        });
    }
    $scope.$watch('selectedData', function() {
        if ($scope.selectedData) {
            query[DeviceField.MNT_GROUP_ID] = angular.copy($scope.selectedData[DeviceField.MNT_GROUP_ID]);
        } else {
            delete query[DeviceField.MNT_GROUP_ID];
        }
    });
    $scope.search = function() {
        $rootScope.query = query;
        $scope.showData._load(0);
    }

    $scope.save = function(obj, type) {
        monitorGroup.saveOne(obj, type, function() {
            if ($scope.selectedData) {
                query[DeviceField.MNT_GROUP_ID] = obj[DeviceField.MNT_GROUP_ID];
                $rootScope.query = query;
            }
            toastService();
            $scope.showData._load()
        });
    }


    $scope.deleteData = function(obj) {
        delDialogService(function() {
            console.log('delete...');
            monitorGroup.deleteOne(obj).then(function(data) {
                if ($scope.selectedData) {
                    query[DeviceField.MNT_GROUP_ID] = obj[DeviceField.MNT_GROUP_ID];
                    $rootScope.query = query;
                }
                $scope.showData._load()
            })
        })
    };

    // 自定义设备 查看列表数据 
    $scope._oldSelectedRowObj = [];
    $scope.selectedRow = function(index, obj) {
        if ($scope._oldSelectedRowObj.length > 0) {
            $scope._oldSelectedRowObj.pop();
        }
        $scope._oldSelectedRowObj.unshift(obj);
        //   angular.copy($rootScope.query);
        query[DeviceField.MNT_GROUP_ID] = obj[DeviceField.MNT_GROUP_ID];
        $rootScope.query = query;
        monitorType.filter(null, null, function(data) {
            if (data.length > 0) {
                $scope.isDel = false;
                console.log('存在子数据...');
            } else {
                $scope.isDel = true;
            }
            delete query[DeviceField.MNT_GROUP_ID];
        })
    };


    $scope.cancel = function() {
        $scope.data = {
            edit: null
        };
        $mdSidenav('right').close();
    };
    $scope.toggleRight = function(obj) {
        if (obj) {
            $state.go("ams.category.content.edit", { id: obj[DeviceField.MNT_GROUP_ID] });
            $scope.data = {
                edit: angular.copy(obj)
            };
        } else {
            $state.go("ams.category.content.create");
            $scope.data = {
                edit: null
            };
        }
        // 'No instance found for handle'
        $mdComponentRegistry.when('right').then(function(it) {
            it.toggle();
        });
    };


}
