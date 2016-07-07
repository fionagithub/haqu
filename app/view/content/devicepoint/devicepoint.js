angular.module('content.devicePoint', ['ibuildweb.factorys', 'ibuildweb.factorys.services'])
    .controller('devicePointCtrl', devicePointCtrl)

function devicePointCtrl($scope,  $mdDialog, monitorType, devicePoint, $rootScope, Paginator, $timeout, $mdSidenav, $state, $mdComponentRegistry, DeviceField) {
    $scope.$on("loadFromParrent", load);
    $scope.$on('$stateChangeSuccess', function() {
        if ($state.current.name == "ibuildweb.category.content") {
            load();
        }
    });
    var query = {};

    function load() {
        $rootScope.query = null;
        $scope.showData = Paginator(devicePoint.filter, 10);
        $scope.DeviceField = DeviceField;
        $scope.sysTypeData = null;
        /**/
        monitorType.filter(null, null, function(data) {
            $scope.MonitorType = data;
            //  sysIdMap();
        });
        $timeout(sysIdMap, 100);
    }

    $scope.search = function() {
        $rootScope.query = query;
        $scope.showData._load(0);
    }
    $scope.$watch('sysTypeData', function() {
        if ($scope.sysTypeData) {
            query[DeviceField.MNT_TYPE_ID] = angular.copy($scope.sysTypeData);
        } else {
            delete query[DeviceField.MNT_TYPE_ID];
        }
    });

    $scope.$watch('showData.data', sysIdMap);

    $scope._oldSelectedRowObj = [];
    $scope.selectedRow = function(index, obj) {
          $scope.isDel = true;
       if ($scope._oldSelectedRowObj.length > 0) {
            $scope._oldSelectedRowObj.pop();
        }
        $scope._oldSelectedRowObj.unshift(obj);
    };


    function sysIdMap() {
        for (var s in $scope.showData.data) {
            for (var o in $scope.MonitorType) {
                if ($scope.showData.data[s][DeviceField.MNT_TYPE_ID] == $scope.MonitorType[o][DeviceField.MNT_TYPE_ID])
                    $scope.showData.data[s][DeviceField.MNT_TYPE_ID] = $scope.MonitorType[o];
            }
        }
    }

    $scope.toggleRight = function(obj) {
        if (obj) {
            $state.go("ibuildweb.category.content.edit", { systype: obj[DeviceField.DEVICE_ID] });
            /**/
            $scope.MonitorType.editData = obj[DeviceField.MNT_TYPE_ID][DeviceField.MNT_TYPE_ID];
        } else {
            $state.go("ibuildweb.category.content.create");
        }
        // 'No instance found for handle'
        $mdComponentRegistry.when('right').then(function(it) {
            it.toggle();
        });
        /*  */
        $scope.groupFieldName = angular.copy(obj);
    };

    $scope.save = function(obj, type) {
        /*    if (type === 'save') {
                deviceTypeList.isExists(obj).then(function(data) {
                    if (data.data.exists) {
                        console.log('数据已存在...')
                    } else {
                        save(obj, type);
                    }
                })
            } else {
            }*/
        save(obj, type);
    }

    function save(obj, type) {
        obj[DeviceField.MNT_TYPE_ID] = $scope.MonitorType.editData;
        devicePoint.saveOne(obj, type,function() { $scope.showData._load()});
    }

  
    $scope.delete = function(ev, obj) { 
        var confirm = $mdDialog.confirm()
            .title('确定要删除这条数据么?')
            .ok('确定')
            .cancel('取消');

        $mdDialog.show(confirm).then(function() {
            console.log( 'delete...');
            devicePoint.deleteOne(obj).then(function(data) { $scope.showData._load() })
        }, function() {
            console.log( 'cancel...');
        });
    };

    $scope.getSelectedText = function(o) {
        if (o) {
            return o;
        } else {
            return " ";
        }
    };


    $scope.cancel = function() {
        $mdSidenav('right').close();
    };
}
