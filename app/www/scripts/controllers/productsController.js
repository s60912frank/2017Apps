angular.module('2017Apps').controller('ProductsController', ['$rootScope', '$scope', '$state', '$filter', '$ionicModal', 'AccountService', 'ProductService', 'AlertService', 'LineService', function ($rootScope, $scope, $state, $filter, $ionicModal, AccountService, ProductService, AlertService, LineService) {
    self = this;
    self.product = {
        name: '',
        price: '',
        url: ''
    };
    self.productIds = [];

    $ionicModal.fromTemplateUrl('views/createProduct.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    var init = function () {
        self.account = $rootScope.account;
        ProductService.getProducts(function (data) {
            if (data.error)
                AlertService.alertPopup('錯誤！', data.error);
            else
                self.products = data.products;
        });
    };

    init();

    self.createProduct = function () {
        if (self.product.name === '' || self.product.price === '' || self.product.url === '')
            AlertService.alertPopup('錯誤！', '請輸入商品資訊');
        else {
            ProductService.createProduct(self.product, function (data) {
                if (data.error)
                    AlertService.alertPopup('錯誤！', data.error);
                else {
                    $scope.modal.hide();
                    self.product.name = '';
                    self.product.price = '';
                    self.product.url = '';
                    init();
                }
            });
        }
    };

    self.buy = function (product) {
        if (self.isLoggedIn === false)
            AlertService.alertPopup('錯誤!', '請登入或開戶');
        else if (product.price > self.account.balance)
            AlertService.alertPopup('錯誤!', '餘額不足');
        else {
            AccountService.buy({ accountId: self.account._id, productId: product._id }, function (data) {
                $rootScope.account.balance = data.account.balance;
                AlertService.alertPopup('帳戶作業', $rootScope.account.name + ' 已消費 ' + $filter('currency')(product.price, '', 0) + '元', 'tab.transactions');
            });
        }
    }

    self.showModal = function () {
        $scope.modal.show();
    };

    self.hideModal = function () {
        $scope.modal.hide();
        self.product.name = '';
        self.product.price = '';
        self.product.url = '';
    };

    self.gotoOperation = function () {
        $state.go('tab.operation');
    };

    self.sendSale = function () {
        $state.go('tab.sendMessage', { sale: {title: '特賣會通知'} });
    };

    self.sendProducts = function () {
        if (self.productIds.length === 0)
            AlertService.alertPopup('錯誤！', '未選擇任何產品');
        else
            LineService.sendProducts({productIds: self.productIds}, function (data) {
                if(data.error)
                    AlertService.alertPopup('錯誤！', data.error);
                else
                    AlertService.alertPopup('商品推播', '推播成功');
            });
    };
}]);