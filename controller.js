angular.module('generatorApp')
.controller('generatorController', ['$scope', '$location', '$timeout', 'GeneratorService',
function($scope, $location, $timeout, GeneratorService) {

  $scope.generatedMml = "なし";

  function setParamsFromUrl() {
    // [URLイメージ] ～/#?chord=C
    var urlChord = $location.search().chord;
    if (angular.isString(urlChord)) {
      $scope.inputText = urlChord;
      $scope.generate();
    }
  }


  $scope.generate = function() {
    //$scope.generatedMml = GeneratorService.generate($scope.inputText, $scope.prefixTrackType, $scope.centerCnoteNum, $scope.prefixAllType);
    //$scope.generatedMml = GeneratorService.getChordsMmlFromInputText($scope.inputText, $scope.prefixTrackType, $scope.centerCnoteNum, $scope.prefixAllType);
    $scope.generatedMml = GeneratorService.getInventionMmlFromInputText($scope.inputText, $scope.prefixTrackType, $scope.centerCnoteNum, $scope.prefixAllType, $scope.maxTopNoteNum, $scope.maxbassNoteNum);
    
    SIOPM.compile($scope.generatedMml);
    // URLに反映 [用途] 書いたChordNameをURLコピペで共有できるようにする
    $location.search({chord : $scope.inputText});
  };

  $scope.getRootNoteType = function() {
    return GeneratorService.getRootNoteTypeFromOneChordName($scope.inputText).r;
  };

  $scope.getChordType = function() {
    return GeneratorService.getChordTypeFromOneChordName($scope.inputText);
  };
  
  $scope.getChordIntervals = function() {
    return GeneratorService.getChordIntervalsFromOneChordName($scope.inputText);
  };

  $scope.getChordNoteNumbers = function() {
    return GeneratorService.getChordNoteNumbersFromOneChordName($scope.inputText, $scope.centerCnoteNum);
  };

  $scope.getNoteMml1 = function() {
    return GeneratorService.getNoteMml1FromOneChordName($scope.inputText, $scope.centerCnoteNum);
  };

  $scope.getNoteMmls = function() {
    return GeneratorService.getNoteMmlsFromOneChordName($scope.inputText, $scope.prefixTrackType, $scope.centerCnoteNum);
  };

  $scope.getChordNames = function() {
    return GeneratorService.getChordNames($scope.inputText);
  };

  $scope.getNoteNumbersList = function() {
    return GeneratorService.getNoteNumbersListFromInputText($scope.inputText, $scope.centerCnoteNum);
  };

  $scope.getPivotNoteNumbers = function() {
    return GeneratorService.getPivotNoteNumbersFromInputText($scope.inputText, $scope.centerCnoteNum);
  };

  $scope.getChordsMml = function() {
    return GeneratorService.getChordsMmlFromInputText($scope.inputText, $scope.prefixTrackType, $scope.centerCnoteNum, $scope.prefixAllType);
  };

  $scope.getInventionNoteNumbers = function() {
    return GeneratorService.getInventionNoteNumbersFromInputText($scope.inputText, $scope.centerCnoteNum, $scope.maxTopNoteNum);
  };



  SIOPM.onLoad = function() {
    $timeout(function() {
      setParamsFromUrl();
    }, 500);
  };
        
  SIOPM.onCompileComplete = function() {
    SIOPM.play();
  };

  SIOPM.initialize();

}]);
