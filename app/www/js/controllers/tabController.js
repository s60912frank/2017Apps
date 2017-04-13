angular.module('2017Apps').controller('TabController', ['$ionicHistory', '$state', function ($ionicHistory, $state) {
    var self = this;
    self.goto = function (view) {
        $ionicHistory.nextViewOptions({
            historyRoot: true,
            disableAnimate: true
        });
        $state.go("tab." + view);
    }
}]);