angular.module('content', [])

.controller('AmsCtr', AmsCtr)

function AmsCtr($scope) {
    $scope.$on("load",
        function(event, msg) {
            $scope.$broadcast("loadFromParrent");
        });
    $scope.$on("selectedMenu",
        function(event, msg) {
            $scope.$broadcast("selectedMenuFromParent", msg);
        });
}
