   angular.module('content.monitortype', ['ibuildweb.monitor.factorys', 'ibuildweb.factorys.services', 'ibuildweb.factorys', 'ngMaterial', 'ngMessages', 'material.svgAssetsCache'])
       .controller('monitortypeCtrl', monitortypeCtrl)
       /*'ibuildweb.device.factorys', */
   function monitortypeCtrl($scope, $log, $mdSidenav, $state, deviceSysTypeList, $mdComponentRegistry, DeviceField, MonitorGroup, MonitorType) {
       $scope.$on('$stateChangeSuccess', function() {});

       $scope.$on("loadFromParrent", load);
       load();

       function load() {
           $scope.page = null;
           $scope.MonitorGroupList = MonitorGroup;
           $scope.MonitorGroupList.data.groupData = null;
           $scope.DeviceTypeList = deviceSysTypeList;
           deviceSysTypeList.filter();

           $scope.monitorType = null;
           MonitorGroup.get();
           $scope.DeviceField = DeviceField;
           getData();
       }

       function getData() {
           var obj = {};
           if ($scope.MonitorGroupList.data.groupData) {
               obj[DeviceField.MNT_GROUP_ID] = angular.copy($scope.MonitorGroupList.data.groupData);
           }

           if ($scope.monitorType) {
               obj[DeviceField.CMD_NAME] = angular.copy($scope.monitorType);
           }

           MonitorType.filterCount(obj).then(function(data) {
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
           MonitorType.filter(obj).then(function(data) {
               var objList = data.data;
               var device = angular.copy($scope.DeviceTypeList);
               var objMap = angular.copy($scope.MonitorGroupList.data);
               for (var s in objList) {
                   for (var o in objMap) {
                       if (objList[s][DeviceField.TYPE_ID] == objMap[o][DeviceField.MNT_GROUP_ID])
                           objList[s][DeviceField.MNT_GROUP_ID] = objMap[o];
                   }
               }
               for (var m in objList) {
                   for (var n in device) {
                       if (objList[m][DeviceField.DEV_TYPE_ID] && objList[m][DeviceField.DEV_TYPE_ID] == device[n][DeviceField.TYPE_ID])
                           objList[m][DeviceField.DEV_TYPE_ID] = device[n];
                   }
               }
               $scope.showMonitorType = objList;
           });
       }

       // 自定义设备 删除按钮
       $scope.removeMonitorType = function(o) {
           if (!o) return;
           o._status = 'deleted';
           MonitorType.deleteOne(o).then(function() {
               getData();
           });
       };

       // 自定义设备 查看列表数据
       $scope.selectedMonitorType = function(index, obj) {
           $scope.selectedIndex = index;
           /*   */
           MonitorType.filterCount(obj).then(function(data) {
               if (data.data.count > 0) {
                   $scope.isDel = false;
                   console.log('存在子数据...');
               } else {
                   $scope.isDel = true;
               }
           })
       };
       $scope.getSelectedText = function(obj) {
           if (obj !== undefined) {
               return obj;
           } else {
               return "Please select an item";
           }
       };


       // 自定义设备 取消按钮
       $scope.cancelDeviceType = function() {
           $mdSidenav('right').close()
               .then(function() {
                   $log.debug("close RIGHT is done");
               });
       };
       $scope.toggleRight = function(obj) {
           if (obj) {
               $state.go("ibuildweb.category.content.edit", { systype: obj[DeviceField.MNT_GROUP_ID] });

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
       $scope.reSaveGroupType = function(o) {
           var obj = angular.copy(o);
           obj._status = 'modify';
           MonitorType.saveOne('reSave', obj).then(function() {
               getData();
           });
       };

       // 自定义设备 保存按钮
       $scope.saveGroupType = function(o) {
           var obj = angular.copy(o);
           MonitorType.isExists(obj).then(function(data) {
               if (data.data.exists) {
                   $scope.exists = true;
                   $scope.isSave = true;
                   console.log('数据已存在...')
               } else {
                   $scope.exists = false;
                   $scope.isSave = false;
                   console.log('saving...');
                   obj._status = 'modify';
                   MonitorType.saveOne('save', obj).then(function() {
                       getData();
                   });
               }
           })
       };

       $scope.$watch('page', function() {
           $scope.$broadcast('page', $scope.page);
       });

       $scope.searchMonitorType = function() {
           $scope.selectedIndex = null;
           getData()
       };

       $scope.previousPage = function() {
           $scope.page -= 10;
           $scope.selectedIndex = null;
           var obj = {};
           if ($scope.MonitorGroupList.data.groupData) {
               obj[DeviceField.MNT_GROUP_ID] = angular.copy($scope.MonitorGroupList.data.groupData);
           }

           if ($scope.monitorType) {
               obj[DeviceField.CMD_NAME] = angular.copy($scope.monitorType);
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
           if ($scope.MonitorGroupList.data.groupData) {
               obj[DeviceField.MNT_GROUP_ID] = angular.copy($scope.MonitorGroupList.data.groupData);
           }
           if ($scope.monitorType) {
               obj[DeviceField.CMD_NAME] = angular.copy($scope.monitorType);
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
