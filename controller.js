angular.module('generatorApp')
.controller('generatorController', ['$scope', '$location', '$timeout', 'GeneratorService',
function($scope, $location, $timeout, GeneratorService) {

  $scope.p = {};
  $scope.p.initWait = 0;
  $scope.generatedMml = "なし"; // 生成結果は$scope.pには持たせない($scope.pを入力として処理した出力がこれなので)

  function setParamsFromUrl() {
    // [URLイメージ] ～/#?chord=C
    var urlChord = $location.search().chord;
    var urlOpm = $location.search().opm;
    var urlInitWait = $location.search().initwait;
    var urlMaxTopNoteNums = $location.search().maxtopnotenums;
    if (angular.isString(urlChord)) $scope.p.inputText = urlChord;
    if (angular.isString(urlOpm)) {
      $scope.p.prefixAllStr = urlOpm;
      $scope.setPrefixAllStr();
    }
    if (angular.isString(urlInitWait)) {
      $scope.p.initWait = urlInitWait;
    }
    if (angular.isString(urlMaxTopNoteNums)) {
      var arr = urlMaxTopNoteNums.split(',');
      $scope.p.maxTopNoteNums = [];
      angular.forEach(arr, function(v) {
        $scope.p.maxTopNoteNums.push({maxTopNoteNum: v});
      });
    }
  }
  // URLに反映 [用途] 書いたChordNameをURLコピペで共有できるようにする
  function setParamsToUrl() {
    $location.search({
      chord : $scope.p.inputText,
      opm : $scope.p.prefixAllStr,
      initwait : $scope.p.initWait,
      maxtopnotenums : getMaxtopnotenums()
    });
    function getMaxtopnotenums() {
      var str = '';
      angular.forEach($scope.p.maxTopNoteNums, function (v) {
        if (str !== '') str += ',';
        str += v.maxTopNoteNum;
      });
      return str;
    }
  }


  $scope.generate = function() {
    $scope.expandMaxTopNoteNumsByChordNamesCount(); // MML生成の前にmaxTopNoteNumsの生成を行う

    //$scope.generatedMml = GeneratorService.generate($scope.p.inputText, $scope.p.prefixTrackType, $scope.p.centerCnoteNum, $scope.p.prefixAllType);
    //$scope.generatedMml = GeneratorService.getChordsMmlFromInputText($scope.p.inputText, $scope.p.prefixTrackType, $scope.p.centerCnoteNum, $scope.p.prefixAllType);
    //$scope.generatedMml = GeneratorService.getInventionMmlFromInputText($scope.p.inputText, $scope.p.prefixTrackType, $scope.p.centerCnoteNum, $scope.p.prefixAllType, $scope.p.maxTopNoteNum, $scope.p.maxbassNoteNum, $scope.p.delay);
    $scope.generatedMml = GeneratorService.getInventionMmlFromInputText($scope.p.inputText, $scope.p.prefixTrackType, $scope.p.centerCnoteNum, $scope.p.prefixAllType, $scope.p.maxTopNoteNums, $scope.p.maxbassNoteNum, $scope.p.delay);

    $timeout(function() { // compileより前にする(compileがSIOPMロード失敗の為にundefinedでexceptionになっても、先にURLへの反映はしておく)
      setParamsToUrl();
    }, 0);

    SIOPM.compile($scope.generatedMml);
  };

  $scope.getRootNoteType = function() {
    return GeneratorService.getRootNoteTypeFromOneChordName($scope.p.inputText).r;
  };

  $scope.getChordType = function() {
    return GeneratorService.getChordTypeFromOneChordName($scope.p.inputText);
  };

  $scope.getChordIntervals = function() {
    return GeneratorService.getChordIntervalsFromOneChordName($scope.p.inputText);
  };

  $scope.getChordNoteNumbers = function() {
    return GeneratorService.getChordNoteNumbersFromOneChordName($scope.p.inputText, $scope.p.centerCnoteNum);
  };

  $scope.getNoteMml1 = function() {
    return GeneratorService.getNoteMml1FromOneChordName($scope.p.inputText, $scope.p.centerCnoteNum);
  };

  $scope.getNoteMmls = function() {
    return GeneratorService.getNoteMmlsFromOneChordName($scope.p.inputText, $scope.p.prefixTrackType, $scope.p.centerCnoteNum);
  };

  $scope.getChordNames = function() {
    return GeneratorService.getChordNames($scope.p.inputText);
  };

  $scope.getNoteNumbersList = function() {
    return GeneratorService.getNoteNumbersListFromInputText($scope.p.inputText, $scope.p.centerCnoteNum);
  };

  $scope.getPivotNoteNumbers = function() {
    return GeneratorService.getPivotNoteNumbersFromInputText($scope.p.inputText, $scope.p.centerCnoteNum);
  };

  $scope.getChordsMml = function() {
    return GeneratorService.getChordsMmlFromInputText($scope.p.inputText, $scope.p.prefixTrackType, $scope.p.centerCnoteNum, $scope.p.prefixAllType, $scope.p.delay);
  };

  $scope.getInventionNoteNumbers = function() {
    return GeneratorService.getInventionNoteNumbersFromInputText($scope.p.inputText, $scope.p.centerCnoteNum, $scope.p.maxTopNoteNum);
  };

  $scope.p.prefixAllStr = GeneratorService.getPrefixAllStr();
  $scope.getPrefixAllStr = function() {
    $scope.p.prefixAllStr = GeneratorService.getPrefixAllStr();
  };
  $scope.setPrefixAllStr = function() {
    GeneratorService.setPrefixAllStr($scope.p.prefixAllStr);
  };
  $scope.setPrefixAllStrFromType = function() {
    GeneratorService.setPrefixAllStrFromType($scope.p.prefixAllType);
    $scope.getPrefixAllStr();
    $scope.generate();
  };

  $scope.p.maxTopNoteNums = [];
  $scope.oldMaxTopNoteNumsCount = $scope.p.maxTopNoteNums.length;
  $scope.expandMaxTopNoteNumsByChordNamesCount = function() {
    var maxTopNoteNumsCount = $scope.getNoteNumbersList().length;
    while ($scope.oldMaxTopNoteNumsCount < maxTopNoteNumsCount) {
      $scope.p.maxTopNoteNums.push({maxTopNoteNum: $scope.p.maxTopNoteNum});
      $scope.oldMaxTopNoteNumsCount = $scope.p.maxTopNoteNums.length;
    }
    // [補足] localではonLoadに到達しないのでこれが起動後に呼ばれない、のは、やむなし
  };

  $scope.getParsedData = function() {
    var paramFromUrl = lzbase62.compress(JSON.stringify($location.search()));
    $scope.testp = JSON.parse(lzbase62.decompress(paramFromUrl));
    return $scope.testp.chord;
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
    if (angular.isString($scope.p.inputText)) {
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
