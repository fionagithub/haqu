angular.module('content.deviceDefine', ['ams.factorys', 'ams.factorys.services'])
  .controller('DeviceDefineCtrl', DeviceDefineCtrl)
  .controller('DeviceDefineDetailCtrl', DeviceDefineDetailCtrl)

function DeviceDefineCtrl($location, $scope, monitorType, deviceTypeList, deviceDefines, paginator, delDialogService, toastService, DeviceField, $rootScope, $state, $stateParams, $mdSidenav, $mdComponentRegistry) {
  var query = {};
      $rootScope.query = null;
      $scope.editData.showData = paginator(deviceDefines.filter, 10);

      monitorType.filter(null, null, function (data) {
       data=data.data;
        $scope.editData.MonitorType = data;
      });
      deviceTypeList.filter(null, null, function (data) {
       data=data.data;
        $scope.editData.DeviceTypeList = data;
      });

  $scope.toggleRight = function (obj) {
    var uri = {
      category: $stateParams.category
    };
    uri.id = obj[DeviceField.ID];
    $state.go("ams.category.content.edit", uri);
    $scope.editData.groupFieldName = angular.copy(obj);

    // 'No instance found for handle'
    $mdComponentRegistry.when('right').then(function (it) {
      it.toggle();
    });
  };

  var k, v;
  $scope.$watch('editData.MonitorType', function () {
    $scope.monitorMap = {};
    if ($scope.editData.MonitorType) {
      for (var i in $scope.editData.MonitorType) {
        k = $scope.editData.MonitorType[i][DeviceField.MNT_TYPE_ID];
        v = $scope.editData.MonitorType[i][DeviceField.DESC];
        $scope.monitorMap[k] = v;
      }
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


  $scope.search = function () {
    $rootScope.query = angular.copy(query);
    $scope.editData.search = angular.copy(query);
    $scope.editData.showData._load(0);
  }

  $scope.$watch('selectedData', function () {
    if ($scope.selectedData) {
      query[DeviceField.TYPE_ID] = angular.copy($scope.selectedData);
    } else {
      delete query[DeviceField.TYPE_ID];
    }
  });

  $scope._oldSelectedRowObj = [];
  // 自定义设备 查看列表数据 
  $scope.selectedRow = function (index, obj) {
    $scope.isDel = true;
    if ($scope._oldSelectedRowObj.length > 0) {
      $scope._oldSelectedRowObj.pop();
    }
    $scope._oldSelectedRowObj.unshift(obj);
  };

  $scope.deleteData = function (obj) {
    delDialogService(function () {
      console.log('delete...');
      deviceDefines.deleteOne(obj).then(function (data) {
        if ($scope.selectedData) {
          query[DeviceField.TYPE_ID] = angular.copy($scope.selectedData);
          $rootScope.query = query;
        }
        $scope.editData.showData._load()
      })
    })
  };

}

function DeviceDefineDetailCtrl($scope, deviceDefines, toastService, $rootScope, $mdSidenav) {
  $scope.ValueOpartor = ['<', '>', '=', '[]'];
  $scope.AlarmLevel = ['0', '1'];

  $scope.save = function (obj, type) {
    deviceDefines.saveOne(obj, type, function () {
      toastService();
      $scope.editData.groupFieldName = null;
      $rootScope.query = angular.copy($scope.editData.search);
      $scope.editData.search = null;
      $scope.editData.showData._load();
    });
  };

  $scope.cancel = function () {
    $mdSidenav('right').close();
    $scope.editData.groupFieldName = null;
  };
}
