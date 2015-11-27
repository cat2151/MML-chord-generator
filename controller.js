angular.module('generatorApp')
.controller('generatorController', ['$scope', '$location', '$timeout', 'GeneratorService',
function($scope, $location, $timeout, GeneratorService) {

  $scope.generatedMml = "なし";
  $scope.initWait = 100;

  function setParamsFromUrl() {
    // [URLイメージ] ～/#?chord=C
    var urlChord = $location.search().chord;
    var urlOpm = $location.search().opm;
    var urlInitWait = $location.search().initwait;
    if (angular.isString(urlChord)) $scope.inputText = urlChord;
    if (angular.isString(urlOpm)) {
      $scope.prefixAllStr = urlOpm;
      $scope.setPrefixAllStr();
    }
    if (angular.isString(urlInitWait)) {
      $scope.initWait = urlInitWait;
    }
  }
  // URLに反映 [用途] 書いたChordNameをURLコピペで共有できるようにする
  function setParamsToUrl() {
    $location.search({
      chord : $scope.inputText,
      opm : $scope.prefixAllStr,
      initwait : $scope.initWait
    });
  }


  $scope.generate = function() {
    //$scope.generatedMml = GeneratorService.generate($scope.inputText, $scope.prefixTrackType, $scope.centerCnoteNum, $scope.prefixAllType);
    //$scope.generatedMml = GeneratorService.getChordsMmlFromInputText($scope.inputText, $scope.prefixTrackType, $scope.centerCnoteNum, $scope.prefixAllType);
    $scope.generatedMml = GeneratorService.getInventionMmlFromInputText($scope.inputText, $scope.prefixTrackType, $scope.centerCnoteNum, $scope.prefixAllType, $scope.maxTopNoteNum, $scope.maxbassNoteNum, $scope.delay);

    SIOPM.compile($scope.generatedMml);
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

  $scope.prefixAllStr = GeneratorService.getPrefixAllStr();
  $scope.getPrefixAllStr = function() {
    $scope.prefixAllStr = GeneratorService.getPrefixAllStr();
  };
  $scope.setPrefixAllStr = function() {
    GeneratorService.setPrefixAllStr($scope.prefixAllStr);
  };
  $scope.setPrefixAllStrFromType = function() {
    GeneratorService.setPrefixAllStrFromType($scope.prefixAllType);
    $scope.getPrefixAllStr();
    $scope.generate();
  };



  SIOPM.onLoad = function() {
    if (angular.isString($scope.inputText)) {
      $timeout(function() {
        $scope.generate();
      }, $scope.initWait);
    }
  };

  SIOPM.onCompileComplete = function() {
    SIOPM.play();
    $timeout(function() {
      setParamsToUrl();
    }, 0);
  };

  SIOPM.initialize(); // [前提] SIOPMのプロパティへ各functionを代入し終わっていること
  setParamsFromUrl(); // [前提] $scopeのプロパティへ各functionを代入し終わっていること

}]);
