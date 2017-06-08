   angular.module('ams.map', ['ams.factorys.services', 'ams.config'])
       .controller('MapCtrl', MapCtrl)
       .controller('MapDetailCtrl', MapDetailCtrl)
       .directive('fileModel', fileModel) 

   function MapCtrl($scope, map, deviceInfo, fileService, paginator, delDialogService, DeviceField, $rootScope, $state, $stateParams, $mdSidenav, $mdComponentRegistry) {
       $scope.$on('$stateChangeSuccess', function() {
           if ($state.current.name == "ams.category.content") {
               load();
           }
       });
       $scope.map = {
           file: null
       };
       $scope.selected = {
           map: null
       };

       $scope.setSelectPage = setSelectPage;
       $scope.isOpen = isOpen;
       $scope.toggleOpen = toggleOpen;

       var self = {};
       $scope.focusMap = {
           isContent: true,
           name: null
       };

       function setSelectPage(obj) {
           if (obj[DeviceField.SOURCE]) {
               fileService.fileConfig().then(function(data) {
                   $scope.showMapUri = data.data.img_path + obj[DeviceField.SOURCE];
                   console.log('---' + data.data) // imgUir Config
               })
           }
       };

       function isOpen(section) {
           return self.openedSection === section;
       }

       function toggleOpen(section) {
           self.openedSection = (self.openedSection === section ? null : section);
       }

       $rootScope.showData = load;

       function load() {
           map.filter(null, null, function(data) {
               var _data = new treeMenu(data).init();
               $scope.editData.showData = _data;
               $scope.editData.showAreaData = _data[null];

               $scope.toggelData = [];
               angular.forEach($scope.editData.showAreaData, function(data) {
                   var sections = {
                       id: data[DeviceField.MAP_ID],
                       name: data[DeviceField.MAP_NAME],
                       source: data[DeviceField.SOURCE],
                       maptype: data[DeviceField.MAP_TYPE],
                       icon: "fa",
                       type: 'toggle'
                   };
                   if ($scope.editData.showData[data.mapid]) {
                       sections.pages = [];
                       $scope.editData.showData[data.mapid].map(function(data) {
                           var pages = [{
                               id: data[DeviceField.MAP_ID],
                               name: data[DeviceField.MAP_NAME],
                               no: data[DeviceField.MAP_NO],
                               source: data[DeviceField.SOURCE],
                               maptype: data[DeviceField.MAP_TYPE],
                               icon: "fa",
                               type: 'link'
                           }];
                           sections.pages = sections.pages.concat(pages);
                       })
                   }
                   $scope.toggelData = $scope.toggelData.concat(sections);
               })
           });
       }

       $scope.toggleRight = function(obj) {
           var uri = {
               category: $stateParams.category
           };

           var data = {};
           data[DeviceField.MAP_ID] = obj.id;
           data[DeviceField.MAP_TYPE] = obj.maptype;
           data[DeviceField.MAP_NAME] = obj.name;
           data[DeviceField.MAP_NO] = obj.no;
           data[DeviceField.SOURCE] = obj.source;
           uri.id = data[DeviceField.MAP_ID];
           $state.go("ams.category.content.edit", uri);
           $scope.editData.groupFieldName = angular.copy(data);

           // 'No instance found for handle'
           $mdComponentRegistry.when('right').then(function(it) {
               it.toggle();
           });
       };

       // 自定义设备 查看列表数据 remove
       $scope.selectedRow = function(obj, callback) {
           query = {};
           if (obj.no) {
               query[DeviceField.MAP_ID] = obj.no;
           $rootScope.query = query;
               deviceInfo.filter(null, null, callback)
           } else {
               query[DeviceField.MAP_NO] = obj.id;
               $rootScope.query = query;
               map.filter(null, null, callback)
           }
           $rootScope.query = query = {};
       };

       $scope.deleteData = function(obj) {
           delDialogService(function() {
               console.log('delete...');
               obj[DeviceField.MAP_ID] = obj.id;
               map.deleteOne(obj).then(function(data) { load() })
           })
       };


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
   }

   function MapDetailCtrl($scope, map, uploadService, toastService, DeviceField, $rootScope, $mdSidenav) {
       $scope.uploadFile = function() {
           var file = $scope.myFile;
           var fd = new FormData();
           fd.append('file', file);
           $scope.filename = 'maps/' + file.name;
           fd.append('filename', $scope.filename);
           uploadService.post(fd).then(function() {
               console.log('-=--ok--=-')
           })
       };
       $scope.save = function(obj, type) {
           if ($scope.filename) { obj[DeviceField.SOURCE] = $scope.filename; }
           map.saveOne(obj, type, function() {
               toastService();
               $scope.editData.groupFieldName = null;
               $rootScope.showData();
           });
       };

       $scope.cancel = function() {
           $mdSidenav('right').close();
           $scope.editData.groupFieldName = null;
       };
   }

   function fileModel($parse) {
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
   }
