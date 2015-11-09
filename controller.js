angular.module('generatorApp')
.controller('generatorController', ['$scope', '$location', 'GeneratorService',
function($scope, $location, GeneratorService) {

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
    setMmlFromUrl();
  };
        
  SIOPM.onCompileComplete = function() {
    SIOPM.play();
  };

  SIOPM.initialize();

}]);
