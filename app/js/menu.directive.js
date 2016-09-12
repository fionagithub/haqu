 angular.module('common.directives', [])
     .run(['$templateCache', function($templateCache) {
         $templateCache.put('partials/menu-toggle.tmpl.html',
             '<md-button class="md-button-toggle"\n' +
             '  ng-class="{\'selected\' : isOpen()}"\n' +
             '  ng-click="toggle()"\n' +
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
             '<md-button ng-class="{\'{{section.icon}}\' : true,\'selected\' :  isPageSelected()}" \n' +
             '   ng-click="focusSection()">\n' +
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
                 scope.isOpen = function() {
                     return _scope.isOpen(scope.section);
                 };
                 scope.toggle = function() {
                     clearSelectCss();
                     _scope.toggleOpen(scope.section);
                 };
                 scope.setSelectPage = function(page) {
                     clearSelectCss();
                     _scope.setSelectPage(page);
                 };
                 scope.isPageSelected = function(page) {
                     return _scope.isPageSelected(page);
                 };

                 function clearSelectCss() {
                     var _elt = angular.element(document.querySelector('.selected'));
                     _elt.removeClass('selected');
                 }

                 var parentNode = element[0].parentNode.parentNode.parentNode;
                 if (parentNode.classList.contains('parent-list-item')) {
                     var heading = parentNode.querySelector('h2');
                     element[0].firstChild.setAttribute('aria-describedby', heading.id);
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
             link: function($scope, $element) {
                 var _scope = $element.parent().scope();
                 $scope.isPageSelected = function() {
                     return _scope.isPageSelected(_scope.page);
                 };
                 $scope.focusSection = function() {
                     // set flag to be used later when
                     // $locationChangeSuccess calls openPage()  
                     _scope.setSelectPage(_scope.page);
                     _scope.autoFocusContent = true;
                 };
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
