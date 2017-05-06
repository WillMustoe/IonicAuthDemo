angular.module('starter.controllers', [])

.service('login', function($q, $http, userData){
  return{
    login : function(username, password){
      var deferred = $q.defer();
      var promise = deferred.promise;
      var link = 'https://server.com/login';
      var info = {"username": username, "password":password};
      $http.post(link,info).then(function(res){
        if(res.data[0] == 1){
          console.log("login successful");
          deferred.resolve('Welcome'+name+'!');
          userData.setUserID(res.data[1]);
          userData.setToken(res.data[2]);
        }
        else {
          deferred.reject('Wrong credentials.');
        }
      })

      promise.success = function(fn){
        promise.then(fn);
        return promise;
      }
      promise.error = function(fn){
        promise.then(null, fn);
        return promise;
      }
      return promise;
    }
  }
})

.service('userData', function () {
  var userID;
  var token;

  return {
    getUserID: function () {
      console.log("User get: " + userID);
      return userID;
    },
    setUserID: function(value) {
      console.log("Set User to: " + value);
      userID = value;
    },
    getToken: function () {
      return token;
    },
    setToken: function(value) {
      token = value;
    }
  };
})


.controller('AppCtrl', function($scope, $ionicModal, $timeout, login) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    login.login($scope.loginData.username, $scope.loginData.password).success(function(data){
      $state.go('app.home');
    }).error(function(data){
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
    });
  };
})


.controller('HomeCtrl', function($scope, $state, userData) {
  var link = 'https://server.com/getNotes.php';
  var info = {"userId": userData.getUserID(), "token":userData.getToken()};
  $http.post(link,info).then(function(res){
    if(res.data[0]){
      $scope.notes = res.data[1];
    }
    else{
      $scope.login();
    }
  }

})
