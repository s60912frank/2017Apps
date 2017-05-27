angular.module('2017Apps').config(['$ionicConfigProvider', '$httpProvider', '$stateProvider', '$urlRouterProvider', function ($ionicConfigProvider, $httpProvider, $stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/tab/user');
    $stateProvider
        .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'views/tab.html',
            controller: 'TabController',
            controllerAs: 'tabCtrl'
        })
        .state('tab.operation', {
            url: '/operation',
            cache: false,
            views: {
                'tabContent-operation': {
                    templateUrl: 'views/operation.html',
                    controller: 'OperationController',
                    controllerAs: 'operationCtrl'
                }
            }
        })
        .state('tab.transactions', {
            url: '/transactions',
            cache: false,
            params: {
                account: null
            },
            views: {
                'tabContent-transactions': {
                    templateUrl: 'views/transactions.html',
                    controller: 'TransactionsController',
                    controllerAs: 'transactionsCtrl'
                }
            }
        })
        .state('tab.accounts', {
            url: '/accounts',
            cache: false,
            views: {
                'tabContent-accounts': {
                    templateUrl: 'views/accounts.html',
                    controller: 'AccountsController',
                    controllerAs: 'accountsCtrl'
                }
            }
        })
        .state('tab.messages', {
            url: '/messages',
            cache: false,
            params: {
                account: null
            },
            views: {
                'tabContent-messages': {
                    templateUrl: 'views/messages.html',
                    controller: 'MessagesController',
                    controllerAs: 'messagesCtrl'
                }
            }
        })
        .state('tab.sendMessage', {
            url: '/sendMessage',
            cache: false,
            params: {
                accounts: null,
                sale: null
            },
            views: {
                'tabContent-sendMessage': {
                    templateUrl: 'views/sendMessage.html',
                    controller: 'SendMessageController',
                    controllerAs: 'sendMessageCtrl'
                }
            }
        })
        .state('tab.user', {
            url: '/user',
            cache: false,
            views: {
                'tabContent-user': {
                    templateUrl: 'views/user.html',
                    controller: 'UserController',
                    controllerAs: 'userCtrl'
                }
            }
        })
        .state('tab.products', {
            url: '/products',
            cache: false,
            views: {
                'tabContent-products': {
                    templateUrl: 'views/products.html',
                    controller: 'ProductsController',
                    controllerAs: 'productsCtrl'
                }
            }
        })

    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.navBar.alignTitle('center');
    $httpProvider.interceptors.push('tokenInterceptor');
}]);