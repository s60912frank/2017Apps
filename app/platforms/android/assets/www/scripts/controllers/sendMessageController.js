angular.module('2017Apps').controller('SendMessageController', ['$rootScope', '$state', 'AccountService', 'AlertService', 'LineService', function ($rootScope, $state, AccountService, AlertService, LineService) {
    var self = this;
    self.message = {
        title: '',
        content: '',
        address: ''
    };

    var init = function () {
        self.isSale = false;
        self.message.accountIds = null;

        if ($state.params.accounts) {
            self.viewTitle = '優惠訊息';
            self.viewTitle += ($state.params.accounts.length > 1) ? '：' + $state.params.accounts[0].name + '...等' + $state.params.accounts.length + '人' : '：' + $state.params.accounts[0].name;
            self.message.accountIds = [];
        }
        else if ($state.params.sale) {
            self.isSale = true;
            self.viewTitle = '特賣推播';
            self.message.title = $state.params.sale.title;
        }else {
            self.viewTitle = '優惠訊息';
        }
        
        if (self.message.accountIds) {
            $state.params.accounts.filter(function (account) {
                self.message.accountIds.push(account._id);
            });
        }
        self.message.storeId = $rootScope.storeId;
    };

    init();

    self.cancel = function () {
        self.message.title = '';
        self.message.content = '';
        self.message.address = '';
    };

    self.send = function () {
        if (!self.message.title || !self.message.content)
            AlertService.alertPopup('錯誤！', '請輸入標題或內容');
        else {
            AccountService.sendMessage(self.message, function (data) {
                if (data.error)
                    AlertService.alertPopup('錯誤！', data.error);
                else
                    self.cancel();
            });
        }
    };

    self.sendSale = function () {
        if (!self.message.title || !self.message.address)
            AlertService.alertPopup('錯誤！', '請輸入標題或地址');
        else {
            LineService.sendSale(self.message, function (data) {
                if (data.error)
                    AlertService.alertPopup('錯誤！', data.error);
                else
                    self.cancel();
            });
        }
    };
}]);