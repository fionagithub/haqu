angular.module('category', ['ams.models.category', 'ngMaterial'])
    .controller('topNavCtrl', topNavCtrl)
    .controller('navCtrl', navCtrl)


function topNavCtrl($scope, $mdSidenav) {
    $scope.$on("selectedMenuFromParent", function(event, msg) {
        if (msg.children)
            $scope.parentMenu = msg;
        else
            $scope.currentMenu = msg;
    });

    $scope.toggleLeft = function() {
        $mdSidenav('left').toggle();
    };
}

function navCtrl($scope, category) {

    $scope.goCatory = function(obj) {
        obj.open = obj.open === false;
        if (obj.url) {
            $scope.$emit('load');
            $scope.$emit('selectedMenu', obj);
        }

    };
    $scope.category = category;
}