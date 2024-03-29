angular.module('content.deviceType', ['ams.factorys', 'ams.factorys.services'])
  .controller('DeviceTypeCtrl', DeviceTypeCtrl)
  .controller('DeviceTypeDetailCtrl', DeviceTypeDetailCtrl)

function DeviceTypeCtrl($scope ,deviceTypeList, deviceSysTypeList, deviceInfo, paginator, delDialogService, toastService, DeviceField, $rootScope, $state, $stateParams, $mdSidenav, $mdComponentRegistry) {

  var query = {};
      //搜索条件    
      $rootScope.query = null;
      $scope.selected = {
        searchDeviceType: null,
        deviceSysTypeData: null
      };
      $scope.editData.showData = paginator(deviceTypeList.filter, 10);
      deviceSysTypeList.filter(null, null, function (data) {
       data=data.data;
        $scope.editData.DeviceSysTypeList = data;
      });

  $scope.toggleRight = function (obj) {
    var uri = {
      category: $stateParams.category
    };
    uri.id = obj[DeviceField.TYPE_ID];
    $state.go("ams.category.content.edit", uri);
    $scope.editData.groupFieldName = angular.copy(obj);

    // 'No instance found for handle'
    $mdComponentRegistry.when('right').then(function (it) {
      it.toggle();
    });
  };

  //数据列表中匹配父名称
  $scope.$watch('editData.DeviceSysTypeList', function () {
    var k, v;
    $scope.sysMap = {};
    if ($scope.editData.DeviceSysTypeList) {
      for (var i in $scope.editData.DeviceSysTypeList) {
        k = $scope.editData.DeviceSysTypeList[i][DeviceField.SYS_TYPE_ID];
        v = $scope.editData.DeviceSysTypeList[i][DeviceField.SYS_TYPE_NAME];
        $scope.sysMap[k] = v;
      }
    }
  });


  $scope.deleteData = function (obj) {
    delDialogService(function () {
      console.log('delete...');
      deviceTypeList.deleteOne(obj).then(function (data) {
        $rootScope.query = angular.copy(query);
        $scope.editData.showData._load(0);
      })
    })
  };

  //搜索条件 
  $scope.$watch('selected.searchDeviceType', function () {
    if ($scope.selected.searchDeviceType) {
      query[DeviceField.TYPE_NAME] = {
        "like": '%' + angular.copy($scope.selected.searchDeviceType) + '%'
      };
      console.log("----" + query);
    } else {
      delete query[DeviceField.TYPE_NAME];
    }
  });

  $scope.$watch('selected.deviceSysTypeData', function () {
    if ($scope.selected.deviceSysTypeData) {
      query[DeviceField.SYS_TYPE_ID] = angular.copy($scope.selected.deviceSysTypeData);
    } else {
      delete query[DeviceField.SYS_TYPE_ID];
    }
  });
  $scope.search = function () {
    $rootScope.query = angular.copy(query);
    $scope.editData.search = angular.copy(query);
    $scope.editData.showData._load(0);
  }

  $scope._oldSelectedRowObj = [];
  // 自定义设备 查看列表数据 
  $scope.selectedRow = function (index, obj) {
    if ($scope._oldSelectedRowObj.length > 0) {
      $scope._oldSelectedRowObj.pop();
    }
    $scope._oldSelectedRowObj.unshift(obj);
    query = {};
    query[DeviceField.TYPE_ID] = obj[DeviceField.TYPE_ID];
    $rootScope.query = angular.copy(query);
    deviceInfo.filter(null, null, function (data) {
     data=data.data;
      if (data.length > 0) {
        $scope.isDel = false;
        console.log('存在子数据...');
      } else {
        $scope.isDel = true;
      }
      delete query[DeviceField.TYPE_ID];

    })
  };
}

function DeviceTypeDetailCtrl($scope, deviceTypeList, toastService, $rootScope, $mdSidenav) {
  $scope.save = function (obj, type) {
    deviceTypeList.saveOne(obj, type, function () {
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
