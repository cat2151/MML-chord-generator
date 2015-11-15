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
    var chordNoteNumbers = $scope.getChordNoteNumbers();
    $scope.generatedMml = GeneratorService.getNoteMmls(chordNoteNumbers);
    SIOPM.compile($scope.generatedMml);
    // URLに反映 [用途] 書いたMMLをURLコピペで共有できるようにする
    $location.search({mml : $scope.generatedMml});
  };

  $scope.getRootNoteType = function() {
    return GeneratorService.getRootNoteType($scope.inputText).r;
  };

  $scope.getChordType = function() {
    var parsedText = GeneratorService.getRootNoteType($scope.inputText).p;
    return GeneratorService.getChordType(parsedText);
  };
  
  $scope.getChordIntervals = function() {
    var rootNoteTypeObj = GeneratorService.getRootNoteType($scope.inputText);
    var chordType = GeneratorService.getChordType(rootNoteTypeObj.p).t;
    return GeneratorService.getChordIntervals(chordType);
  };

  $scope.getChordNoteNumbers = function() {
    var rootNoteType = $scope.getRootNoteType();
    var intervals = $scope.getChordIntervals();
    var centerCnoteNum = 60;
    return GeneratorService.getChordNoteNumbers(rootNoteType, intervals, centerCnoteNum);
  };

  $scope.getNoteMml1 = function() {
    var chordNoteNumbers = $scope.getChordNoteNumbers();
    if (!chordNoteNumbers.length) return '';
    return GeneratorService.getNoteMml(chordNoteNumbers[0]);
  };

  $scope.getNoteMmls = function() {
    var chordNoteNumbers = $scope.getChordNoteNumbers();
    return GeneratorService.getNoteMmls(chordNoteNumbers);
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
