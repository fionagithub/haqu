   angular.module('content.map', ['ams.factorys.services', 'ams.factorys'])
       .controller('MapCtrl', MapCtrl)
       .controller('MapDetailCtrl', MapDetailCtrl)
       .directive('fileModel', fileModel)

   function MapCtrl($scope, map, fileService, paginator, delDialogService, DeviceField, $rootScope, $state, $stateParams, $mdSidenav, $mdComponentRegistry) {
       $scope.$on("loadFromParrent", load);
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
           $scope.DeviceField = DeviceField;
       }

       $scope.toggleRight = function(obj) {
           var uri = {
               category: $stateParams.category
           };

           if (obj) {
               var data = {};
               data[DeviceField.MAP_ID] = obj.id;
               data[DeviceField.MAP_NAME] = obj.name;
               data[DeviceField.MAP_NO] = obj.no;
               data[DeviceField.SOURCE] = obj.source;
               uri.id = data[DeviceField.MAP_ID];
               $state.go("ams.category.content.edit", uri);
               $scope.editData.groupFieldName = angular.copy(data);
           } else {
               $state.go("ams.category.content.create");
           }
           // 'No instance found for handle'
           $mdComponentRegistry.when('right').then(function(it) {
               it.toggle();
           });
       };

       // 自定义设备 查看列表数据 remove
       $scope.selectedRow = function(index, obj) {
           obj.open = obj.open === false;
           if (obj[DeviceField.SOURCE]) {
               fileService.fileConfig().then(function(data) {
                   $scope.showMapUri = data.data.img_path + obj[DeviceField.SOURCE];
                   console.log('---' + data.data) // imgUir Config
               })
           }
       };

       $scope.deleteData = function(obj) {
           delDialogService(function() {
               console.log('delete...');
               map.deleteOne(obj).then(function(data) {})
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

   function MapDetailCtrl($scope, map, uploadService, toastService, $rootScope, $mdSidenav) {
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
           map.saveOne(obj, type, function() {
               toastService();
               $scope.editData.groupFieldName = null;
               /*   $rootScope.editData.showData._load();*/
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
