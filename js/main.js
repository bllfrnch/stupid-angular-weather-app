// Code goes here

(function() {
  'use strict';

  angular.module('app', [])
  .controller('MainController',
      ['$scope', '$http', '$q', '$document',
      function($scope, $http, $q, $document) {
    var baseUrl = 'http://api.openweathermap.org/data/2.1/find/',
      commonUrlParams = {
        cnt: 10,
        callback: 'JSON_CALLBACK'
      },
      cityUrl = 'http://api.openweathermap.org/data/2.1/forecast/city/'

    var getGeolocationCoordinates = function() {
      var deferred = $q.defer();
      navigator.geolocation.getCurrentPosition(
        function(position) { deferred.resolve(position); },
        function(error) { deferred.resolve(null); }
      );
      return deferred.promise;
    };

    var setWeather = function(response) {
      $scope.weather = response;
      console.log($scope.weather);
    };

    var setWeatherDetails = function(response) {
      $scope.weatherDetails = response;
      console.log($scope.weatherDetails);
    };

    var setLocations = function(response) {
      console.log(response);
      $scope.locations = response;
    };

    var throwWeatherError = function(error) {
      console.log('ERROR', error);
      throw new Error('Error fetching weather: ', error);
    };

    var throwWeatherDetailsError = function(error) {
      console.log('ERROR', error);
      throw new Error('Error fetching weather details: ', error);
    };

    var throwLocationError = function(error) {
      console.log('ERROR', error);
      throw new Error('Error fetching locations: ', error);
    };

    var keyupHandler = function(e) {
      $scope.showAutoComplete = e.which !== 27;
    };

    $document.on('keyup', keyupHandler);
    $scope.$on('$destroy', function() { $document.off('keyup', keyupHandler) });

    $scope.searchString = '';

    getGeolocationCoordinates()
      .then(function(position) {
        $scope.latitude = position.coords.latitude || 0;
        $scope.longitude = position.coords.longitude || 0;
        $http.jsonp(baseUrl + 'city', {
          params: angular.extend({}, {
            lat: $scope.latitude,
            lon: $scope.longitude
          }, commonUrlParams)
        })
        .then(setWeather, throwWeatherError);
      }, function(reason) {
        console.log('YOU STINK :( ', reason);
      });

    $scope.fetchWeatherDetails = function(id) {
      console.log(cityUrl + id);

      $http.jsonp(cityUrl + id, {
        params: {
          callback: 'JSON_CALLBACK'
        }
      })
      .then(setWeatherDetails, throwWeatherDetailsError)
    };

    $scope.fetchWeatherList = function(latitude, longitude) {
      console.log(latitude, longitude);
      $scope.latitude = latitude;
      $scope.longitude = longitude;

      $http.jsonp(baseUrl + 'city', {
        params: angular.extend({}, {
          lat: latitude,
          lon: longitude
        }, commonUrlParams)
      })
      .then(setWeather, throwWeatherError);
    };

    $scope.fetchLocations = function(searchString) {
      if (searchString.length < 3) { return; }
      $http.jsonp(baseUrl + 'name', {
        params: angular.extend({}, {
          q: searchString,
          type: 'like'
        }, commonUrlParams)
      })
      .then(setLocations, throwLocationError)
    };

    $scope.convert = function(k) {
      return Math.round((k - 273) * (9/5) + 32);
    },

    $scope.handleKeyUp = function(e) {
      console.log(e);
    }
  }]);
})();

// TODOs
//*** 1. convert temperature - how to do this with the model?
//*** 2. click on city name to get forecast
// 3. back button to go back to previous view
// 4. routes
// 5. icons
// 6. make it possible to always get the current weather
// 7. click outside of results to close autocomplete
// 8. clicking on result closes autocomplete
//*** 9. better way to construct URLs with angular or js?
// 10. tests
// 11. initial module error?
