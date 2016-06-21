   angular.module('content.map', ['ibuildweb.factorys.services', 'ibuildweb.factorys', 'ngMaterial', 'ngMessages', 'material.svgAssetsCache'])
       .controller('mapCtrl', mapCtrl)

   function mapCtrl($scope, $log, $mdSidenav, $state, map, $mdComponentRegistry, DeviceField) {
       $scope.$on('$stateChangeSuccess', function() {});

       $scope.$on("loadFromParrent", load);
       load();

       function load() {
           $scope.page = null;
           $scope.mapno = null;
           $scope.DeviceField = DeviceField;
           getData();
       }

       function getData() {
           var obj = {};
           if ($scope.mapno) {
               obj[DeviceField.MAP_NO] = angular.copy($scope.mapno);
           }

           map.filterCount(obj).then(function(data) {
               var count = data.data.count;
               $scope.monitorTypeCount = Math.floor(count / 10) * 10;
               //是否有上下页
               count && count > 10 ? $scope.isPagination = true : $scope.isPagination = false;
               if ($scope.page)
                   obj._skip = $scope.page;
               sysTypeMap(obj);
               $scope.isEditButton = false;
               if ($scope.page == $scope.monitorTypeCount) {
                   $scope.isLoadEnd = true;
                   $scope.isLoadTop = false;
                   //  $scope.page -= 10;
               } else {
                   $scope.isLoadEnd = false;
                   $scope.isLoadTop = true;
               }
           });
       }

       function sysTypeMap(obj) {
           map.filter(obj).then(function(data) {
               var objList = data.data;
               $scope.showData = objList;
           });
       }

       // 自定义设备 删除按钮
       $scope.remove = function(o) {
           if (!o) return;
           o._status = 'deleted';
           map.deleteOne(o).then(function() {
               getData();
           });
       };

       // 自定义设备 查看列表数据
       $scope.selectedRow = function(index, obj) {
           $scope.selectedIndex = index;
           $scope.isDel = true;

       };

       $scope.toggleRight = function(obj) {
           if (obj) {
               $state.go("ibuildweb.category.content.edit", { systype: obj[DeviceField.MAP_NO] });
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

       // 自定义设备 重新保存按钮
       $scope.resave = function(o) {
           var obj = angular.copy(o);
           obj._status = 'modify';
           map.saveOne('reSave', obj).then(function() {
               getData();
           });
       };

       // 自定义设备 保存按钮
       $scope.save = function(o) {
           var obj = angular.copy(o);
           $scope.exists = false;
           $scope.isSave = false;
           console.log('saving...');
           obj._status = 'modify';
           map.saveOne('save', obj).then(function() {
               getData();
           });

       };

       $scope.$watch('page', function() {
           $scope.$broadcast('page', $scope.page);
       });

       $scope.search = function() {
           $scope.selectedIndex = null;
           $scope.page = null;
           getData()
       };

       $scope.previousPage = function() {
           $scope.page -= 10;
           $scope.selectedIndex = null;
           var obj = {};
           if ($scope.mapno) {
               obj[DeviceField.MAP_NO] = angular.copy($scope.mapno);
           }

           if ($scope.page == Math.abs($scope.page)) {
               obj._skip = $scope.page;
               sysTypeMap(obj);
               $scope.isLoadEnd = false;
               if ($scope.page == 0) {
                   $scope.isLoadTop = true;
               }
           }
       };


       $scope.nextPage = function() {
           $scope.page += 10;
           $scope.selectedIndex = null;
           var obj = {};
           if ($scope.mapno) {
               obj[DeviceField.MAP_NO] = angular.copy($scope.mapno);
           }

           if ($scope.monitorTypeCount >= $scope.page) {
               obj._skip = $scope.page;
               sysTypeMap(obj);
               $scope.isLoadTop = false;
               if ($scope.page == $scope.monitorTypeCount) {
                   $scope.isLoadEnd = true;
               }
           }
       };
   }
