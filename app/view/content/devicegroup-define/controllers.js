angular.module('content.deviceGroupDefine', ['ams.factorys', 'ams.factorys.services'])
    .controller('DeviceGroupDefineCtrl', DeviceGroupDefineCtrl)
    .controller('DeviceGroupDefineDetailCtrl', DeviceGroupDefineDetailCtrl)
    .directive("smartyInput", smartyInput)
    .directive("smartySuggestions", smartySuggestions)
    .directive("focusMe", focusMe)
    .directive("smartySuggestionsBox", smartySuggestionsBox)

function DeviceGroupDefineDetailCtrl($scope, deviceGroupDefine, deviceInfo, toastService, $rootScope, DeviceField, $document, $mdSidenav) {
    $scope.mapParams = {
        selected: -1,
        selectionMade: false,
        suggestions: [],
        subData: []
    };
    $scope.selected = {
        deviceid: null,
        subdeviceid: null
    };

    $scope.$watch(function() {
        return $rootScope.groupFieldName;
    }, function(newValue, oldValue) {
        if ($rootScope.groupFieldName) {
            $scope.groupFieldName = $rootScope.groupFieldName;
            $scope.selected.deviceid = $rootScope.groupFieldName[DeviceField.DEVICE_ID];
            var subID = $rootScope.groupFieldName[DeviceField.SUBDEVICE_ID];
            if (subID) {
                $scope.selected.subdeviceid = subID.split(",");
                $scope.mapParams.subData = subID.split(",");
            }
        }
    });

    var query = {};

    $scope.$watch(function() {
        return $scope.selected.deviceid;
    }, function(newValue, oldValue) {
        if (newValue != oldValue) {
            if ($scope.mapParams.selectionMade) {
                $scope.mapParams.suggestions = [];
            } else {
                query[DeviceField.DEVICE_ID] = { "like": '%' + newValue + '%' };
                $rootScope.query = query;
                $scope.mapParams.suggestions = [];
                deviceInfo.filter(null, null, function(data) {
                    delete query[DeviceField.DEVICE_ID];
                    data.map(function(_data) {
                        $scope.mapParams.suggestions = $scope.mapParams.suggestions.concat(_data[DeviceField.DEVICE_ID]);
                    });
                })
            };
        };
    });
    $scope.clickedSomewhereElse = function() {
        $scope.mapParams.selected = -1;
        $scope.mapParams.suggestions = [];
    };

    /*    $document.bind("click", function() {
            $scope.$apply($scope.clickedSomewhereElse());
        });*/

    $scope.save = function(obj, type) {
        deviceGroupDefine.saveOne(obj, type, function() {
            toastService();
            $scope.selected.deviceid = null;
            $rootScope.showData._load();
        });
    };


    $scope.setSelected = function(index) {
        if (index > $scope.mapParams.suggestions.length) {
            $scope.mapParams.selected = 0;
        } else if (index < 0) {
            $scope.mapParams.selected = $scope.mapParams.suggestions.length;
        } else {
            $scope.mapParams.selected = index;
        }
    };

    $scope.suggestionPicked = function() {
        $scope.mapParams.selectionMade = true;
        if ($scope.mapParams.selected != -1 && $scope.mapParams.selected < $scope.mapParams.suggestions.length) {
            $scope.selected.deviceid = $scope.mapParams.suggestions[$scope.mapParams.selected];
            query[DeviceField.DEVICE_ID] = { "like": '%' + parseInt($scope.selected.deviceid / Math.pow(10, 2)) + '%' };
            $rootScope.query = query;
            $scope.mapParams.subData = [];
            deviceInfo.filter(null, null, function(data) {
                delete query[DeviceField.DEVICE_ID];
                data.map(function(_data) {
                    $scope.mapParams.subData = $scope.mapParams.subData.concat(_data[DeviceField.DEVICE_ID]);
                });
            });

        }
    };

    $scope.cancel = function() {
        $mdSidenav('right').close();
        $scope.groupFieldName = null;
    };
}


