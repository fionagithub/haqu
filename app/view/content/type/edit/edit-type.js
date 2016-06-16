 angular.module('editType', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache'])
     .controller('editTypeCtrl', editTypeCtrl)

 function editTypeCtrl($scope, $log, $mdSidenav, $stateParams, DeviceField, DeviceSysTypeList, DeviceTypeList) {
     $scope.$on('$stateChangeSuccess', function() {
         $mdSidenav('right').toggle();
     });
     $scope.$on('deviceTypeFieldName', function(event, data) {
         console.log(data)
         $scope.deviceTypeFieldName = data;
     });


     $scope.$on('page', function(event, data) {
         console.log(data)
         $scope.page = data;
     });
     // 自定义设备 重新保存按钮
     $scope.reSaveDeviceType = function() {
         _saveDeviceType('reSave')
     };

     function sysTypeMap(obj, func) {
         func.filter(obj).then(function(data) {
             var objList = data.data;
             $scope.$parent.showDeviceTypeList = objList;
         });
     }

     function getData(func) {
         var obj = {};
         if ($scope.DeviceSysTypeList.data.sysTypeData) {
             obj[DeviceField.SYS_TYPE_ID] = angular.copy($scope.DeviceSysTypeList.data.sysTypeData);
         }

         func.filterCount(obj).then(function(data) {
             var count = data.data.count;
             $scope.deviceTypeCount = Math.floor(count / 10) * 10;
             console.log($scope.deviceTypeCount)
                 //是否有上下页
             count && count > 10 ? $scope.isPagination = true : $scope.isPagination = false;
             obj._skip = $scope.page;
             sysTypeMap(obj, func);
             $scope.isEditButton = false;
             if ($scope.page == $scope.deviceTypeCount) {
                 $scope.isLoadEnd = true;
                 $scope.isLoadTop = false;
                 $scope.page -= 10;
             } else {
                 $scope.isLoadEnd = false;
                 $scope.isLoadTop = true;
             }
         });
     }

     function _saveDeviceType(type) {
         var _device = angular.copy($scope.deviceTypeFieldName);
         _device._status = 'modify';
         DeviceSysTypeList.saveOne(type, _device).then(function() {
             getData(DeviceSysTypeList);
         });

     }; // 自定义设备 取消按钮
     $scope.cancelDeviceType = function() {
         $scope.deviceTypeFieldName = null;
     };

     $scope.close = function() {
         $mdSidenav('right').close()
             .then(function() {
                 $log.debug("close LEFT is done");
             });

     };

 }
