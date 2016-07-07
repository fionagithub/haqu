   angular.module('content.monitortype', ['ibuildweb.factorys', 'ibuildweb.factorys.services'])
       .controller('monitortypeCtrl', monitortypeCtrl)

   function monitortypeCtrl($rootScope, Paginator, $scope, $timeout, monitorGroup, monitorType, deviceTypeList, $log, $mdSidenav, $state, $mdComponentRegistry, DeviceField) {
       $scope.$on('$stateChangeSuccess', function() {
           if ($state.current.name == "ibuildweb.category.content") {
               load();
           }
       });
       $scope.$on("loadFromParrent", load);

       var query = {};

       $scope.search = function() {
           $rootScope.query = query;
           $scope.showData._load(0);
       }

       $scope.$watch('sysTypeData', function() {
           if ($scope.sysTypeData) {
               query[DeviceField.MNT_GROUP_ID] = angular.copy($scope.sysTypeData);
           } else {
               delete query[DeviceField.MNT_GROUP_ID];
           }
       });

       $scope.$watch('monitorType', function() {
           if ($scope.monitorType) {
               query[DeviceField.DESC] = { "like": '%' + angular.copy($scope.monitorType) + '%' };
           } else {
               delete query[DeviceField.DESC];
           }
       });

       function load() {
           $rootScope.query = null;
           $scope.DeviceField = DeviceField;
           $scope.sysTypeData = null;
           $scope.showData = Paginator(monitorType.filter, 10);
           monitorGroup.filter(null, null, function(data) {
               $scope.MonitorGroupList = data;
           });
           deviceTypeList.filter(null, null, function(data) {
               $scope.DeviceTypeList = data;

           });
           $timeout(sysIdMap, 100);
       }

       $scope.$watch('showData.data', sysIdMap);

       function sysIdMap() {
           for (var s in $scope.showData.data) {
               for (var o in $scope.DeviceTypeList) {
                   if ($scope.showData.data[s][DeviceField.TYPE_ID] == $scope.DeviceTypeList[o][DeviceField.TYPE_ID])
                       $scope.showData.data[s][DeviceField.TYPE_ID] = $scope.DeviceTypeList[o];
               }
           }

           for (var m in $scope.showData.data) {
               for (var n in $scope.MonitorGroupList) {
                   if ($scope.showData.data[m][DeviceField.MNT_GROUP_ID] && $scope.showData.data[m][DeviceField.MNT_GROUP_ID] == $scope.MonitorGroupList[n][DeviceField.MNT_GROUP_ID])
                       $scope.showData.data[m][DeviceField.MNT_GROUP_ID] = $scope.MonitorGroupList[n];
               }
           }

       }



       $scope.save = function(obj, type) {
           if (type === 'save') {
               monitorType.isExists(obj).then(function(data) {
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
           obj[DeviceField.MNT_GROUP_ID] = $scope.MonitorGroupList.editOptionData;
           obj[DeviceField.TYPE_ID] = $scope.DeviceTypeList.editData;
           monitorType.saveOne(obj, type).then(function() { $scope.showData._load() });
       }

       $scope.delete = function(obj) {
           monitorType.deleteOne(obj).then(function(data) { $scope.showData._load() })
       }

       // 自定义设备 查看列表数据 
       $scope._oldSelectedRowObj = [];
       $scope.selectedRow = function(index, obj) {
           if ($scope._oldSelectedRowObj.length > 1) {
               $scope._oldSelectedRowObj.pop();
           }
           $scope._oldSelectedRowObj.unshift(obj);
           //   angular.copy($rootScope.query);
           /*       query[DeviceField.MNT_GROUP_ID] = obj[DeviceField.MNT_GROUP_ID];
                  $rootScope.query = query;*/
       };

       $scope.getSelectedText = function(obj) {
           if (obj !== undefined) {
               return obj;
           } else {
               return " ";
           }
       };


    $scope.cancel = function() {
        $mdSidenav('right').close();
    };
       $scope.toggleRight = function(obj) {
           if (obj) {
               $state.go("ibuildweb.category.content.edit", { systype: obj[DeviceField.MNT_GROUP_ID][DeviceField.MNT_GROUP_ID] });
               $scope.MonitorGroupList.editOptionData = obj[DeviceField.MNT_GROUP_ID][DeviceField.MNT_GROUP_ID];

               if (obj[DeviceField.TYPE_ID]) {
                   $scope.DeviceTypeList.editData = obj[DeviceField.TYPE_ID][DeviceField.TYPE_ID];
               }
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

   }
