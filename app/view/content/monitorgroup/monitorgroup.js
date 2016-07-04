angular.module('content.monitorgroup', ['ibuildweb.factorys', 'ibuildweb.factorys.services'])
    .controller('monitorgroupCtrl', monitorgroupCtrl)

function monitorgroupCtrl($rootScope, Paginator, $scope, $log, DeviceField, monitorGroup, monitorType, $mdSidenav, $state, $mdComponentRegistry) {
    $scope.$on('$stateChangeSuccess', function() {
        if ($state.current.name == "ibuildweb.category.content") {
            load();
        }
    });
    $scope.$on("loadFromParrent", load);

    var query = {};

    function load() {
        $rootScope.query = null;
        $scope.DeviceField = DeviceField;
        $scope.sysTypeData = null;
        $scope.showData = Paginator(monitorGroup.filter, 10);
        monitorGroup.filter(null, null, function(data) {
            $scope.MonitorGroupList = data;
        });
    }
    $scope.$watch('sysTypeData', function() {
        if ($scope.sysTypeData) {
            query[DeviceField.MNT_GROUP_ID] = angular.copy($scope.sysTypeData);
        } else {
            delete query[DeviceField.MNT_GROUP_ID];
        }
    });
    $scope.search = function() {
        $rootScope.query = query;
        $scope.showData._load(0);
    }

    $scope.save = function(obj, type) {
        if (type === 'save') {
            monitorGroup.isExists(obj).then(function(data) {
                if (data.data.exists) {
                    console.log('数据已存在...')
                } else {
                    save(obj, type);
                }
            })
        } else {
            save(obj, type);
        }
    }

    function save(obj, type) {
        monitorGroup.saveOne(obj, type).then(function() { $scope.showData._load() });
    }

    $scope.delete = function(obj) {
        monitorGroup.deleteOne(obj).then(function(data) { $scope.showData._load() })
    }

    // 自定义设备 查看列表数据 
    $scope._oldSelectedRowObj = [];
    $scope.selectedRow = function(index, obj) {
        if ($scope._oldSelectedRowObj.length > 1) {
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
                query[DeviceField.MNT_GROUP_ID] = $scope.sysTypeData;
                $rootScope.query = query;
            })
            /*    */
    };

    $scope.getSelectedText = function(obj) {
        if (obj !== undefined) {
            return obj;
        } else {
            return " ";
        }
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


}
