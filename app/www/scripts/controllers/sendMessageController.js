angular.module('2017Apps').controller('SendMessageController', ['$rootScope', '$state', 'AccountService', 'AlertService', function ($rootScope, $state, AccountService, AlertService) {
    var self = this;
    self.message = {
        title: '',
        content: ''
    };

    var init = function () {        
        self.accountsName = $state.params.accounts ? (($state.params.accounts.length > 1) ? '：' + $state.params.accounts[0].name + '...等' + $state.params.accounts.length + '人' : '：' + $state.params.accounts[0].name) : '';
        self.message.accountIds = $state.params.accounts ? [] : null;

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
    };

    self.push = function () {
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
}]);