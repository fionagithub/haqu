 angular.module('common.directives', [])


 .run(['$templateCache', function($templateCache) {
         $templateCache.put('partials/menu-toggle.tmpl.html',
             '<md-button class="md-button-toggle"\n' +
             '  ng-click="toggle($index)"\n' +
             '  ng-class="{\'{{section.icon}}\' : true,\'md-selected\' :isToggled()}" \n' +
             '  aria-controls="docs-menu-{{section.name | nospace}}"\n' +
             '  flex layout="row"\n' +
             '  aria-expanded="{{isOpen()}}">\n' +
             '  {{section.name}}\n' +
             '  <map-inline-tools ng-if="isToggled()&& toggledata.isContent"></map-inline-tools>\n' +
             '  <span aria-hidden="true" class=" pull-right fa fa-chevron-down md-toggle-icon"\n' +
             '  ng-class="{\'toggled\' : isOpen()}"></span>\n' +
             '</md-button>\n' +
             '<ul ng-if="isOpen()" id="docs-menu-{{section.name | nospace}}" class="menu-toggle-list">\n' +
             '  <li ng-repeat="page in section.pages">\n' +
             '    <menu-link section="page" linkdata="toggledata"> </menu-link>\n' +
             '  </li>\n' +
             '</ul>\n' +
             '');
     }])
     .run(['$templateCache', function($templateCache) {
         $templateCache.put('partials/menu-link.tmpl.html',
             '<md-button ng-class="{\'{{section.icon}}\' : true,\'md-selected\' :isLinked()}" \n' +
             '   ng-click="focusSection()">\n' + 
             '  {{section | humanizeDoc}}\n' +
             '  <map-inline-tools ng-if="isLinked()&& linkdata.isContent"></map-inline-tools>\n' +
             '</md-button>\n' +
             '');
     }])
     /* module map tools  */
     .directive("mapInlineTools", function() {
         return {
             restrict: "AE",
             templateUrl: "../view/content/map/tool.html",
             link: function(scope, element) {
                 element.on('click', function(e) {
                     e.stopPropagation()
                 });
                 var _scope = element.parent().scope();
                 scope.toggleRight = function() {
                     _scope.toggleRight(scope.section);
                 };
             }
         };
     })
     .directive('menuToggle', function($timeout) {
         return {
             scope: {
                 section: '=',
                 toggledata: '='
             },
             templateUrl: 'partials/menu-toggle.tmpl.html',
             link: function(scope, element) {
                 var _scope = element.parent().scope();
                 scope.isOpen = function(obj) {
                     return _scope.isOpen(obj || scope.section);
                 };
                 scope.toggle = function(o) {
                     scope.toggledata.name = scope.section.name;
                     _scope.toggleOpen(scope.section);
                 };
                 scope.isToggled = function() {
                     if (scope.toggledata.name) {
                         return scope.toggledata.name == scope.section.name;
                     }
                 };
                 scope.toggleRight = function(obj) {
                     _scope.toggleRight(obj);
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
     .directive('menuLink', function() {
         return {
             scope: {
                 section: '=',
                 linkdata: '='
             },
             templateUrl: 'partials/menu-link.tmpl.html',
             link: function(scope, element) {
                 var _scope = element.parent().scope();
                 scope.mouseActived = true;
                 scope.isLinked = function() {
                     if (scope.linkdata.name) {
                         return scope.linkdata.name == scope.section.name;
                     }
                 };
                 scope.toggleRight = function(obj) {
                     _scope.toggleRight(obj);
                 };
                 scope.focusSection = function() {
                     scope.linkdata.name = scope.section.name;
                     _scope.setSelectPage(scope.section);
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
