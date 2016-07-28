angular.module('content.deviceSystype', ['ams.factorys', 'ams.factorys.services'])
    .controller('DeviceSystypeCtrl', DeviceSystypeCtrl)

function DeviceSystypeCtrl($scope, deviceSysTypeList, deviceTypeList, paginator, delDialogService, toastService, DeviceField, $rootScope, $state,$stateParams,  $mdSidenav, $mdComponentRegistry) {
    $scope.$on("loadFromParrent", load);
    $scope.$on('$stateChangeSuccess', function() {
        if ($state.current.name == "ams.category.content") {
            load();
        }
    });
    var query = {};

    function load() {
        $rootScope.query = null;
        $scope.showData = paginator(deviceSysTypeList.filter, 10);
        $scope.DeviceField = DeviceField;
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
            uri.id = obj[DeviceField.SYS_TYPE_ID];
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

    $scope.$on("saveFromParent", function(event, obj, type) {
        deviceSysTypeList.saveOne(obj, type, function() {
            toastService();
            $scope.showData._load()
        });
    });

    $scope.deleteData = function(obj) {
        delDialogService(function() {
            console.log('delete...');
            deviceSysTypeList.deleteOne(obj).then(function(data) { $scope.showData._load() })
        })
    };
    $scope._oldSelectedRowObj = [];
    //deviceTypeFieldName 自定义设备 查看列表数据 
    $scope.selectedRow = function(index, obj) {
        if ($scope._oldSelectedRowObj.length > 0) {
            $scope._oldSelectedRowObj.pop();
        }
        $scope._oldSelectedRowObj.unshift(obj);
        query[DeviceField.SYS_TYPE_ID] = obj[DeviceField.SYS_TYPE_ID];
        $rootScope.query = query;
        deviceTypeList.filter(null, null, function(data) {
            if (data.length > 0) {
                $scope.isDel = false;
                console.log('存在子数据...');
            } else {
                $scope.isDel = true;
            }
            delete query[DeviceField.SYS_TYPE_ID];
        })
    };

}