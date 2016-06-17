angular.module('category', ['ibuildweb.models.category', 'ngMaterial', 'ngMessages', 'material.svgAssetsCache'])
    .controller('navCtrl', navCtrl)
;

function navCtrl($scope, $mdSidenav, $location, $state, category) {
    $scope.toggleLeft = function() {
        $mdSidenav('left').toggle();
    };
    $scope.goCatory = function(obj) {
        if (obj.url) {
            $state.go("ibuildweb.category.content", { category: obj.url });
        }
        if (obj.open) {
            obj.open = false;
        } else {
            obj.open = true;
        }
        $scope.$emit('load');
    };
    $scope.category = category.getMenu();

}
