angular.module('content.monitorgroup', ['ams.factorys', 'ams.factorys.services'])
    .controller('MonitorgroupCtrl', MonitorgroupCtrl)
    .controller('MonitorGroupDetailCtrl', MonitorGroupDetailCtrl)

function MonitorgroupCtrl($scope, monitorGroup, monitorType, paginator, delDialogService, DeviceField, $rootScope, $stateParams, $state, $mdSidenav, $mdComponentRegistry) {
    $scope.$on("loadFromParrent", load);
    $scope.$on('$stateChangeSuccess', function() {
        if ($state.current.name == "ams.category.content") {
            load();
        }
    });

    var query = {};

    function load() {
        $rootScope.query = null;
        $scope.editData.showData = paginator(monitorGroup.filter, 10);
    }

    $scope.toggleRight = function(obj) {
        var uri = {
            category: $stateParams.category
        };
        if (obj) {
            uri.id = obj[DeviceField.MNT_GROUP_ID];
            $state.go("ams.category.content.edit", uri);
            $scope.editData.groupFieldName = angular.copy(obj);
        } else {
            $state.go("ams.category.content.create");
        }
        // 'No instance found for handle'
        $mdComponentRegistry.when('right').then(function(it) {
            it.toggle();
        });
    };


    $scope.deleteData = function(obj) {
        delDialogService(function() {
            console.log('delete...');
            monitorGroup.deleteOne(obj).then(function(data) {
                $scope.editData.showData._load();

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
}


function MonitorGroupDetailCtrl($scope, monitorGroup, toastService, $mdSidenav) {
    $scope.save = function(obj, type) {
        monitorGroup.saveOne(obj, type, function() {
            toastService();
            $scope.editData.groupFieldName = null;
            $scope.editData.showData._load();
        });
    };

    $scope.cancel = function() {
        $scope.editData.groupFieldName = null;
        $mdSidenav('right').close();
    };
}
