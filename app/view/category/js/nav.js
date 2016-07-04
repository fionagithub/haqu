angular.module('category', ['ibuildweb.models.category', 'ngMaterial', 'ngMessages', 'material.svgAssetsCache'])
    .controller('topNavCtrl', topNavCtrl)
    .controller('navCtrl', navCtrl)


function topNavCtrl($scope, $mdSidenav) {
    $scope.$on("selectedMenuFromParent", function(event, msg) {
        if (msg.children)
            $scope.parentMenu = msg;
        else
            $scope.currentMenu = msg;
    });

    $scope.toggleLeft = function() {
        $mdSidenav('left').toggle();
    };
}

function navCtrl($scope, category) {

    $scope.goCatory = function(obj) {
        obj.open = obj.open === false;
        if (obj.url) {
            $scope.$emit('load');
            $scope.$emit('selectedMenu', obj);
        }

    };
    $scope.category = category;
}
/*  
    var setParent = function(children, parent) {
        angular.forEach(children, function(child) {
            child.parent = parent;
            if (child.children !== undefined) {
                setParent(child.children, child);
            }
        });
    };

    setParent($scope.category, null);

    $scope.category = category; 
                void 0 !== child.children && setParent(child.children, child) $scope.goCatory = function(obj) { 
       obj.open = obj.open === false;
       $scope.$emit('selectedMenu', obj);
       $scope.$emit('load');
   };*/
/**/
/*  

    function clearAll() {
        for (var j = $scope.selectedItems.length - 1; j >= 0; j--) {
            $scope.selectedItems[j].selected = false;
        }
        $scope.selectedItems = [];
    }    $scope.openItems = [];
    $scope.selectedItems = [];
        oldObj.push(obj);
        if (obj.url) {
            $state.go("ibuildweb.category.content", { category: obj.url });
        }
angular.element(document.querySelector('.docs-menu .hasChild')).removeClass('open'); if (obj.open) {
       obj.open = false;
   } else {
       obj.open = true;
   }*/
/*     */
