angular.module('content', [])
    .config(function($stateProvider) {
        $stateProvider
            .state('ibuildweb.category.content', {
                url: ':category',
                views: {
                    'content@': {
                        templateUrl: function(param) {
                            if (param.category) {
                                return 'view/content/' + param.category + '/template.html'
                            } else {
                                return 'view/content/template.html'
                            }
                        }
                    }
                }
            })
            .state('ibuildweb.category.content.create', {
                url: '/create',
                views: {
                    '@ibuildweb.category.content': {
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
                        templateUrl: function(param) {
                            return 'view/content/' + param.category + '/edit/template.html'
                        }
                    }
                }
            });
    })
