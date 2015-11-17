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

  var prefixAllStr = '#OPM@0 { 5, 1,' +
    ' 24,  9,  8,  5, 10, 48,  0,  4,  2,  0,  0,' +
    ' 17, 10,  9,  3, 15,  0,  0,  5,  3,  0,  0,' +
    '  9,  8,  6,  5, 12,  0,  0,  4,  5,  0,  0,' +
    ' 21,  7, 11,  5, 14,  0,  0,  5,  5,  0,  0,' +
    '};'
  ;

  $scope.generate = function() {
    $scope.generatedMml = $scope.getNoteMmls();
    
    if ($scope.prefixAllType == 'PREFIX_ALL_1') {
      $scope.generatedMml = prefixAllStr + $scope.generatedMml;
    }
    
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
    return GeneratorService.getNoteMmls(chordNoteNumbers, $scope.prefixTrackType);
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
