angular.module('content.monitorgroup', ['ams.factorys', 'ams.factorys.services'])
    .controller('MonitorgroupCtrl', MonitorgroupCtrl)

function MonitorgroupCtrl($scope, monitorGroup, monitorType, paginator, delDialogService, toastService, DeviceField, $rootScope, $stateParams, $state, $mdSidenav, $mdComponentRegistry) {
    $scope.$on('$stateChangeSuccess', function() {
        if ($state.current.name == "ams.category.content") {
            load();
        }
    });
    $scope.$on("loadFromParrent", load);

    var query = {};

    function load() {


        $scope.DeviceField = DeviceField;

        $scope.showData = paginator(monitorGroup.filter, 10);
        monitorGroup.filter(null, null, function(data) {
            $scope.MonitorGroupList = data;
        });
    }


    $scope.toggleRight = function(obj) {
        var uri = {
            category: $stateParams.category
        };
        var relatedData = {
            'DeviceField': $scope.DeviceField
        };
        $scope.$emit('relatedData', relatedData);
        if (obj) {
            uri.id = obj[DeviceField.MNT_GROUP_ID];
            $state.go("ams.category.content.edit", uri);
            $scope.$emit('groupFieldName', angular.copy(obj));
        } else {
            $state.go("ams.category.content.create");
            $scope.$emit('reopen');
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


    $scope.$on("saveFromParent", function(event, obj, type) {
        monitorGroup.saveOne(obj, type, function() {
            toastService();
            $scope.showData._load()
        });
    });

}
