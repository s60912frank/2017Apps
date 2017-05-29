angular.module('2017Web').config(['$ionicConfigProvider', '$httpProvider', '$stateProvider', '$urlRouterProvider', ($ionicConfigProvider, $httpProvider, $stateProvider, $urlRouterProvider) => {
    $urlRouterProvider.otherwise('/user');
    $stateProvider
        .state('user', {
            url: '/user',
            templateUrl: 'views/user.html',
            controller: 'UserController',
            controllerAs: 'userCtrl'
        })
    $ionicConfigProvider.tabs.position('bottom');
    $httpProvider.interceptors.push('tokenInterceptor');
}]);