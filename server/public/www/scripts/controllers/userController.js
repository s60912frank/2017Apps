angular.module('2017Web').controller('UserController', ['$location', 'UserService', 'AlertService', function ($location, UserService, AlertService) {
    self = this;

    var init = function () {
        self.user = {
            username: '',
            password: '',
            lineId: $location.search().lineId
        };
    };

    init();

    self.login = function () {
        if (!self.user.username || !self.user.username)
            AlertService.alertPopup('錯誤！', '請輸入帳號或密碼');
        else {
            UserService.login(self.user, function (data) {
                if (data.error)
                    AlertService.alertPopup('錯誤！', data.error);
                else
                    AlertService.alertPopup('登入成功！', '歡迎使用 LINE@iStore');
            });
        }
    };
}]);
