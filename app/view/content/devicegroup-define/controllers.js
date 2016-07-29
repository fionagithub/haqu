angular.module('content.deviceGroupDefine', ['ams.factorys', 'ams.factorys.services'])
    .controller('DeviceGroupDefineCtrl', DeviceGroupDefineCtrl)
    .directive("smartyInput", smartyInput)
    .directive("focusMe", focusMe)
    .directive("smartySuggestions", smartySuggestions)
    .directive("smartySuggestionsBox", smartySuggestionsBox)

function DeviceGroupDefineCtrl($scope, deviceGroupDefine, deviceInfo, paginator, delDialogService, toastService, DeviceField, $rootScope, $state, $document, $mdSidenav, $mdComponentRegistry) {
    var _this = this;
    _this.selected = -1;
    _this.selectionMade = false;
    _this.query = {};
    _this.suggestions = [];
    _this.subData = [];
    _this.clickedSomewhereElse = clickedSomewhereElse;
    _this.suggestionPicked = suggestionPicked;
    _this.selectedRow = selectedRow;
    _this.getSelectedText = getSelectedText;
    _this.toggleRight = toggleRight;
    _this.deleteData = deleteData;

    _this.save = save;
    _this.cancel = cancel;
    _this.setSelected = setSelected;
    _this.search = search;


    var prefixId = function() {
        return _this.prefix;
    };

    _this.prefixWatch = $scope.$watch(prefixId, function(newValue, oldValue) {
        if (newValue != oldValue) {
            if (_this.selectionMade) {
                _this.suggestions = [];
            } else {
                _this.query[DeviceField.DEVICE_ID] = { "like": '%' + _this.prefix + '%' };
                $rootScope.query = _this.query;
                deviceInfo.filter(null, null, function(data) {
                    _this.suggestions = [];
                    delete _this.query[DeviceField.DEVICE_ID];
                    return data.map(function(_data) {
                        return _this.suggestions = _this.suggestions.concat(_data[DeviceField.DEVICE_ID]);
                    });
                })
            }
        }
    });

    function suggestionPicked() {
        _this.selectionMade = true;

        if (_this.selected != -1 && _this.selected < _this.suggestions.length) {
            _this.prefix = _this.suggestions[_this.selected];

            _this.query[DeviceField.DEVICE_ID] = { "like": '%' + parseInt(_this.prefix / Math.pow(10, 2)) + '%' };
            $rootScope.query = _this.query;
            deviceInfo.filter(null, null, function(data) {
                delete _this.query[DeviceField.DEVICE_ID];
                return data.map(function(_data) {
                    return _this.subData = _this.subData.concat(_data[DeviceField.DEVICE_ID]);
                });
            });
        }
        _this.suggestions = [];
    };

    function toggleRight(obj) {
        _this.selectionMade = false;
        _this.prefix = null;
        _this.suggestions = [];
        _this.subData = [];
        // 'No instance found for handle'
        $mdComponentRegistry.when('right').then(function(it) {
            it.toggle();
        });
        if (obj) {
            $state.go("ams.category.content.edit", { id: obj[DeviceField.DEVICE_ID] });
            _this.selectionMade = true;
            _this.prefix = obj[DeviceField.DEVICE_ID];
            var subID = obj[DeviceField.SUBDEVICE_ID];
            if (subID) {
                _this.subData = subID.split(",");
                _this.subData.item = subID.split(",");
            }
            _this.groupFieldName = angular.copy(obj);
        } else {
            $state.go("ams.category.content.create");
        }

    };


    $scope.$on("loadFromParrent", load);
    $scope.$on('$stateChangeSuccess', function() {
        if ($state.current.name == "ams.category.content") {
            load();
        }
    });

    function load() {
        $rootScope.query = null;
        _this.showData = paginator(deviceGroupDefine.filter, 10);
        //   
        _this.DeviceField = DeviceField;
        _this.sysTypeData = null;
        _this.subData = [];
        _this.subData.propertyIsEnumerable.item = [];
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

    function clickedSomewhereElse() {
        _this.selected = -1;
        _this.suggestions = [];
    };

    $document.bind("click", function() {
        $scope.$apply(clickedSomewhereElse());
    });

    function setSelected(newValue) {
        if (newValue > _this.suggestions.length) {
            _this.selected = 0;
        } else if (newValue < 0) {
            _this.selected = _this.suggestions.length;
        } else {
            _this.selected = newValue;
        }
    };

    function search() {
        _this.showData._load(0);
    }

    function getSelectedText(o) {
        if (o) {
            return o;
        } else {
            return " ";
        }
    };


    function save(obj, type) {
        obj ? obj : obj = {};
        obj[DeviceField.DEVICE_ID] = _this.prefix;
        obj[DeviceField.SUBDEVICE_ID] = _this.subData.item;
        deviceGroupDefine.saveOne(obj, type, function() {
            toastService();
            _this.showData._load()
        });
    }

    function cancel() {
        $mdSidenav('right').close();
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
        template: '<div smarty-suggestions apply-class="dgdCtrl.setSelected(x)"' +
            'select-suggestion="dgdCtrl.suggestionPicked()" suggestions="dgdCtrl.suggestions"' +
            'selected="dgdCtrl.selected" clicked-elsewhere="dgdCtrl.clickedSomewhereElse()"' +
            'ng-if="dgdCtrl.suggestions.length > 0" prefix="{{dgdCtrl.prefix}} "' +
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
            '  {{suggestion}}  ' +
            '</p>'

    };
}
/*  add or show more

      prefix: "@"'<p ng-mouseover="applyClass({x:suggestions.length})" ' +
            'ng-class="{selected: suggestions.length == selected}" ' +
            'ng-click="selectSuggestion()" class="show-all"> ' +
            'Show all for " {{prefix}}  " &raquo;</p>'*/
function focusMe() {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            attrs.$observe("focusWhen", function() {
                if (attrs.focusWhen == "true") {
                    element[0].focus();
                }
            });
        }
    };
}
