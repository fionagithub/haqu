   angular.module('content.map', ['ams.factorys.services', 'ams.factorys'])
       .controller('MapCtrl', MapCtrl)
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

   function MapCtrl($scope, map, deviceInfo, fileService, uploadService, paginator, delDialogService, toastService, DeviceField, $state, $mdSidenav, $mdComponentRegistry) {
       $scope.$on('$stateChangeSuccess', function() {
           if ($state.current.name == "ams.category.content") {
               load();
           }

       });
       $scope.$on("loadFromParrent", load);

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

       function load() {
           map.filter(null, null, function(data) {
               var _data = new treeMenu(data).init();
               $scope.showData = _data;
               $scope.showAreaData = _data[null];

               $scope.toggelData = [];
               angular.forEach($scope.showAreaData, function(data) {
                   var sections = {
                       id: data[DeviceField.MAP_ID],
                       name: data[DeviceField.MAP_NAME],
                       source: data[DeviceField.SOURCE],
                       maptype: data[DeviceField.MAP_TYPE],
                       icon: "fa",
                       type: 'toggle'
                   };
                   if ($scope.showData[data.mapid]) {
                       sections.pages = [];
                       $scope.showData[data.mapid].map(function(data) {
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
           $scope.DeviceField = DeviceField;
       }
       $scope.deleteData = function(obj) {
           delDialogService(function() {
               console.log('delete...');
               map.deleteOne(obj).then(function(data) {})
           })
       };
       $scope.toggleRight = function(obj) {
           if (obj) {
               var data = {};
               data[DeviceField.MAP_ID] = obj.id;
               data[DeviceField.MAP_NAME] = obj.name;
               data[DeviceField.MAP_NO] = obj.no;
               data[DeviceField.SOURCE] = obj.source;

               $state.go("ams.category.content.edit", { id: data[DeviceField.MAP_ID] });
               $scope.selected.map = data[DeviceField.MAP_NO];
               $scope.showImgUri = data[DeviceField.SOURCE];
               $scope.groupFieldName = angular.copy(data);
           } else {
               $state.go("ams.category.content.create");
           }

           // 'No instance found for handle'
           $mdComponentRegistry.when('right').then(function(it) {
               it.toggle();
           });
       };


       $scope.uploadFile = function() {
           var file = $scope.map.file;
           var fd = new FormData();
           fd.append('file', file);
           $scope.filename = 'maps/' + file.name;
           fd.append('filename', $scope.filename);
           uploadService.post(fd).then(function() {
               console.log('-=--ok--=-')
           })
       };
       $scope.save = function(obj, type) {
           obj ? obj : obj = {};
           obj[DeviceField.SOURCE] = $scope.filename;
           obj[DeviceField.MAP_NO] = $scope.selected.map;
           map.saveOne(obj, type, function() {
               toastService();
           });
       }


       $scope.cancel = function() {
           $mdSidenav('right').close();
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
