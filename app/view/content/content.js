angular.module('content', [])
    .controller('AmsCtr', AmsCtr)
    .controller('rightCtrl', rightCtrl)

function AmsCtr($scope) {
    $scope.$on("load", function(event, msg) {
        $scope.$broadcast("loadFromParrent");
    });
    $scope.$on("selectedMenu", function(event, msg) {
        $scope.$broadcast("selectedMenuFromParent", msg);
    });
    $scope.$on("uploadFile", function(event, msg) {
        $scope.$broadcast("uploadFileFromParent", msg);
    });
    $scope.goCatory = function(obj) {
        $scope.$emit('load');
        $scope.$emit('selectedMenu', obj);
    };

    $scope.$on("suggestionPicked", function(event, data) {
        $scope.$broadcast("suggestionPickedFromParent", data);
    });

    $scope.$on("map", function(event, data) {
        $scope.$broadcast("mapFromParent", data);
    });
    $scope.$on("suggestions", function(event, data) {
        $scope.$broadcast("suggestionsFromParent", data);
    });
    $scope.$on("subData", function(event, data) {
        $scope.$broadcast("subDataFromParent", data);
    });
    $scope.$on("subDatasuggestions", function(event, data) {
        $scope.$broadcast("subFromParent", data);
    });
    $scope.$on("save", function(event, data, type) {
        $scope.$broadcast("saveFromParent", data, type);
    });
    $scope.$on("groupFieldName", function(event, data) {
        $scope.$broadcast("groupFieldNameFromParent", data);
    });
    $scope.$on("relatedData", function(event, data) {
        $scope.$broadcast("relatedDataFromParent", data);
    });
    $scope.$on("showData", function(event, data) {
        $scope.$broadcast("showDataFromParent", data);
    });
    $scope.$on("reopen", function() {
        $scope.$broadcast("reopenFromParent");
    });

}

function rightCtrl($scope, $state, $document, $mdSidenav, $mdComponentRegistry) {
    $scope.data = {
        groupFieldName: null
    };

    $scope.$on('$stateChangeSuccess', function() {
        if ($state.params.category == "devicegroup-define") {
            $scope.mapParams = {
                selected: -1,
                selectionMade: true,
                suggestions: [],
                subData: []
            };
            var prefixId;
            $scope.map = {};
            if ($state.current.name == "ams.category.content.edit") {
             /*   $scope.mapParams.selectionMade = true;*/
                $scope.map.prefix = $scope.data.groupFieldName[$scope.data['relatedData']['DeviceField'].DEVICE_ID];
                var subID = $scope.data.groupFieldName[$scope.data['relatedData']['DeviceField'].SUBDEVICE_ID];
                if (subID) {
                    $scope.map.subDataItem = subID.split(",");
                    $scope.mapParams.subData = subID.split(",");
                }
                $scope.map.tmp = $scope.data.groupFieldName[$scope.data['relatedData']['DeviceField'].TMP_NAME];
            } else {
                $scope.map.prefix = null;
            }
            prefixId = function() {
                return $scope.map.prefix;
            };
            /*angular.element(document.querySelector(''));*/
            $scope.$watch(prefixId, function(newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.mapParams.selectionMade) {
                        $scope.mapParams.suggestions = [];
                    } else {
                        $scope.$emit('map', $scope.map);
                    };
                };
            });
        }
    });

    $scope.$on("suggestionsFromParent", function(event, data) {
        $scope.mapParams.suggestions = [];
        data.map(function(_data) {
            $scope.mapParams.suggestions = $scope.mapParams.suggestions.concat(_data[$scope.data['relatedData']['DeviceField'].DEVICE_ID]);
        });

    });
    /*    $scope.mapParams.suggestions = data; */
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
            $scope.map.prefix = $scope.mapParams.suggestions[$scope.mapParams.selected];
            $scope.$emit('subData', $scope.map.prefix);
        }
    };
    $scope.$on("subFromParent", function(event, data) {
        $scope.mapParams.subData = [];
        $scope.map.subDataItem = [];
        data.map(function(_data) {
            $scope.mapParams.subData = $scope.mapParams.subData.concat(_data[$scope.data['relatedData']['DeviceField'].DEVICE_ID]);
        });
    });

    $scope.clickedSomewhereElse = function() {
        $scope.mapParams.selected = -1;
        $scope.mapParams.suggestions = [];
    };

    $document.bind("click", function() {
        $scope.$apply($scope.clickedSomewhereElse());
    });
    $scope.$on("reopenFromParent", function() {
        $scope.data['groupFieldName'] = null;
    });
    $scope.$on("groupFieldNameFromParent", function(event, data) {
        $scope.data['groupFieldName'] = angular.copy(data);
    });
    $scope.$on("relatedDataFromParent", function(event, data) {
        $scope.data['relatedData'] = angular.copy(data);
    });
    $scope.$on("showDataFromParent", function(event, data) {
        $scope.showData = angular.copy(data);
    });
    $scope.uploadFile = function() {
        var file = $scope.myFile;
        $scope.$emit('uploadFile', file);
    };

    $scope.save = function(obj, type) {
        $scope.$emit('save', obj, type);
    };
    $scope.cancel = function() {
        $mdSidenav('right').close();
    };
}
