angular.module('generatorApp')
.controller('generatorController', ['$scope', '$location', '$timeout', 'GeneratorService',
function($scope, $location, $timeout, GeneratorService) {

  $scope.p = {};
  $scope.p.initWait = 0;
  $scope.p.chordKeyOffset = "0"; // setParamsFromUrlより前に初期化が必要な為（ng-initではsetParamsFromUrlの後になることがあるようなので）
  $scope.p.inputNumbersType = "SEVENTH";
  $scope.p.voicingType = "CLOSE";
  $scope.p.chordAddMode = "DIATONIC";
  $scope.generatedMml = "なし"; // 生成結果は$scope.pには持たせない($scope.pを入力として処理した出力がこれなので)
  $scope.mmlFormat = "sion";
  $scope.iPhoneReady = false;
  $scope.isPlayFromUrl = false;

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
    // [URLイメージ] ～/#?p=abcdef [補足] pがある場合は上記を上書き、pがない場合は上記のまま
    var p = $scope.getDecompressedParamsFromUrl();
    if (p) {
      angular.extend($scope.p, p);  // pの初期値を消さない。[理由] 古いバージョンが出力したURLも鳴らせるようにする為
      $scope.setPrefixAllStr();
      $scope.isPlayFromUrl = true;
    }
  }
  // URLに反映 [用途] 書いたChordNameをURLコピペで共有できるようにする
  function setParamsToUrl() {
    $location.search({
      p: $scope.getCompressedParamsForUrl()
    //   chord : $scope.p.inputText,
    //   opm : $scope.p.prefixAllStr,
    //   initwait : $scope.p.initWait,
    //   maxtopnotenums : getMaxtopnotenums()
    });
    // function getMaxtopnotenums() {
    //   var str = '';
    //   angular.forEach($scope.p.maxTopNoteNums, function (v) {
    //     if (str !== '') str += ',';
    //     str += v.maxTopNoteNum;
    //   });
    //   return str;
    // }
  }


  $scope.generate = function() {
    //iOSでは、WebAudioを最初にclickイベントから扱う必要がある。
    //一度onloadまたはonchangedで実行してしまうと、その後clickで再生しても無音になる。
    if($scope.isiPhone() && $scope.iPhoneReady === false){
        return;
    }

    $scope.expandMaxTopNoteNumsByChordNamesCount(); // MML生成の前にmaxTopNoteNumsの生成を行う

    //$scope.generatedMml = GeneratorService.generate($scope.p.inputText, $scope.p.prefixTrackType, $scope.p.centerCnoteNum, $scope.p.prefixAllType);
    //$scope.generatedMml = GeneratorService.getChordsMmlFromInputText($scope.p.inputText, $scope.p.prefixTrackType, $scope.p.centerCnoteNum, $scope.p.prefixAllType);
    //$scope.generatedMml = GeneratorService.getInventionMmlFromInputText($scope.p.inputText, $scope.p.prefixTrackType, $scope.p.centerCnoteNum, $scope.p.prefixAllType, $scope.p.maxTopNoteNum, $scope.p.maxbassNoteNum, $scope.p.delay);
    $scope.generatedMml = "";
    $scope.generatedMml += "/*♪" + $scope.p.inputText + "♪*/";
    $scope.generatedMml += GeneratorService.getInventionMmlFromInputText($scope.p.inputText, $scope.p.prefixTrackType, $scope.p.centerCnoteNum, $scope.p.prefixAllType, $scope.p.maxTopNoteNums, $scope.p.maxbassNoteNum, $scope.p.delay, $scope.p.voicingType, $scope.p.rhythmTemplates);

    $timeout(function() { // compileより前にする(compileがSIOPMロード失敗の為にundefinedでexceptionになっても、先にURLへの反映はしておく)
      setParamsToUrl();
    }, 0);

    switch($scope.mmlFormat){
      case "sion" :
        try{
          SIOPM.stop();
        }catch(e){
          //console.log(e);
          //fallback
          $scope.mmlFormat = "sionic";
          $scope.generate();
          return;
        }
        break;
      case "sionic" :
        Pico.pause();
        break;
      default: 
        console.error("Unsupported format");
    }

    switch($scope.mmlFormat){
      case "sion" :
        SIOPM.compile($scope.generatedMml);
        break;
      case "sionic" :
        Pico.play(Sionic($scope.generatedMml));
        break;
      default: 
        console.error("Unsupported format");
    }
  };

  $scope.play = function(){
    $scope.iPhoneReady = true;
    $scope.generate();
  }
  
  $scope.isiPhone = function(){
    return window.navigator.userAgent.toLowerCase().indexOf("iphone") >= 0;
  }

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
  $scope.p.rhythmTemplates = [];
  $scope.oldMaxTopNoteNumsCount = $scope.p.maxTopNoteNums.length;
  $scope.oldRhythmTemplatesCount = $scope.p.rhythmTemplates.length;
  $scope.expandMaxTopNoteNumsByChordNamesCount = function() {
    var noteNumsCount = $scope.getNoteNumbersList().length;
    while ($scope.oldMaxTopNoteNumsCount < noteNumsCount) {
      $scope.p.maxTopNoteNums.push({maxTopNoteNum: $scope.p.maxTopNoteNum});
      $scope.oldMaxTopNoteNumsCount++;
    }
    while ($scope.oldRhythmTemplatesCount < noteNumsCount) {
      $scope.p.rhythmTemplates.push({r: $scope.p.rhythmTemplate});
      $scope.oldRhythmTemplatesCount++;
    }
    // [補足] localではonLoadに到達しないのでこれが起動後に呼ばれない、のは、やむなし
  };
  $scope.resetMaxTopNoteNums = function() {
    angular.forEach($scope.p.maxTopNoteNums, function(mtnn) {
      mtnn.maxTopNoteNum = $scope.p.maxTopNoteNum;
    });
    $scope.generate();
  }
  $scope.resetRhythmTemplates = function() {
    angular.forEach($scope.p.rhythmTemplates, function(rhythmTemplate) {
      rhythmTemplate.r = $scope.p.rhythmTemplate;
    });
    $scope.generate();
  }

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

  $scope.getCompressedParamsForUrl = function() {
    return lzbase62.compress(JSON.stringify($scope.p));
  };

  $scope.getDecompressedParamsFromUrl = function() {
    var paramFromUrl = $location.search().p;
    if (!paramFromUrl) return undefined;
    return JSON.parse(lzbase62.decompress(paramFromUrl));
  };

  $scope.openTweet = function() {
    var twUrl = "https://twitter.com/intent/tweet?";
    var prms = "";
    prms += "hashtags=" + "mmlchordgen";
    prms += "&text=" +
      encodeURIComponent("♪" + $scope.p.inputText + "♪ " +
        window.location.href
      );
    window.open(twUrl + prms, "", "scrollbars=yes,width=500,height=300");
  };

  // degree表記のコードネーム入力を元に、コードMMLを生成する
  $scope.getInputTextFromInputNumbers = function() {
    $scope.p.inputText = GeneratorService.getInputTextFromInputNumbers($scope.p.inputNumbers, $scope.p.chordKeyOffset, $scope.p.inputNumbersType, $scope.p.chordAddMode, $scope.p.bassPedal);
    $scope.generate();
  };

  $scope.keyRadios = [
    {id:0, name:"C"},
    {id:1, name:"C#"},
    {id:2, name:"D"},
    {id:3, name:"D#"},
    {id:4, name:"E"},
    {id:5, name:"F"},
    {id:6, name:"F#"},
    {id:7, name:"G"},
    {id:8, name:"G#"},
    {id:9, name:"A"},
    {id:10, name:"A#"},
    {id:11, name:"B"}
  ];

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

  try{
    SIOPM.initialize(); // [前提] SIOPMのプロパティへ各functionを代入し終わっていること
  }catch(e){
    //fallback
    $scope.mmlFormat = "sionic";
  }
  $timeout(function() {
    setParamsFromUrl(); // [前提] $scopeのプロパティへ各functionを代入し終わっていること
  }, 0);


}]);
