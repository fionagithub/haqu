angular.module('content.monitorgroup', ['ams.factorys', 'ams.factorys.services'])
  .controller('MonitorgroupCtrl', MonitorgroupCtrl)
  .controller('MonitorGroupDetailCtrl', MonitorGroupDetailCtrl)

function MonitorgroupCtrl($scope ,monitorGroup, monitorType, deviceTypeList, deviceMonitor, paginator, delDialogService, DeviceField, $rootScope, $stateParams, $state, $mdSidenav, $mdComponentRegistry) {
  var query = {};
      $scope.editData.showData = paginator(monitorGroup.filter, 10);
      $rootScope.query = null;

      $scope.editData.monitorId = null;
      deviceMonitor.filter(null, null, function (data) {
        data=data.data;
        $scope.DeviceMonitor = data;
        $scope._deviceMonitor = {};
        for (var i in $scope.DeviceMonitor) {
          var d = $scope.DeviceMonitor[i][DeviceField.TYPE_ID];
          var m = $scope.DeviceMonitor[i][DeviceField.MNT_GROUP_ID];
          if (!$scope._deviceMonitor.hasOwnProperty(m)) {
            $scope._deviceMonitor[m] = [];
          }
          $scope._deviceMonitor[m].push(d);
        }
        deviceTypeList.filter(null, null, function (data) {
        data=data.data;
          $scope.editData.DeviceTypeList = data;
          for (var d in $scope._deviceMonitor) {
            for (var m in $scope._deviceMonitor[d]) {
              for (var i in $scope.editData.DeviceTypeList) {
                var k = $scope.editData.DeviceTypeList[i][DeviceField.TYPE_ID];
                if (k === $scope._deviceMonitor[d][m]) {
                  $scope._deviceMonitor[d][m] = $scope.editData.DeviceTypeList[i];
                }
              }
            }
          }
        });
      });
  $scope.toggleRight = function (obj) {
    var uri = {
      category: $stateParams.category
    };
    uri.id = obj[DeviceField.MNT_GROUP_ID];
    $scope.editData.monitorId = obj[DeviceField.MNT_GROUP_ID];
    var device = $scope._deviceMonitor[obj[DeviceField.MNT_GROUP_ID]];
    if (device) {
      if (device.length > 0) {
        obj[DeviceField.TYPE_ID] = [];
        for (var i in device) {
          obj[DeviceField.TYPE_ID].push(device[i][DeviceField.TYPE_ID])
        }
      }
    }
    $state.go("ams.category.content.edit", uri);
    $scope.editData.groupFieldName = angular.copy(obj);

    // 'No instance found for handle'
    $mdComponentRegistry.when('right').then(function (it) {
      it.toggle();
    });
  };


  $scope.deleteData = function (obj) {
    delDialogService(function () {
      console.log('delete...');
      monitorGroup.deleteOne(obj).then(function (data) {
        $scope.editData.showData._load();

      })
    })
  };

  // 自定义设备 查看列表数据 
  $scope._oldSelectedRowObj = [];
  $scope.selectedRow = function (index, obj) {
    if ($scope._oldSelectedRowObj.length > 0) {
      $scope._oldSelectedRowObj.pop();
    }
    $scope._oldSelectedRowObj.unshift(obj);
    query[DeviceField.MNT_GROUP_ID] = obj[DeviceField.MNT_GROUP_ID];
    $rootScope.query = query;
    monitorType.filter(null, null, function (data) {
        data=data.data;
      if (data.length > 0) {
        $scope.isDel = false;
        console.log('存在子数据...');
      } else {
        $scope.isDel = true;
      }
      delete query[DeviceField.MNT_GROUP_ID];
    })
  };
}


function MonitorGroupDetailCtrl($scope, monitorGroup, deviceMonitor, DeviceField, delDialogService, toastService, $mdSidenav) {
  $scope.save = function (obj, type) {
    $scope.editData.typeId = angular.copy(obj[DeviceField.TYPE_ID]);
    delete obj[DeviceField.TYPE_ID];
    if ($scope.editData.monitorId !== obj[DeviceField.MNT_GROUP_ID] && type == 'resave') {
      type = 'save';
      save(obj, type);
      obj[DeviceField.MNT_GROUP_ID] = $scope.editData.monitorId;
      monitorGroup.deleteOne(obj).then(function () {
        for (var i in $scope.editData.typeId) {
          obj[DeviceField.TYPE_ID] = $scope.editData.typeId[i];
          deviceMonitor.deleteOne(obj).then(function () {
            console.log('delete...');
          })
        }

      })
    } else {
      save(obj, type);
    }
  }

  function save(obj, type) {
    monitorGroup.saveOne(obj, type, function () {
      obj[DeviceField.TYPE_ID] = $scope.editData.typeId;
      delete obj[DeviceField.DESC];
      if (obj[DeviceField.TYPE_ID].length > 0) {
        for (var i in obj[DeviceField.TYPE_ID]) {
          var _obj = {};
          _obj[DeviceField.TYPE_ID] = obj[DeviceField.TYPE_ID][i];
          _obj[DeviceField.MNT_GROUP_ID] = obj[DeviceField.MNT_GROUP_ID];
          deviceMonitor.saveOne(_obj, type, function () {});
        }
      }
      toastService();
      $scope.editData.groupFieldName = null;
      $scope.editData.showData._load();
    });
  }
  $scope.cancel = function () {
    $scope.editData.groupFieldName = null;
    $mdSidenav('right').close();
  };
}
