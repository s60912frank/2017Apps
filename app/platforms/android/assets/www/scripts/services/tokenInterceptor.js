angular.module('2017Apps').factory('tokenInterceptor', ['$rootScope', '$window', function ($rootScope, $window) {
    var roleToken;
    return {
        request: function (config) {
            if (roleToken)
                config.headers.Authorization = roleToken;
            return config;
        },
        response: function (response) {
            if (response.headers('Authorization')) {
                roleToken = response.headers('Authorization');
            }
            return response;
        }
    };
}]);