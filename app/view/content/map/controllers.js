   angular.module('content.map', ['ams.factorys.services', 'ams.factorys'])
     .controller('MapCtrl', MapCtrl)
     .controller('MapDetailCtrl', MapDetailCtrl)
     .directive('fileModel', fileModel)

   function MapCtrl($scope, $location, deviceInfo, map, fileService, paginator, delDialogService, DeviceField, $rootScope, $state, $stateParams, $mdSidenav, $mdComponentRegistry) {
     $scope.$on('$stateChangeSuccess', load);
     $scope.$on("loadFromParrent", load);

     $scope.toggleRight = function (device) {
       var uri = {
         category: $stateParams.category
       };
       var data = {};
       data[DeviceField.MAP_ID] = device.id;
       data[DeviceField.MAP_TYPE] = device.maptype;
       data[DeviceField.MAP_NAME] = device.name;
       data[DeviceField.MAP_NO] = device.no;
       data[DeviceField.SOURCE] = device.source;
       uri.id = data[DeviceField.MAP_ID];
       $state.go("ams.category.content.edit", uri);
       $scope.editData.groupFieldName = angular.copy(data);

       // 'No instance found for handle'
       $mdComponentRegistry.when('right').then(function (it) {
         it.toggle();
       });
     };

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
         fileService.fileConfig().then(function (data) {
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
       if ($location.$$path == "/map") {
         map.filter(null, null, function (data) {
           var _data = new treeMenu(data).init();
           $scope.editData.showData = _data;
           $scope.editData.showAreaData = _data[null];

           $scope.toggelData = [];
           angular.forEach($scope.editData.showAreaData, function (data) {
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
               $scope.editData.showData[data.mapid].map(function (data) {
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
     }

     function treeMenu(o) {
       this.tree = o || [];
       this.groups = {};
     };
     treeMenu.prototype = {
       init: function () {
         this.group();
         return this.groups;
       },
       group: function () {
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
     $scope.uploadFile = function () {
       var file = $scope.myFile;
       var fd = new FormData();
       fd.append('file', file);
       $scope.filename = 'maps/' + file.name;
       fd.append('filename', $scope.filename);
       uploadService.post(fd).then(function () {
         console.log('-=--ok--=-')
       })
     };
     $scope.save = function (obj, type) {
       if ($scope.filename) {
         obj[DeviceField.SOURCE] = $scope.filename;
       }
       map.saveOne(obj, type, function () {
         toastService();
         $scope.editData.groupFieldName = null;
         $rootScope.showData();
       });
     };

     $scope.cancel = function () {
       $mdSidenav('right').close();
       $scope.editData.groupFieldName = null;
     };
   }

   function fileModel($parse) {
     return {
       restrict: 'A',
       link: function (scope, element, attrs) {
         var model = $parse(attrs.fileModel);
         var modelSetter = model.assign;

         element.bind('change', function () {
           scope.$apply(function () {
             modelSetter(scope, element[0].files[0]);
           });
         });
       }
     };
   }
