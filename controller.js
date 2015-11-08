angular.module('generatorApp')
.controller('generatorController', ['$scope', 'GeneratorService',
function($scope, GeneratorService) {

  $scope.generatedMml = "なし";

  $scope.generate = function() {
    $scope.generatedMml = GeneratorService.generate($scope.inputText);
  };

}]);
