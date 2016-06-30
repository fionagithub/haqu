angular.module('content.systype', ['ibuildweb.factorys', 'ibuildweb.factorys.services'])
    .controller('systypeCtrl', systypeCtrl)
    /*{"where" :{"devicesystemtypeid":4},"offset":4,  "limit": 4}*/
function systypeCtrl($scope, $state, $rootScope, deviceSysTypeList, deviceTypeList, Paginator, $mdComponentRegistry, DeviceField) {
    $scope.$on("loadFromParrent", load);
    $scope.$on('$stateChangeSuccess', function() {
        load();
    });

    var query = {};

    function load() {
        $rootScope.query = null;
        $scope.showData = Paginator(deviceSysTypeList.filter, 10);
        $scope.DeviceField = DeviceField;
        $scope.sysTypeData = null;

        deviceSysTypeList.filter(null, null, function(data) {
            $scope.DeviceSysTypeList = data;
        });
    }

    $scope.search = function() {
        $scope.showData._load(0);
    }

    $scope.save = function(obj, type) {
        if (type === 'save') {
            deviceTypeList.isExists(obj).then(function(data) {
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
        deviceSysTypeList.saveOne(obj, type).then(function() { $scope.showData._load() });
    }

    $scope.delete = function(obj) {
        deviceSysTypeList.deleteOne(obj).then(function(data) { $scope.showData._load() })
    }

    $scope.$watch('sysTypeData', function() {
        query[DeviceField.SYS_TYPE_ID] = $scope.sysTypeData;
        $rootScope.query = query;
    });

    $scope.getSelectedText = function(o) {
        if (o) {
            return o;
        } else {
            return "Please select an item";
        }
    };

    $scope._oldSelectedRowObj = [];
    // 自定义设备 查看列表数据 
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
                $rootScope.query = null;
            })
            /*    */
    };
 
    $scope.toggleRight = function(obj) {
        if (obj) {
            $state.go("ibuildweb.category.content.edit", { systype: obj[DeviceField.SYS_TYPE_ID] });
        } else {
            $state.go("ibuildweb.category.content.create");
        }
        // 'No instance found for handle'
        $mdComponentRegistry.when('right').then(function(it) {
            it.toggle();
        });
        $scope.deviceTypeFieldName = angular.copy(obj);
        $scope._deviceTypeFieldName = angular.copy(obj);
    };

}
