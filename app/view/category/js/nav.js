angular.module('category', ['ibuildweb.models.category', 'ngMaterial', 'ngMessages', 'material.svgAssetsCache'])
    .controller('navCtrl', navCtrl)/*
    .config(function($stateProvider) {
        $stateProvider
            .state('ibuildweb.category.content', {
                url: ':category',
                views: {
                    'content@': {
                        templateUrl: function(param) {
                            return 'view/content/' + param.category + '/template.html'
                        }
                    }
                }
            });
    })*/;

function navCtrl($scope, $mdSidenav, $state, category) {
    $scope.toggleLeft = function() {
        $mdSidenav('left').toggle();
    };
    $scope.goCatory = function(obj) {
        $state.go("ibuildweb.category.content", { category: obj });
        $scope.$emit('load');
    };
    $scope.category = category.getMenu();
}
