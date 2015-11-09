angular.module('generatorApp')
.controller('generatorController', ['$scope', '$location', '$timeout', 'GeneratorService',
function($scope, $location, $timeout, GeneratorService) {

  $scope.generatedMml = "なし";

  function setMmlFromUrl() {
    // [URLイメージ] ～/#?mml=C
    var urlMml = $location.search().mml;
    if (angular.isString(urlMml)) {
      $scope.inputText = urlMml;
      $scope.generate();
    }
  }

  $scope.generate = function() {
    $scope.generatedMml = GeneratorService.generate($scope.inputText);
    SIOPM.compile($scope.generatedMml);
  };

  SIOPM.onLoad = function() {
    $timeout(function() {
      setMmlFromUrl();
    }, 0);
  };
        
  SIOPM.onCompileComplete = function() {
    SIOPM.play();
  };

  SIOPM.initialize();

}]);
