 angular.module('common.directives', [])
 .factory('togglefunc',function(){
     return {
         getdata:{},
         getNav:function(o){
         console.log('---');
         this.getdata=o;
         }
     }
 })
     /* module map tools  */
     .directive('menuToggle', function() {
         return {
             scope: {
                 section: '=',
                 delete: '&',
                 action: '&',
                 toggledata: '='
             },
             templateUrl: '../view/patch/menu-toggle.tmpl.html',
             link: function(scope, element) {
                 var _scope = element.parent().scope();
                 scope.isOpen = function(obj) {
                     return _scope.isOpen(obj || scope.section);
                 };
                scope.checkMap = function(o) {
                    _scope.selectedRow(o, function(data) {
                        if (data.length > 0) {
                            scope.section.isDel = false;
                            console.log('存在子数据...');
                        } else {
                            scope.section.isDel = true;
                        }
                    });
                };
                 scope.toggle = function(o) {
                     scope.toggledata.name = scope.section.name;
                    if (scope.toggledata.isContent) {
                        scope.checkMap(scope.section);
                    }
                     _scope.toggleOpen(scope.section);
                 };
                 scope.isToggled = function() {
                     if (scope.toggledata.name) {
                        scope.section.isDel =scope.toggledata.name == scope.section.name;
                     }
                 };
                 scope.setSelectPage = function(i, page) {
                     _scope.setSelectPage(i, page);
                 };

                 var parentNode = element[0].parentNode.parentNode.parentNode;
                 if (parentNode.classList.contains('parent-list-item')) {
                     var heading = parentNode.querySelector('h2');
                     element[0].firstChild.setAttribute('aria-describedby', heading.id);
                 }
             }
         };
     })
     .directive('menuLink', function(togglefunc) {
         return {
             scope: {
                 delete: '&',
                 section: '=',
                 action: '&',
                  linkdata: '='
             },
             templateUrl: '../view/patch/menu-link.tmpl.html',
             link: function(scope, element) {
                 var _scope = element.parent().scope();
                 scope.mouseActived = true;
                 scope.isLinked = function() {
                    if (scope.linkdata.name) {
                        return scope.linkdata.name == scope.section.name;
                    }
                 };
          
                scope.focusSection = function() {
                    scope.linkdata.name = scope.section.name;
                    _scope.setSelectPage(scope.section);
                    if (scope.linkdata.isContent) {
                        _scope.checkMap( scope.section);
                    }
                };
             }
         };
     })