function DeviceGroupDefineCtrl($scope, deviceGroupDefine, paginator, delDialogService, toastService, $rootScope, $state, $stateParams, $document, $mdSidenav, $mdComponentRegistry) {
    var _this = this;
    _this.selectedRow = selectedRow;
    _this.getSelectedText = getSelectedText;
    _this.toggleRight = toggleRight;
    _this.deleteData = deleteData;

    function toggleRight(obj) {
        var uri = {
            category: $stateParams.category
        };
        if (obj) {
            uri.id = obj[DeviceField.DEVICE_ID];
            $state.go("ams.category.content.edit", uri);
            $rootScope.groupFieldName = angular.copy(obj);
        } else {
            $state.go("ams.category.content.create");
            $rootScope.groupFieldName = null;
        }
        // 'No instance found for handle'
        $mdComponentRegistry.when('right').then(function(it) {
            it.toggle();
        });
    };


    $scope.$on("loadFromParrent", load);
    $scope.$on('$stateChangeSuccess', function() {
        if ($state.current.name == "ams.category.content") {
            load();
        }
    });

    function load() {
        _this.showData = paginator(deviceGroupDefine.filter, 10);
        $rootScope.showData = _this.showData;
    }

    _this._oldSelectedRowObj = [];

    function selectedRow(index, obj) {
        _this.isDel = true;
        if (_this._oldSelectedRowObj.length > 0) {
            _this._oldSelectedRowObj.pop();
        }
        _this._oldSelectedRowObj.unshift(obj);
    };

    function deleteData(obj) {
        delDialogService(function() {
            console.log('delete...');
            deviceGroupDefine.deleteOne(obj).then(function(data) { _this.showData._load() })
        })
    };

    function getSelectedText(o) {
        if (o) {
            return o;
        } else {
            return " ";
        }
    };


}

function focusMe() {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            scope.$watch(attrs.focusMe, function(value) {
                if (value === true) {
                    element[0].focus();
                    scope[attrs.focusMe] = false;
                    console.log('--=value===', scope[attrs.focusMe]);
                }
            });
        }
    };
}

function smartyInput() {
    function link(scope, element) {
        element.bind("keydown", function(event) {
            switch (event.which) {
                case 40: // down arrow
                    scope.$apply(function() {
                        scope.select({ "x": parseInt(scope.index) + 1 });
                    });
                    break;
                case 38: // up arrow
                    scope.$apply(function() {
                        console.log('----', scope.index)
                        scope.select({ "x": parseInt(scope.index) - 1 });
                    });
                    break;
                case 13: // enter
                    event.preventDefault();
                    if (scope.selectionMade == false) {
                        if (scope.index == "-1") {
                            scope.$apply(function() {
                                scope.listItems = [];
                            });
                        }
                        scope.$apply(function() {
                            scope.close();
                        })
                    }
                    break;
                default:
                    scope.$apply(function() {
                        scope.selectionMade = false;
                        scope.index = -1;
                    });
            }
        });

        element.bind("blur", function(event) {
            /**/
            if (scope.listItems.length) {
                event.preventDefault();
                scope.$apply(function() {
                    scope.close();
                })

            }
        });
    }
    return {
        restrict: "A",
        link: link,
        scope: {
            prefix: "=ngModel",
            select: "&",
            index: "=",
            selectionMade: "=",
            listItems: "=",
            close: "&"
        }
    };
}

function smartySuggestionsBox() {
    return {
        restrict: "A",
        template: '<div smarty-suggestions apply-class="setSelected(x)"' +
            'select-suggestion="suggestionPicked()" clicked-elsewhere="clickedSomewhereElse()"' +
            'selected="mapParams.selected" suggestions="mapParams.suggestions"' +
            'ng-if="mapParams.suggestions.length > 0"' +
            'class="autocomplete-suggestions-menu ng-cloak"></div>'
    };
    // Removes the need for duplicating the scode that makes the suggestions list. 
    /*   templateUrl: 'view/content/devicegroupdefine/suggestions_box.html'*/
}


function smartySuggestions($document) {
    function link(scope, element, attrs) {
        element.bind("click", function(e) {
            e.stopPropagation();
        });
    }
    return {
        restrict: "A",
        link: link,
        scope: {
            suggestions: "=",
            selected: "=",
            applyClass: "&",
            selectSuggestion: "&"
        },
        template: '<p ng-repeat="suggestion in suggestions track by $index" ' +
            'ng-class="{selected: $index == selected}" ' +
            'ng-mouseover="applyClass({x:$index})" ' +
            'ng-click="selectSuggestion()"> ' +
            ' {{suggestion}}' +
            '</p>'

    };
}
/*  add or show more
    prefix="{{map.prefix}}  "  prefix: "@"'<p ng-mouseover="applyClass({x:suggestions.length})" ' +
            'ng-class="{selected: suggestions.length == selected}" ' +
            'ng-click="selectSuggestion()" class="show-all"> ' +
            'Show all for " {{prefix}}  " &raquo;</p>'*/
