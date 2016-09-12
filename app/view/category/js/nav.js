angular.module('category', ['ams.models.category', 'ngMaterial'])
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

    $scope.category = category;
    $scope.isOpen = isOpen;
    $scope.toggleOpen = toggleOpen;
    $scope.isPageSelected = isPageSelected;
    $scope.setSelectPage = setSelectPage;
    $scope.autoFocusContent = false;

    $scope.status = {
        isFirstOpen: true,
        isFirstDisabled: false
    };

    function isOpen(section) {
        return category.isSectionSelected(section);
    }

    function toggleOpen(section) {
        category.toggleSelectSection(section);
    }

    function isPageSelected( page) {
        return category.isPageSelected( page);
    }

    function setSelectPage( page) {
        category.setSelectPage( page);
    }

}
