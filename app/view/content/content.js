angular.module('content', ['ibuildweb.factorys.services', 'ibuildweb.factorys'])
    .config(stateConfig)
    .factory('toastService', toastService)
    .factory('delDialogService', delDialogService)
    .factory('Paginator', Paginator)
    .directive('paginationSection', paginationSection)
    .directive('inlineTools', inlineTools)

function stateConfig($stateProvider) {
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
}

function toastService($mdToast) {
    return function() {
        var pinTo = 'bottom';
        console.log('-=-', pinTo);
        $mdToast.show(
            $mdToast.simple()
            .textContent('save success!')
            .position(pinTo)
            .hideDelay(3000)
        );
    }
}

function delDialogService($mdDialog) {
    return function(delEvent) {
        var confirm = $mdDialog.confirm()
            .title('确定要删除这条数据么?')
            .ok('确定')
            .cancel('取消');

        $mdDialog.show(confirm).then(
            delEvent,
            function() {
                console.log('cancel...');
            });
    }
}

function inlineTools() {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        scope: {
            toggleRight: '&open',
            deleteData: '&delete',
            old: '=old',
            isDel: '=del',
            data: '=data'
        },
        templateUrl: 'view/inline-tools/template.html'
    }
}

function paginationSection() {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        scope: true,
        templateUrl: 'view/pagination/template.html'

    }
}

function Paginator() {

    return function(func, obj) {
        var paginator = {
            offset: 0,
            currentPage: 1,
            size: obj + 1,
            isLoadTop: true, //下页
            isLoadEnd: true, //下页
            isPagination: true,
            _load: function(o) {
                var self = this;
                if (typeof o !== "undefined") {
                    self.offset = o;
                    self.currentPage = 1;
                }
                func(self.offset, self.size, function(data) {
                    self.data = data.slice(0, obj);
                    self.isLoadEnd = data.length < self.size;
                    self.isLoadTop = self.currentPage <= 1;
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
                self.offset -= 10;
                self.currentPage -= 1;
                self._load();
            },
            nextPage: function() {
                var self = this;
                self.currentPage += 1;
                self.offset += 10;
                self._load();
            },
            data: []
        };
        //load
        paginator._load();
        return paginator;
    };
}
