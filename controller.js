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
    $scope.generatedMml = GeneratorService.generate($scope.inputText, $scope.prefixTrackType, $scope.centerCnoteNum, $scope.prefixAllType);
    
    SIOPM.compile($scope.generatedMml);
    // URLに反映 [用途] 書いたMMLをURLコピペで共有できるようにする
    $location.search({mml : $scope.generatedMml});
  };

  $scope.getRootNoteType = function() {
    return GeneratorService.getRootNoteTypeFromInputText($scope.inputText).r;
  };

  $scope.getChordType = function() {
    return GeneratorService.getChordTypeFromInputText($scope.inputText);
  };
  
  $scope.getChordIntervals = function() {
    return GeneratorService.getChordIntervalsFromInputText($scope.inputText);
  };

  $scope.centerCnoteNum = 60;

  $scope.getChordNoteNumbers = function() {
    return GeneratorService.getChordNoteNumbersFromInputText($scope.inputText, $scope.centerCnoteNum);
  };

  $scope.getNoteMml1 = function() {
    return GeneratorService.getNoteMml1FromInputText($scope.inputText, $scope.centerCnoteNum);
  };

  $scope.getNoteMmls = function() {
    return GeneratorService.getNoteMmlsFromInputText($scope.inputText, $scope.prefixTrackType, $scope.centerCnoteNum);
  };



  SIOPM.onLoad = function() {
    $timeout(function() {
      setMmlFromUrl();
    }, 1000);
  };
        
  SIOPM.onCompileComplete = function() {
    SIOPM.play();
  };

  SIOPM.initialize();

}]);
