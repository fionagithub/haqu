angular.module('content', ['ams.factorys'])
    .controller('AmsCtr', AmsCtr)

function AmsCtr($scope, $rootScope, DeviceField) {
    $rootScope.DeviceField = DeviceField;
    $scope.$on("load", function(event, msg) {
        $scope.$broadcast("loadFromParrent");
    });
    $scope.$on("selectedMenu", function(event, msg) {
        $scope.$broadcast("selectedMenuFromParent", msg);
    });
    $scope.$on("uploadFile", function(event, msg) {
        $scope.$broadcast("uploadFileFromParent", msg);
    });
    $scope.goCatory = function(obj) {
        $scope.$emit('load');
        $scope.$emit('selectedMenu', obj);
    };

    $scope.$on("suggestionPicked", function(event, data) {
        $scope.$broadcast("suggestionPickedFromParent", data);
    });

    $scope.$on("map", function(event, data) {
        $scope.$broadcast("mapFromParent", data);
    });
    $scope.$on("suggestions", function(event, data) {
        $scope.$broadcast("suggestionsFromParent", data);
    });
    $scope.$on("subData", function(event, data) {
        $scope.$broadcast("subDataFromParent", data);
    });
    $scope.$on("subDatasuggestions", function(event, data) {
        $scope.$broadcast("subFromParent", data);
    });
    $scope.$on("save", function(event, data, type) {
        $scope.$broadcast("saveFromParent", data, type);
    });
    $scope.$on("groupFieldName", function(event, data) {
        $scope.$broadcast("groupFieldNameFromParent", data);
    });
}
