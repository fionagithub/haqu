angular.module('category', ['ibuildweb.models.category'])
    .controller('navCtrl', navCtrl);

function navCtrl($scope, $mdSidenav, $state, category) {
    $scope.category = category.getMenu();
    $scope.toggleLeft = function() {
        $mdSidenav('left').toggle();
    }; /**/
    $scope.aaa = 'null';
    $scope.currentMenu = null;
    $scope.goCatory = function(obj) {
        $scope.bbb = obj;
        if (obj.open) {
            obj.open = false;
        } else {
            obj.open = true;
        }
        $scope.$emit('load');

    };
}
/*      if (obj.url) {
              $state.go("ibuildweb.category.content", { category: obj.url });
          }*/
