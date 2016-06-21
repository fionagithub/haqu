angular.module('iBuildWeb', [
        'ngAnimate', 'ui.router',
        'category',
        'content',
        'content.systype',
        'content.type',
        'content.deviceMonitor', 'content.deviceInfo',
        /* 'content.devicePoint',
         */
        'content.monitortype', 'content.map', 'content.monitorgroup'
    ])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('ibuildweb', {
                url: '',
                abstract: true
            })
            .state('ibuildweb.category', {
                url: '/',
                views: {
                    'category@': {
                        controller: navCtrl,
                        templateUrl: 'view/category/nav.tmpl.html'
                    },
                    'topnav@': {
                        templateUrl: 'view/category/topnav.tmpl.html'
                    },
                    'content@': {
                        templateUrl: 'view/content/content.html'
                    }
                }
            });
        $urlRouterProvider.otherwise('/');
    }).controller('iBuildWebCtr', iBuildWebCtr)

function iBuildWebCtr($scope) {
    $scope.$on("load",
        function(event, msg) {
            $scope.$broadcast("loadFromParrent");
        });
};
