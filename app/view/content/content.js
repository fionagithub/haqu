angular.module('content', ['ibuildweb.factorys.services', 'ibuildweb.factorys'])
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
            })
            .state('ibuildweb.category.content.child', {
                url: '/:mapid',
                views: {
                    '@ibuildweb.category.content': {
                        templateUrl: function(param) {
                            return 'view/content/' + param.category + '/device/template.html'
                        }

                    }
                }
            });
    })
    .factory('Paginator', Paginator)

function Paginator($mdDialog, DeviceField) {

    return function(func, fetchFunction, obj) {
        var paginator = {
            field: obj,
            count: null,
            isLoadTop: true, //下页
            isLoadEnd: true, //下页
            isPagination: false, //fen页self.count == null &&
            _load: function(o) {
                var self = this;
                if (o == 0) {
                    self.field['skip'] = o;
                }
                if (typeof func === 'function') {
                    func(function(data) {
                        var c = Math.floor(data.count / obj['limit']);
                        self.count = c * obj['limit']; //start from page:0
                        self.isPagination = c > 0;

                    })
                }
                fetchFunction(this.field, function(data) {
                    self.data = data;
                    //是否有上下页
                    if (self.count > self.field['skip']) {
                        self.isLoadEnd = false;
                        self.isLoadTop = true;
                    } else {
                        self.isLoadEnd = true;
                        self.isLoadTop = false;
                    }
                })

            },
            checkPaginator: function() {
                return this.isPagination;
            },
            checkLoadTop: function() {
                return this.isLoadTop;
            },
            checkLoadEnd: function() {
                return this.isLoadEnd;
            },
            previousPage: function() {
                var self = this;
                self.field['skip'] -= 10;
                self._load();
            },
            nextPage: function() {
                var self = this;
                self.field['skip'] += 10;
                self._load();
            },
            data: []
        };
        //load
        paginator._load();
        return paginator;
    };
}

Paginator.$inject = ['$mdDialog'];
