angular.module('content.deviceMonitor', ['ams.factorys', 'ams.factorys.services'])
  .controller('DeviceMonitorCtrl', DeviceMonitorCtrl)
  .controller('DeviceMonitorDetailCtrl', DeviceMonitorDetailCtrl)

function DeviceMonitorCtrl($scope ,deviceMonitor, monitorGroup, deviceTypeList, paginator, delDialogService, DeviceField, $rootScope, $state, $stateParams, $mdSidenav, $mdComponentRegistry) {
  var query = {};
  $scope.selected = {
    data: null
  };
  $rootScope.query = null;
  $scope.editData.showData = paginator(deviceMonitor.filter, 10);
  deviceTypeList.filter(null, null, function (data) {
      data=data.data;
    $scope.editData.DeviceTypeList = data;
  });
  monitorGroup.filter(null, null, function (data) {
      data=data.data;
    $scope.editData.MonitorGroupList = data;
  });
  $scope.toggleRight = function (obj) {
    var uri = {
      category: $stateParams.category
    };
    uri.id = obj[DeviceField.MNT_GROUP_ID];
    $state.go("ams.category.content.edit", uri);
    $scope.editData.groupFieldName = angular.copy(obj);

    // 'No instance found for handle'
    $mdComponentRegistry.when('right').then(function (it) {
      it.toggle();
    });
  };

  $scope.search = function () {
    $rootScope.query = angular.copy(query);
    $scope.editData.search = angular.copy(query);
    $scope.editData.showData._load(0);
  }

  var k, v;
  $scope.$watch('selected.data', function () {
    if ($scope.selected.data) {
      query[DeviceField.MNT_GROUP_ID] = angular.copy($scope.selected.data[DeviceField.MNT_GROUP_ID]);
    } else {
      delete query[DeviceField.MNT_GROUP_ID];
    }
  });


  $scope.$watch('editData.DeviceTypeList', function () {
    $scope.deviceMap = {};
    if ($scope.editData.DeviceTypeList) {
      for (var i in $scope.editData.DeviceTypeList) {
        k = $scope.editData.DeviceTypeList[i][DeviceField.TYPE_ID];
        v = $scope.editData.DeviceTypeList[i][DeviceField.TYPE_NAME];
        $scope.deviceMap[k] = v;
      }
    }
  });

  $scope.$watch('editData.MonitorGroupList', function () {
    $scope.monitorMap = {};
    if ($scope.editData.MonitorGroupList) {
      for (var i in $scope.editData.MonitorGroupList) {
        k = $scope.editData.MonitorGroupList[i][DeviceField.MNT_GROUP_ID];
        v = $scope.editData.MonitorGroupList[i][DeviceField.DESC];
        $scope.monitorMap[k] = v;
      }
    }
  });

  $scope.deleteData = function (obj) {
    delDialogService(function () {
      console.log('delete...');
      deviceMonitor.deleteOne(obj).then(function (data) {
        if ($scope.selected.data) {
          query[DeviceField.MNT_GROUP_ID] = $scope.selected.data[DeviceField.MNT_GROUP_ID];
          $rootScope.query = query;
        }
        $scope.editData.showData._load();
      })
    })
  };
  $scope._oldSelectedRowObj = [];
  // 自定义设备 查看列表数据
  $scope.selectedRow = function (index, obj) {
    $scope.isDel = true;
    if ($scope._oldSelectedRowObj.length > 0) {
      $scope._oldSelectedRowObj.pop();
    }
    $scope._oldSelectedRowObj.unshift(obj);
  };

}

function DeviceMonitorDetailCtrl($scope, deviceMonitor, toastService, $rootScope, $mdSidenav) {
  $scope.save = function (obj, type) {
    deviceMonitor.saveOne(obj, type, function () {
      toastService();
      $rootScope.query = angular.copy($scope.editData.search);
      $scope.editData.groupFieldName = null;
      $scope.editData.showData._load();
    });
  };

  $scope.cancel = function () {
    $mdSidenav('right').close();
    $scope.editData.groupFieldName = null;
  };
}
