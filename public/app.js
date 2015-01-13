angular.module('app', [], function config($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
})

  .constant('API_URL', 'http://localhost:8000')

  .controller('MainCtrl', function MainCtrl(RandomUserFactory, UserFactory) {
    var vm = this;
    vm.getRandomUser = function getRandomUser() {
      RandomUserFactory.getUser().then(function success(response) {
        vm.randomUser = response.data;
      }, function error(response) {
        alert('Error: ' + response.data);
      });
    };

    // Initialization step
    UserFactory.getUser().then(function success(response) {
      vm.user = response.data;
    });

    vm.login = function login(username, password) {
      UserFactory.login(username, password).then(function success(response) {
        vm.user = response.data.user;
        console.log(response.data.token);
      }, function error(response) {
        alert('Error: ' + response.data);
      });
    };

    vm.logout = function logout() {
      UserFactory.logout();
      vm.user = null;
    };
  })

  .factory('RandomUserFactory', function RandomUserFactory($http, API_URL) {
    function getUser() {
      return $http.get(API_URL + '/random-user');
    }

    return {
      getUser: getUser
    };
  })

  .factory('UserFactory', function UserFactory($http, $q, API_URL, AuthTokenFactory) {
    function login(username, password) {
      return $http.post(API_URL + '/login', {
        username: username,
        password: password
      }).then(function success(response) {
        AuthTokenFactory.setToken(response.data.token);
        return response;
      });
    }

    function logout() {
      AuthTokenFactory.setToken();
    }

    function getUser() {
      if(AuthTokenFactory.getToken()) {
        return $http.get(API_URL + '/me');
      } else {
        return $q.reject({ data: 'client has no auth token' });
      }
    }

    return {
      login: login,
      logout: logout,
      getUser: getUser
    };
  })

  .factory('AuthTokenFactory', function AuthTokenFactory($window) {
    var store = $window.localStorage;
    var key = 'auth-token';

    function getToken() {
      return store.getItem(key);
    }

    function setToken(token) {
      if(token) {
        store.setItem(key, token);
      } else {
        store.removeItem(key);
      }
    }

    return {
      getToken: getToken,
      setToken: setToken
    };
  })

  .factory('AuthInterceptor', function AuthInterceptor(AuthTokenFactory) {
    function addToken(config) {
      var token = AuthTokenFactory.getToken();
      if(token) {
        config.headers = config.headers || {};
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    }

    return {
      request: addToken
    };
  })
