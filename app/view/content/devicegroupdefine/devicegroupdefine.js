angular.module('content.deviceGroupDefine', ['ibuildweb.factorys', 'ngMaterial', 'ibuildweb.factorys.services'])
    .controller('deviceGroupDefineCtrl', deviceGroupDefineCtrl)

function deviceGroupDefineCtrl($scope, $timeout, $q, $log, $element, deviceGroupDefine, deviceInfo, $mdDialog, $rootScope, Paginator, $mdSidenav, $state, $mdComponentRegistry, DeviceField) {

    $scope.$on("loadFromParrent", load);
    $scope.$on('$stateChangeSuccess', function() {
        if ($state.current.name == "ibuildweb.category.content") {
            load();
        }
    });
    var query = {};

    function load() {
        $rootScope.query = null;
        $scope.showData = Paginator(deviceGroupDefine.filter, 10);
        $scope.DeviceField = DeviceField;
        $scope.sysTypeData = null;
        $scope.subData = [];
        $scope.subData.propertyIsEnumerable.item = [];

        deviceInfo.filter(null, null, function(data) {
            map(data)
        })
    }
    $scope.states = [];

    function map(_data) {
        _data.map(function(data) {
            $scope.states = $scope.states.concat(data[DeviceField.DEVICE_ID]);
        });
    }
    $scope.simulateQuery = false;
    $scope.isDisabled = false;
    //    $scope.states = loadAll(); list of `state` value/display objects   

    $scope.querySearch = querySearch;
    $scope.selectedItemChange = selectedItemChange;
    /*   $scope.searchTextChange = searchTextChange;*/

    function querySearch(query) {
        var results = query ? $scope.states.filter(createFilterFor(query)) : $scope.states,
            deferred;
        if ($scope.simulateQuery) {
            deferred = $q.defer();
            $timeout(function() { deferred.resolve(results); }, Math.random() * 1000, false);
            return deferred.promise;
        } else {
            return results;
        }
    }

    function selectedItemChange(item) {
        $log.info('Item changed to ' + JSON.stringify(item));
        $scope.selectedItem = JSON.stringify(item);
    }


    $scope.$watch('selectedItem', function() {
        if ($scope.selectedItem) {
            query[DeviceField.DEVICE_ID] = { "like": '%' + parseInt($scope.selectedItem / Math.pow(10, 2)) + '%' };
            $rootScope.query = query;
            deviceInfo.filter(null, null, function(data) {
                $scope.subData = data;
                $rootScope.query = null;
            })
        } else {
            delete query[DeviceField.DEVICE_ID];
        }
    });

    function createFilterFor(query) {
        return function filterFn(state) {
            return (String(state).indexOf(String(query)) !== -1);
        };
    }

    $scope.search = function() {
        $scope.showData._load(0);
    }

    $scope._oldSelectedRowObj = [];
    $scope.selectedRow = function(index, obj) {
        $scope.isDel = true;
        if ($scope._oldSelectedRowObj.length > 0) {
            $scope._oldSelectedRowObj.pop();
        }
        $scope._oldSelectedRowObj.unshift(obj);
    };

    $scope.toggleRight = function(obj) {
        // 'No instance found for handle'
        $mdComponentRegistry.when('right').then(function(it) {
            it.toggle();
        });
        if (obj) {
            var subID = obj[DeviceField.SUBDEVICE_ID];
            $scope.selectedItem = obj[DeviceField.DEVICE_ID];
            $scope.subData.item = subID.split(",");
            $state.go("ibuildweb.category.content.edit", { systype: obj[DeviceField.DEVICE_ID] });
        } else {
            $state.go("ibuildweb.category.content.create");
        }
        $scope.groupFieldName = angular.copy(obj);
    };


    $scope.save = function(obj, type) {

        save(obj, type);
    }

    function save(obj, type) {
        obj[DeviceField.DEVICE_ID] = $scope.selectedItem;
        obj[DeviceField.SUBDEVICE_ID] = $scope.subData.item;
        deviceGroupDefine.saveOne(obj, type, function() { $scope.showData._load() });
    }

    $scope.delete = function(ev, obj) {
        var confirm = $mdDialog.confirm()
            .title('确定要删除这条数据么?')
            .ok('确定')
            .cancel('取消');

        $mdDialog.show(confirm).then(function() {
            console.log('delete...');
            deviceGroupDefine.deleteOne(obj).then(function(data) { $scope.showData._load() })
        }, function() {
            console.log('cancel...');
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
