angular.module('2017Web').config(['$ionicConfigProvider', '$stateProvider', '$urlRouterProvider', function($ionicConfigProvider, $stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/user');
    $stateProvider
        .state('user', {
            url: '/user',
            templateUrl: 'views/user.html',
            controller: 'UserController',
            controllerAs: 'userCtrl'
        })
    $ionicConfigProvider.tabs.position('bottom');
}]);
