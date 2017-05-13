angular.module('2017Apps').controller('TransactionsController', ['$rootScope', '$state', '$ionicPopup', '$filter', 'AccountService', function ($rootScope, $state, $ionicPopup, $filter, AccountService) {
    var self = this;

    var init = function () {
        if (typeof $rootScope.account === 'undefined')
            self.isLoggedIn = false;
        else {
            self.isLoggedIn = true;
            var accountId = $state.params.account ? $state.params.account._id : $rootScope.account._id;
            self.accountName = $state.params.account ? '：' + $state.params.account.name : '';

            AccountService.getTransactions(accountId, function (data) {
                self.transactions = data.transactions;
            });
        }
    }

    self.showDetail = function (transaction) {
        $ionicPopup.alert({
            title: '交易明細 ' + transaction._id,
            template: '序號： ' + transaction._id + '<br />類別： ' + ((transaction.type === '0') ? '消費' : '儲值') + '<br />金額： ' + $filter('currency')(transaction.amount, "", 0) + '<br/ >餘額： ' + $filter('currency')(transaction.balance, "", 0) + '<br />日期： ' + $filter('date')(transaction.timeStamp, 'yyyy年MM月dd日 hh點mm分'),
            buttons: [
                  {
                      text: '關閉',
                      type: 'button-dark',
                  }
            ]
        });
    }
    init();
}]);