angular.module('content.deviceGroupDefine', ['ibuildweb.factorys', 'ibuildweb.factorys.services'])
    .controller('deviceGroupDefineCtrl', deviceGroupDefineCtrl)

function deviceGroupDefineCtrl($scope, deviceGroupDefine, $rootScope, Paginator, $mdSidenav, $state, $mdComponentRegistry, DeviceField) {
    $scope.$on("loadFromParrent", load);
    $scope.$on('$stateChangeSuccess', function() {
        if ($state.current.name == "ibuildweb.category.content") {
            load();
        } 
    });

    var query = {};

    function load() {
        $rootScope.query = null;
        $scope.showData = Paginator(deviceGroupDefine.filter, 10);
        $scope.DeviceField = DeviceField;
        $scope.sysTypeData = null;

    }


    $scope.search = function() {
        $scope.showData._load(0);
        /*
     query[DeviceField.MNT_TYPE_ID] = $scope.sysTypeData;
        $rootScope.query = query;*/
    }

    $scope._oldSelectedRowObj = [];
    $scope.selectedRow = function(index, obj) {
        if ($scope._oldSelectedRowObj.length > 0) {
            $scope._oldSelectedRowObj.pop();
        }
        $scope._oldSelectedRowObj.unshift(obj);
    };


    $scope.toggleRight = function(obj) {
        if (obj) {
            $state.go("ibuildweb.category.content.edit", { systype: obj[DeviceField.DEVICE_ID] });

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

        save(obj, type);
    }

    function save(obj, type) {

        deviceGroupDefine.saveOne(obj, type).then(function() { $scope.showData._load() });
    }

    $scope.delete = function(obj) {
        deviceGroupDefine.deleteOne(obj).then(function(data) { $scope.showData._load() })
    }

    $scope.getSelectedText = function(o) {
        if (o) {
            return o;
        } else {
            return " ";
        }
    };


}
