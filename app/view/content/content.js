angular.module('content', ['ams.factorys'])
    .controller('AmsCtr', AmsCtr)

function AmsCtr($scope, $rootScope, DeviceField, $mdSidenav, $mdComponentRegistry) {
    $rootScope.DeviceField = DeviceField;

    $scope.$on("load", function(event, msg) {
        $scope.$broadcast("loadFromParrent");
    });
    $scope.$on("selectedMenu", function(event, msg) {
        $scope.$broadcast("selectedMenuFromParent", msg);
    });

    $scope.editData = {};
    /*   $scope.goCatory = function(obj) {
        $scope.$emit('load');
        $scope.$emit('selectedMenu', obj);
    };
*/
    $rootScope.$watch(function() {
        var isOpen = $mdComponentRegistry.get('right') ? $mdSidenav('right').isOpen() : false;
        console.log('---', isOpen);
        return String(isOpen);
    }, function(data) {
        console.log('-===--', data);
        if (String(data) === 'false') {
            $rootScope.groupFieldName = null;
        }
    });
}
