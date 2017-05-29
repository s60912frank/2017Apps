angular.module('2017Apps').factory('tokenInterceptor', ['$rootScope', '$window', function($rootScope, $window) {
    let token = {
        app: undefined,
        iStore: undefined
    }
    let isiStoreToken = (config) => {
        let urlPart = config.url.split('/')
        return !((config.method == 'POST') && (
            (urlPart[5] == 'user') ||
            (urlPart[5] == 'account' && !urlPart[6]) ||
            (urlPart[5] == 'account' && urlPart[6] == 'login')))
    }

    return {
        request: function(config) {
            if (isiStoreToken(config)) {
                if (token.iStore) config.headers.Authorization = token.iStore;
            } else {
                if (token.app) config.headers.Authorization = token.app
            }
            return config;
        },
        response: function(response) {
            if (response.headers('Authorization')) {
                if (!token.app) {
                    token.app = response.headers('Authorization')
                } else {
                    token.iStore = response.headers('Authorization')
                }
            }
            return response;
        }
    };
}]);