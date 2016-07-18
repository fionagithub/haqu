   angular.module('content.map', ['ibuildweb.factorys.services', 'ibuildweb.factorys', 'ngMaterial', 'ngMessages', 'material.svgAssetsCache'])
       .controller('mapCtrl', mapCtrl)
       .directive('mapInlineTools', mapInlineTools)
       .directive('fileModel', ['$parse', function($parse) {
           return {
               restrict: 'A',
               link: function(scope, element, attrs) {
                   var model = $parse(attrs.fileModel);
                   var modelSetter = model.assign;

                   element.bind('change', function() {
                       scope.$apply(function() {
                           modelSetter(scope, element[0].files[0]);
                       });
                   });
               }
           };
       }])

   function mapCtrl(Paginator, map, $http, $timeout, deviceInfo, config, DeviceField, $rootScope, delDialogService, $scope, $log, $mdSidenav, $state, $mdComponentRegistry) {

       $scope.$on('$stateChangeSuccess', function() {
           if ($state.current.name == "ibuildweb.category.content") {
               load();
           }
           $rootScope.query = null;
       });
       $scope.$on("loadFromParrent", load);
       load();
       $scope.uploadFile = function() {
           var file = $scope.myFile;
           var uploadUrl = "/upload";
           var fd = new FormData();
           fd.append('file', file);
           $scope.filename = $scope.myFile.name;
           fd.append('filename', $scope.filename);

           $http.post(uploadUrl, fd, {
                   transformRequest: angular.identity,
                   headers: { 'Content-Type': undefined }
               })
               .success(function() {
                   console.log("success!!");
               })
               .error(function() {
                   console.log("error!!");
               });
       };

       var query = {};

       $scope.search = function() {
           query[DeviceField.MNT_GROUP_ID] = $scope.sysTypeData;
           $rootScope.query = query;

       };
       $scope.$watch('sysTypeData', function() {});

       $scope.upload = function() {
           query[DeviceField.MNT_GROUP_ID] = $scope.sysTypeData;
           $rootScope.query = query;

       };

       // 自定义设备 查看列表数据 remove
       $scope.selectedRow = function(index, obj) {
           obj.open = obj.open === false;
           if (obj[DeviceField.SOURCE]) {
               $scope.showMapUri = config.$$state.value.img_path + obj[DeviceField.SOURCE];
               console.log('---' + config)
           }
       };

       function load() {
           map.filter(null, null, function(data) {
               var _data = new treeMenu(data).init();
               $scope.showData = _data;
               $scope.showAreaData = _data[null];
           });
           $scope.selected = {
               map: null
           };
           $scope.DeviceField = DeviceField;
       }

       function treeMenu(o) {
           this.tree = o || [];
           this.groups = {};
       };
       treeMenu.prototype = {
           init: function() {
               this.group();
               return this.groups;
           },
           group: function() {
               for (var i = 0; i < this.tree.length; i++) {
                   if (this.groups[this.tree[i].mapno]) {
                       this.groups[this.tree[i].mapno].push(this.tree[i]);
                   } else {
                       this.groups[this.tree[i].mapno] = [];
                       this.groups[this.tree[i].mapno].push(this.tree[i]);
                   }
               }
           }
       };



       $scope.cancel = function() {
           $mdSidenav('right').close();
       };


       $scope.deleteData = function(obj) {
           delDialogService(function() {
               console.log('delete...');
               map.deleteOne(obj).then(function(data) {
                   load();
               })
           })
       };
       $scope.toggleRight = function(obj) {
           if (obj) {
               $state.go("ibuildweb.category.content.edit", { systype: obj[DeviceField.MAP_ID] });
               $scope.selected.map = obj[DeviceField.MAP_NO];
               $scope.showImgUri = obj[DeviceField.SOURCE];
           } else {
               $state.go("ibuildweb.category.content.create");
           }

           // 'No instance found for handle'
           $mdComponentRegistry.when('right').then(function(it) {
               it.toggle();
           });
           $scope.groupFieldName = angular.copy(obj);
           $scope._groupFieldName = angular.copy(obj);
       };

       $scope.save = function(obj, type) {
           if (type === 'save') {
               map.isExists(obj).then(function(data) {
                   if (data.data.exists) {
                       console.log('数据已存在...')
                   } else {
                       save(obj, type);
                   }
               })
           } else {
               save(obj, type);
           }
       }

       function save(obj, type) {
           obj[DeviceField.SOURCE] = $scope.filename;
           obj[DeviceField.MAP_ID] = $scope.selected.map[DeviceField.MAP_ID];
           map.saveOne(obj, type, function() { load(); });
       }


   }

   function mapInlineTools($templateRequest, $compile) {
       return {
           scope: true,
           restrict: 'C',
           link: function(scope, element) {
               element.on("click", function(event) {
                   angular.element(document.querySelector('.map .selected')).removeClass('selected');
                   angular.element(element).addClass('selected');
                   scope.$apply(function() {
                       $templateRequest("../view/content/map/tool.html").then(function(html) {
                           angular.element(document.querySelector('.tools')).remove($compile(html)(scope));
                           angular.element(element).append($compile(html)(scope));
                       });
                   })
               });
           }
       }
   }
