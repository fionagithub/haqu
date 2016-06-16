angular.module('content', ['ibuildweb.factorys', 'ngMaterial', 'ngMessages', 'material.svgAssetsCache'])
    //.controller('systypeCtrl', systypeCtrl)
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
            })
            .state('ibuildweb.category.content.create', {
                url: '/create',
                views: {
                    '@ibuildweb.category.content': { 
                        // templateUrl: 'view/content/systype/create/create.systype.html'
                        templateUrl: function(param) {
                            return 'view/content/' + param.category + '/create/template.html'
                        }

                    }
                }
            })
            .state('ibuildweb.category.content.edit', {
                url: '/edit/:systype',
                views: {
                    '@ibuildweb.category.content': { 
                        //  templateUrl: 'view/content/systype/edit/editSys.html'
                        templateUrl: function(param) {
                            return 'view/content/' + param.category + '/edit/template.html'
                        }
                    }
                }
            });
    })