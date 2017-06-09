 angular.module('common.directives', [])
   .factory('commonOpera', function (map, deviceInfo, DeviceField, delDialogService, $rootScope) {
     var selectedRow = function (obj, callback) {
       var func,
         query = {};
       if (obj.hasOwnProperty('pages')) {
         func = map;
         query[DeviceField.MAP_NO] = obj.id;
       } else {
         query[DeviceField.MAP_ID] = obj.id;
         func = deviceInfo;
       }
       $rootScope.query = query;
       func.filter(null, null, callback)
       $rootScope.query = query = {};
     };
     var deleteData = function (obj, source) {
       return map.deleteOne(obj).then(function () {
         var _this = ['_this'];
        return source.filter(function (v, i) {
           return obj.id !== v.id;
         }, _this);
       })
     };

     return {
       delete: deleteData,
       selectedRow: selectedRow
     }
   })
   /* module map tools  */
   .directive('menuToggle', function (commonOpera) {
     return {
       scope: {
         section: '=',
         action: '&',
         toggledata: '='
       },
       templateUrl: '../view/patch/menu-toggle.tmpl.html',
       link: function (scope, element) {
         var _scope = element.parent().scope();
         scope.isOpen = function (obj) {
           return _scope.isOpen(obj || scope.section);
         };
         scope.flag = {}

         scope.toggle = function (o) {
           scope.toggledata.name = scope.section.name;
           if (scope.toggledata.isContent) {
             commonOpera.selectedRow(scope.section, function (data) {
               scope.flag.isDel = data.length > 0 ? false : true;
             });
           }
           _scope.toggleOpen(scope.section);
         };
         scope.isToggled = function () {
           if (scope.toggledata.name) {
             scope.section.isDel = scope.toggledata.name == scope.section.name;
           }
         };
         scope.setSelectPage = function (i, page) {
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
   .directive('menuLink', function (delDialogService, commonOpera) {
     return {
       scope: {
         section: '=',
         parentdata: '=',
         action: '&',
         linkdata: '='
       },
       templateUrl: '../view/patch/menu-link.tmpl.html',
       link: function (scope, element) {
         var _scope = element.parent().scope();
         scope.flag = {};
         scope.delete = function () {
           scope.section.mapid = scope.section.id;
           delDialogService(function () {
              commonOpera.delete(scope.section, scope.parentdata).then(function(data){
                   scope.parentdata = data;
           })
           })

         }
         scope.mouseActived = true;
         scope.isLinked = function () {
           if (scope.linkdata.name) {
             return scope.linkdata.name == scope.section.name;
           }
         };

         scope.focusSection = function () {
           scope.linkdata.name = scope.section.name;
           _scope.setSelectPage(scope.section);
           if (scope.linkdata.isContent) {
             commonOpera.selectedRow(scope.section, function (data) {
               scope.flag.isDel = data.length > 0 ? false : true;
             });
           }
         };
       }
     };
   })
