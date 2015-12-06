angular.module('generatorApp')
.controller('generatorController', ['$scope', '$location', '$timeout', 'GeneratorService',
function($scope, $location, $timeout, GeneratorService) {

  $scope.generatedMml = "なし";
  $scope.initWait = 0;

  function setParamsFromUrl() {
    // [URLイメージ] ～/#?chord=C
    var urlChord = $location.search().chord;
    var urlOpm = $location.search().opm;
    var urlInitWait = $location.search().initwait;
    var urlMaxTopNoteNums = $location.search().maxtopnotenums;
    if (angular.isString(urlChord)) $scope.inputText = urlChord;
    if (angular.isString(urlOpm)) {
      $scope.prefixAllStr = urlOpm;
      $scope.setPrefixAllStr();
    }
    if (angular.isString(urlInitWait)) {
      $scope.initWait = urlInitWait;
    }
    if (angular.isString(urlMaxTopNoteNums)) {
      var arr = urlMaxTopNoteNums.split(',');
      $scope.maxTopNoteNums = [];
      angular.forEach(arr, function(v) {
        $scope.maxTopNoteNums.push({maxTopNoteNum: v});
      });
    }
  }
  // URLに反映 [用途] 書いたChordNameをURLコピペで共有できるようにする
  function setParamsToUrl() {
    $location.search({
      chord : $scope.inputText,
      opm : $scope.prefixAllStr,
      initwait : $scope.initWait,
      maxtopnotenums : getMaxtopnotenums()
    });
    function getMaxtopnotenums() {
      var str = '';
      angular.forEach($scope.maxTopNoteNums, function (v) {
        if (str !== '') str += ',';
        str += v.maxTopNoteNum;
      });
      return str;
    }
  }


  $scope.generate = function() {
    $scope.expandMaxTopNoteNumsByChordNamesCount(); // MML生成の前にmaxTopNoteNumsの生成を行う

    //$scope.generatedMml = GeneratorService.generate($scope.inputText, $scope.prefixTrackType, $scope.centerCnoteNum, $scope.prefixAllType);
    //$scope.generatedMml = GeneratorService.getChordsMmlFromInputText($scope.inputText, $scope.prefixTrackType, $scope.centerCnoteNum, $scope.prefixAllType);
    //$scope.generatedMml = GeneratorService.getInventionMmlFromInputText($scope.inputText, $scope.prefixTrackType, $scope.centerCnoteNum, $scope.prefixAllType, $scope.maxTopNoteNum, $scope.maxbassNoteNum, $scope.delay);
    $scope.generatedMml = GeneratorService.getInventionMmlFromInputText($scope.inputText, $scope.prefixTrackType, $scope.centerCnoteNum, $scope.prefixAllType, $scope.maxTopNoteNums, $scope.maxbassNoteNum, $scope.delay);

    $timeout(function() { // compileより前にする(compileがSIOPMロード失敗の為にundefinedでexceptionになっても、先にURLへの反映はしておく)
      setParamsToUrl();
    }, 0);

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
    return GeneratorService.getChordsMmlFromInputText($scope.inputText, $scope.prefixTrackType, $scope.centerCnoteNum, $scope.prefixAllType, $scope.delay);
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

  $scope.maxTopNoteNums = [];
  $scope.oldMaxTopNoteNumsCount = $scope.maxTopNoteNums.length;
  $scope.expandMaxTopNoteNumsByChordNamesCount = function() {
    var maxTopNoteNumsCount = $scope.getNoteNumbersList().length;
    while ($scope.oldMaxTopNoteNumsCount < maxTopNoteNumsCount) {
      $scope.maxTopNoteNums.push({maxTopNoteNum: $scope.maxTopNoteNum});
      $scope.oldMaxTopNoteNumsCount = $scope.maxTopNoteNums.length;
    }
    // [補足] localではonLoadに到達しないのでこれが起動後に呼ばれない、のは、やむなし
  };

  $scope.getParsedData = function() {
    var paramFromUrl = lzbase62.compress(JSON.stringify($location.search()));
    $scope.p = JSON.parse(lzbase62.decompress(paramFromUrl));
    return $scope.p.chord;
  };

  $scope.getStringifyStrFromUrlFormat = function() {
    var str = JSON.stringify($location.search());
    return "size:" +
    str.length + " : " +
    str;
  };

  $scope.getCompressedStrFromUrlFormat = function() {
    var str = lzbase62.compress(JSON.stringify($location.search()));
    return "size:" +
    str.length + " : " +
    str;
  };

  SIOPM.onLoad = function() {
    if (angular.isString($scope.inputText)) {
      $timeout(function() {
        $scope.generate();
      }, 0);
    }
  };

  SIOPM.onCompileComplete = function() {
    SIOPM.play();
  };

  SIOPM.initialize(); // [前提] SIOPMのプロパティへ各functionを代入し終わっていること
  $timeout(function() {
    setParamsFromUrl(); // [前提] $scopeのプロパティへ各functionを代入し終わっていること
  }, 0);

}]);
