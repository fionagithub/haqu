 angular.module('common.directives', [])
     .run(['$templateCache', function($templateCache) {
         $templateCache.put('partials/menu-toggle.tmpl.html',
             '<md-button class="md-button-toggle"\n' +
             '  ng-click="toggle($event)"\n' +
             '  aria-controls="docs-menu-{{section.name | nospace}}"\n' +
             '  flex layout="row"\n' +
             '  aria-expanded="{{isOpen()}}">\n' +
             '  {{section.name}}\n' +
             '  <span aria-hidden="true" class=" pull-right fa fa-chevron-down md-toggle-icon"\n' +
             '  ng-class="{\'toggled\' : isOpen()}"></span>\n' +
             '</md-button>\n' +
             '<ul ng-show="isOpen()" id="docs-menu-{{section.name | nospace}}" class="menu-toggle-list">\n' +
             '  <li ng-repeat="page in section.pages">\n' +
             '    <menu-link section="page"></menu-link>\n' +
             '  </li>\n' +
             '</ul>\n' +
             '');
     }])
     .run(['$templateCache', function($templateCache) {
         $templateCache.put('partials/menu-link.tmpl.html',
             '<md-button ng-class="{\'{{section.icon}}\' : true}" \n' +
             '   ng-click="focusSection($event)">\n' +
             '  {{section | humanizeDoc}}\n' +
             '</md-button>\n' +
             '');
     }])

 .directive('menuToggle', function($timeout) {
         return {
             scope: {
                 section: '='
             },
             templateUrl: 'partials/menu-toggle.tmpl.html',
             link: function(scope, element) {
                 var _scope = element.parent().scope();
                 scope.isOpen = function(obj) {
                     return _scope.isOpen(obj|| scope.section);
                 };
                 scope.toggle = function(e) {
                     var p = angular.element(e.currentTarget.parentNode).find('button')[0];
                     if (scope.isOpen()) {
                         clearCss();
                          angular.element(p).addClass('md-selected');
                     } else {
                          angular.element(p).removeClass('md-selected');
                     }
                     _scope.toggleOpen(scope.section);
                 };
                 scope.setSelectPage = function(page) {
                     _scope.setSelectPage(page);
                 }; 

                 var parentNode = element[0].parentNode.parentNode.parentNode;
                 if (parentNode.classList.contains('parent-list-item')) {
                     var heading = parentNode.querySelector('h2');
                     element[0].firstChild.setAttribute('aria-describedby', heading.id);
                 }
                 function clearCss() {
                     var _elt = angular.element(document.querySelector('.md-selected'));
                     _elt.removeClass('md-selected');
                 }
             }
         };
     })
     .directive('menuLink', function() {
         return {
             scope: {
                 section: '='
             },
             templateUrl: 'partials/menu-link.tmpl.html',
             link: function(scope, element) {
                 var _scope = element.parent().scope(); 
                 scope.mouseActived = true;
                 scope.focusSection = function(e) {
                     // set flag to be used later when
                     // locationChangeSuccess calls openPage()  
                     if (scope.mouseActived && e.target.nodeName == 'BUTTON') {
                         clearCss();
                         angular.element(e.target).addClass('md-selected');
                         scope.mouseActived = false;
                     } else {
                         angular.element(e.target).removeClass('md-selected');
                     }
                     _scope.setSelectPage(scope.section);
                     _scope.autoFocusContent = true;
                 };
                 function clearCss() {
                     var _elt = angular.element(document.querySelector('.md-selected'));
                     _elt.removeClass('md-selected');
                 }
             }
         };
     })

 //take all whitespace out of string
 .filter('nospace', function() {
         return function(value) {
             return (!value) ? '' : value.replace(/ /g, '');
         };
     })
     //replace uppercase to regular case
     .filter('humanizeDoc', function() {
         return function(doc) {
             if (!doc) return;
             if (doc.type === 'directive') {
                 return doc.name.replace(/([A-Z])/g, function($1) {
                     return '-' + $1.toLowerCase();
                 });
             }

             return doc.label || doc.name;
         };
     })
