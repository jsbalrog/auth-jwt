angular.module('app', [])

  .constant('API_URL', 'http://localhost:8000')

  .controller('MainCtrl', function MainCtrl(RandomUserFactory, UserFactory) {
    var vm = this;
    vm.getRandomUser = function getRandomUser() {
      RandomUserFactory.getUser().then(function success(response) {
        vm.randomUser = response.data;
      });
    };

    vm.login = function login(username, password) {
      UserFactory.login(username, password).then(function success(response) {
        vm.user = response.data;
      }, function error(response) {
        alert('Error: ' + response.data);
      });
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

  .factory('UserFactory', function UserFactory($http, API_URL) {
    function login(username, password) {
      return $http.post(API_URL + '/login', {
        username: username,
        password: password
      });
    }

    return {
      login: login
    };
  });
