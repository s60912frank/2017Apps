angular.module('2017Apps').controller('MessagesController', ['$rootScope', '$state', '$filter', 'AccountService', 'AlertService', function ($rootScope, $state, $filter, AccountService, AlertService) {
    var self = this;

    var init = function () {
        var accountId = $state.params.account ? $state.params.account._id : $rootScope.account._id;
        self.accountName = $state.params.account ? '：' + $state.params.account.name : '' ;

        AccountService.getMessages(accountId, function (data) {
            self.messages = data.messages;
        });
    };

    init();

    self.showDetail = function (message) {
        var template = message.title + '<br /><br />' + message.content + '<br /><br />時間：' + '<br />' + $filter('date')(message.timeStamp, 'yyyy年MM月dd日 hh點mm分');
        AlertService.alertPopup('優惠訊息' + message._id, template);
    };
}]);