angular.module('content.devicePoint', ['ams.factorys', 'ams.factorys.services'])
  .controller('DevicePointCtrl', DevicePointCtrl)
  .controller('DevicePointDetailCtrl', DevicePointDetailCtrl)

function DevicePointCtrl($scope, $location, devicePoint, monitorType, paginator, delDialogService, DeviceField, $rootScope, $state, $stateParams, $mdSidenav, $mdComponentRegistry) {
  $scope.$on('$stateChangeSuccess', load);
  $scope.$on("loadFromParrent", load);


  var query = {};

  function load() {
    if ($location.$$path == "/device-point") {
      $scope.selected = {
        data: null
      };
      $rootScope.query = null;
      $scope.editData.showData = paginator(devicePoint.filter, 10);
      monitorType.filter(null, null, function (data) {
        $scope.editData.MonitorType = data;
      });
    }
  }

  $scope.toggleRight = function (obj) {
    var uri = {
      category: $stateParams.category
    };
    uri.id = obj[DeviceField.DEVICE_ID];
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

  $scope.$watch('selectedData', function () {
    if ($scope.selectedData) {
      query[DeviceField.MNT_TYPE_ID] = angular.copy($scope.selectedData[DeviceField.MNT_TYPE_ID]);
    } else {
      delete query[DeviceField.MNT_TYPE_ID];
    }
  });

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

  $scope._oldSelectedRowObj = [];
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
      devicePoint.deleteOne(obj).then(function (data) {
        if ($scope.selectedData) {
          query[DeviceField.MNT_TYPE_ID] = angular.copy($scope.selectedData[DeviceField.MNT_TYPE_ID]);
          $rootScope.query = query;
        }
        $scope.editData.showData._load()
      })
    })
  };

}

function DevicePointDetailCtrl($scope, devicePoint, toastService, $rootScope, $mdSidenav) {
  $scope.save = function (obj, type) {
    devicePoint.saveOne(obj, type, function () {
      toastService();
      $rootScope.query = angular.copy($scope.editData.search);
      $scope.editData.groupFieldName = null;
      $scope.editData.search = null;
      $scope.editData.showData._load();
    });
  };

  $scope.cancel = function () {
    $mdSidenav('right').close();
    $scope.editData.groupFieldName = null;
  };
}
