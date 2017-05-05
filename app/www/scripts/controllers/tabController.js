angular.module('2017Apps').controller('TabController', ['$rootScope', '$ionicHistory', '$state', function ($rootScope, $ionicHistory, $state) {
    var self = this;

    self.roleIs = function (role) {
        if (role === $rootScope.role)
            return true;
        else
            return false;
    }
    
    self.goto = function (view) {
        $ionicHistory.nextViewOptions({
            historyRoot: true,
            disableAnimate: true
        });
        $state.go("tab." + view);
    }
}]);