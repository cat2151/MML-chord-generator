angular.module('generatorApp')
.service('GeneratorService', [
function() {

  function isEmpty(v) {
    if (v === undefined || v === null || v === '') return true;
    return false;
  }

  function isNumberStr(x) {
    return Number(x) !== Number(x);
  }

  var prefixAllStr = '#OPM@0 { 5, 1,\n' +
    ' 26,  7,  9,  3, 10, 20,  1,  2,  2,  0,  0,' + '\n' +
    ' 24,  9,  9,  3, 15,  0,  2,  3,  3,  0,  0,' + '\n' +
    ' 22,  8,  6,  5, 12,  0,  1,  2,  5,  0,  0,' + '\n' +
    ' 20,  7, 11,  5, 14,  0,  0,  1,  4,  0,  0,' + '\n' +
    '};'
  ;

  function setPrefixAllStr(v) {
    prefixAllStr = v;
  }  
  function getPrefixAllStr() {
    return prefixAllStr;
  }  

  // [イメージ] 'Cm' → 'c;e-;g'
  function generate(oneChordName, prefixTrackType, centerCnoteNum, prefixAllType) {
    var mml = '';
    if (prefixAllType == 'PREFIX_ALL_1') {
      mml += prefixAllStr;
    }
    mml += getNoteMmlsFromOneChordName(oneChordName, prefixTrackType, centerCnoteNum);
    return mml;
  }
  
  // [イメージ] 'Bb' → 10, ''
  function getRootNoteTypeFromOneChordName(oneChordName) {
    var txt = oneChordName;
    if (isEmpty(oneChordName)) txt = ''; // undefined → ''
    var ret = {r: -1, p: txt};
    txt = txt.replace(/[♯＃]/g, '#');
    txt = txt.replace(/♭/g, 'b');
    // [イメージ] C#を判定するためにはCより先に判定
    if (s('C#|Db', 1)) return ret;
    if (s('D#|Eb', 3)) return ret;
    if (s('F#|Gb', 6)) return ret;
    if (s('G#|Ab', 8)) return ret;
    if (s('A#|Bb', 10)) return ret;
    if (s('C', 0)) return ret;
    if (s('D', 2)) return ret;
    if (s('E', 4)) return ret;
    if (s('F', 5)) return ret;
    if (s('G', 7)) return ret;
    if (s('A', 9)) return ret;
    if (s('B', 11)) return ret;
    return ret;
    function s(pattern, r) {
      var rgxp = new RegExp(pattern);
      if (txt.search(rgxp) == 0) {
        ret.r = r;
        ret.p = txt.replace(rgxp, '');
        return true;
      }
      return false;
    }
  }
  
  // [イメージ] '' → MAJOR, 'm' → MINOR
  var MAJOR = 'MAJOR';
  var MINOR = 'MINOR';
  var SEVENTH = 'SEVENTH';
  var SUS4 = 'SUS4';
  var MAJOR7 = 'MAJOR7';
  var MINOR7 = 'MINOR7';
  var SIXTH = 'SIXTH';
  function getChordType(parsedText) {
    var txt = parsedText;
    if (isEmpty(parsedText)) txt = ''; // undefined → ''
    var ret = {t: '', p: txt};
    // [イメージ] m7を判定するためにはmより先に判定
    if (s('sus4', SUS4)) return ret;
    if (s('M7', MAJOR7)) return ret;
    if (s('m7', MINOR7)) return ret;
    if (s('m', MINOR)) return ret;
    if (s('7', SEVENTH)) return ret;
    if (s('6', SIXTH)) return ret;
    if (s('', MAJOR)) return ret;
    return ret;
    function s(v, t) {
      if (v == txt) {
        ret.t = t;
        return true;
      }
      return false;
    }
  }

  function getChordTypeFromOneChordName(oneChordName) {
    var parsedText = getRootNoteTypeFromOneChordName(oneChordName).p;
    return getChordType(parsedText);
  };


  // [イメージ] MAJOR → [0, 4, 7]
  function getChordIntervals(t) {
    if (t == MAJOR) return [0, 4, 7];
    if (t == MINOR) return [0, 3, 7];
    if (t == SEVENTH) return [0, 4, 7, 10];
    if (t == SUS4) return [0, 5, 7];
    if (t == MAJOR7) return [0, 4, 7, 11];
    if (t == MINOR7) return [0, 3, 7, 10];
    if (t == SIXTH) return [0, 4, 7, 9];
    return [];
  }

  function getChordIntervalsFromOneChordName(oneChordName) {
    var t = getChordTypeFromOneChordName(oneChordName).t;
    return getChordIntervals(t);
  };


  // [イメージ] 10, [0, 4, 7], 60 → [70, 74, 77]
  function getChordNoteNumbers(rootNoteType, intervals, centerCnoteNum) {
    var ret = [];
    if (isNumberStr(centerCnoteNum)) return ret;
    if (rootNoteType < 0 || rootNoteType > 11) return ret; // 0～11 のみ許可
    angular.forEach(intervals, function(interval, key) {
      this[key] = Number(centerCnoteNum) + rootNoteType + interval;
    }, ret);
    return ret;
  }

  function getChordNoteNumbersFromOneChordName(oneChordName, centerCnoteNum) {
    var r = getRootNoteTypeFromOneChordName(oneChordName).r;
    var intervals = getChordIntervalsFromOneChordName(oneChordName);
    return getChordNoteNumbers(r, intervals, centerCnoteNum);
  };

  // [イメージ] 60 → o4c
  function getNoteMml(noteNumber) {
    if (noteNumber < 0 || noteNumber > 127) return ''; // 0～127 のみ許可
    var octave = 'o' + (Math.floor(noteNumber / 12) - 0); /* 基準 : OPMのnoteNumber60が中央ドに聴こえる程度 */
    var cdefgab = getCdefgab(noteNumber % 12);
    return octave + cdefgab;
    function getCdefgab(v) {
      var n = ['c', 'c+', 'd', 'd+', 'e', 'f', 'f+', 'g', 'g+', 'a', 'a+', 'b'];
      return n[v];
    }
  }

  function getNoteMml1FromOneChordName(oneChordName, centerCnoteNum) {
    var chordNoteNumbers = getChordNoteNumbersFromOneChordName(oneChordName, centerCnoteNum);
    if (!chordNoteNumbers.length) return '';
    return getNoteMml(chordNoteNumbers[0]);
  };
  
  var prefixTrackStr = '%6 @0 l2 v8';

  function getNoteMmls(noteNumbers, prefixTrackType) {
    if (!noteNumbers.length) return '';
    var mml = '';
    angular.forEach(noteNumbers, function(noteNumber) {
      if (mml) mml += ';';
      if (prefixTrackType == 'PREFIX_TRACK_1') {
        mml += prefixTrackStr;
      }
      mml += getNoteMml(noteNumber);
    });
    return mml;
  }

  // [イメージ] 'C', '', 60 → 'o4c;o4e;o4g'
  function getNoteMmlsFromOneChordName(oneChordName, prefixTrackType, centerCnoteNum) {
    var chordNoteNumbers = getChordNoteNumbersFromOneChordName(oneChordName, centerCnoteNum);
    return getNoteMmls(chordNoteNumbers, prefixTrackType);
  };

  // [イメージ] 'C D' → ['C','D']
  function getChordNames(inputText) {
    if (isEmpty(inputText)) return [];
    var chordNames = inputText.split(' ');
    return chordNames;
  }

  // [イメージ] ['C', 'Dm'] → [ [60,64,67], [62,65,69] ]
  function getNoteNumbersListFromChordNames(chordNames, centerCnoteNum) {
    var noteNumbersList = [];
    var chordNoteNumbers;
    angular.forEach(chordNames, function(oneChordName) {
      chordNoteNumbers = getChordNoteNumbersFromOneChordName(oneChordName, centerCnoteNum);
      noteNumbersList.push(chordNoteNumbers);
    });
    return noteNumbersList;
  };

  // [イメージ] 'C Dm' → [ [60,64,67], [62,65,69] ]
  function getNoteNumbersListFromInputText(inputText, centerCnoteNum) {
    if (isEmpty(inputText)) return [];
    var chordNames = getChordNames(inputText);
    return getNoteNumbersListFromChordNames(chordNames, centerCnoteNum);
  }
  
  function getPivotNoteNumbers(noteNumbersList) {
    if (!noteNumbersList.length) return [];
    // max和音数取得
    var maxLength = 0;
    angular.forEach(noteNumbersList, function(noteNumbers) {
      if (noteNumbers.length > maxLength) maxLength = noteNumbers.length;
    });
    // 配列初期化
    var pivoted = [];
    var ix, iy;
    for (iy = 0; iy < maxLength; iy++) {
      pivoted.push(new Array(noteNumbersList.length));
    }
    // 縦横交換
    for (ix = 0; ix < noteNumbersList.length; ix++) {
      for (iy = 0; iy < maxLength; iy++) {
        pivoted[iy][ix] = noteNumbersList[ix][iy];
      }
    }
    return pivoted;
  }
  
  function getPivotNoteNumbersFromInputText(inputText, centerCnoteNum) {
    if (isEmpty(inputText)) return [];
    var noteNumbersList = getNoteNumbersListFromInputText(inputText, centerCnoteNum);
    return getPivotNoteNumbers(noteNumbersList);
  }
  
  function getChordsMml(/*pivotedNoteNumbersList as */pivoted, prefixTrackType, prefixAllType) {
    if (!pivoted.length) return [];
    var mml = '';
    if (prefixAllType == 'PREFIX_ALL_1') {
      mml += prefixAllStr;
    }
    mml += getM();
    return mml;
    function getM() {
      var mml = '';
      angular.forEach(pivoted, function(trackNoteNumbers) {
        if (mml) mml += ';';
        if (prefixTrackType == 'PREFIX_TRACK_1') {
          mml += prefixTrackStr;
        }
        angular.forEach(trackNoteNumbers, function(noteNumber) {
          if (isEmpty(noteNumber)) {
            mml += 'r';
            return;
          }
          mml += getNoteMml(noteNumber);
        });
      });
      return mml;
    }
  }
  
  // [イメージ] 'C Dm' → 'o4c o4d; o4e o4f; o4g o4a'
  function getChordsMmlFromInputText(inputText, prefixTrackType, centerCnoteNum, prefixAllType) {
    if (isEmpty(inputText)) return '';
    var pivoted = getPivotNoteNumbersFromInputText(inputText, centerCnoteNum);
    return getChordsMml(pivoted, prefixTrackType, prefixAllType);
  }

  function inventionNoteNumbersUp(noteNumbers) {
    if (!noteNumbers.length) return;
    noteNumbers[0] += 12;
    noteNumbers.sort(function(a, b) {
      return a - b; // 数値ソート
    });
  }
  function inventionNoteNumbersDown(noteNumbers) {
    if (!noteNumbers.length) return;
    noteNumbers[noteNumbers.length - 1] -= 12;
    noteNumbers.sort(function(a, b) {
      return a - b; // 数値ソート
    });
  }
  
  function getInventionNoteNumbers(noteNumbersList, maxTopNoteNum) {
    if (isNumberStr(maxTopNoteNum)) return [];
    if (!noteNumbersList.length) return [];
    angular.forEach(noteNumbersList, function(noteNumbers) {
      if (noteNumbers.length == 0) return;
      var i;
      for (i = 0; i < 128; i++) {
        var topNote = noteNumbers[noteNumbers.length - 1];
        if (topNote >= Number(maxTopNoteNum)) break;
        inventionNoteNumbersUp(noteNumbers);
      }
      for (i = 0; i < 128; i++) {
        var topNote = noteNumbers[noteNumbers.length - 1];
        if (topNote <= Number(maxTopNoteNum)) break;
        inventionNoteNumbersDown(noteNumbers);
      }
      for (i = 0; i < 128; i++) { // トップノートとセカンドノートが半音差の場合は、そうならないよう、トップノートを下げる転回を行う
        if (noteNumbers.length <= 2) return;
        var topNote = noteNumbers[noteNumbers.length - 1];
        var secondNote = noteNumbers[noteNumbers.length - 2];
        if (topNote - secondNote != 1) break;
        inventionNoteNumbersDown(noteNumbers);
      }
    });
    return noteNumbersList;
  }

  // [イメージ] 'C' → '[[60, 64, 67]]' → '[[60+12, 64, 67]] → '[[64, 67, 60+12]]
  function getInventionNoteNumbersFromInputText(inputText, centerCnoteNum, maxTopNoteNum) {
    if (isEmpty(inputText)) return [];
    var noteNumbersList = getNoteNumbersListFromInputText(inputText, centerCnoteNum);
    return getInventionNoteNumbers(noteNumbersList, maxTopNoteNum);
  }
  
  // [補足] 転回の後に追加すること
  function getAddedBass(inputText, noteNumbersList, centerCnoteNum, maxbassNoteNum) {
    if (isEmpty(inputText)) return [];
    if (isNumberStr(maxbassNoteNum)) return [];
    if (!noteNumbersList.length) return [];
    var noteList2 = getNoteNumbersListFromInputText(inputText, centerCnoteNum);
    // bassを取得
    var basses = [];
    angular.forEach(noteList2, function(note2Numbers, key) {
      if (!note2Numbers.length) return;
      var bass = note2Numbers[0];
      var i;
      for (i = 0; i < 128; i++) {
        if (bass >= Number(maxbassNoteNum)) break;
        bass += 12;
      }
      for (i = 0; i < 128; i++) {
        if (bass <= Number(maxbassNoteNum)) break;
        bass -= 12;
      }
      basses.push(bass);
    });
    // bassを追加
    angular.forEach(basses, function(bass, key) {
      noteNumbersList[key].push(bass);
      noteNumbersList[key].sort(function(a, b) {
        return a - b; // 数値ソート
      });
    });
    return noteNumbersList;
  }

  function getInventionMmlFromInputText(inputText, prefixTrackType, centerCnoteNum, prefixAllType, maxTopNoteNum, maxbassNoteNum) {
    if (isEmpty(inputText)) return '';
    var noteNumbersList = getInventionNoteNumbersFromInputText(inputText, centerCnoteNum, maxTopNoteNum);
    var addedBass = getAddedBass(inputText, noteNumbersList, centerCnoteNum, maxbassNoteNum);
    var pivoted = getPivotNoteNumbers(addedBass);
    return getChordsMml(pivoted, prefixTrackType, prefixAllType);
  }

  return {
    isEmpty: isEmpty,
    generate: generate,
    getRootNoteTypeFromOneChordName: getRootNoteTypeFromOneChordName,
    getChordType: getChordType,
    getChordTypeFromOneChordName: getChordTypeFromOneChordName,
    getChordIntervals: getChordIntervals,
    getChordIntervalsFromOneChordName: getChordIntervalsFromOneChordName,
    getChordNoteNumbers: getChordNoteNumbers,
    getChordNoteNumbersFromOneChordName: getChordNoteNumbersFromOneChordName,
    getNoteMml: getNoteMml,
    getNoteMml1FromOneChordName: getNoteMml1FromOneChordName,
    getNoteMmls: getNoteMmls,
    getNoteMmlsFromOneChordName: getNoteMmlsFromOneChordName,
    getChordNames: getChordNames,
    getNoteNumbersListFromInputText: getNoteNumbersListFromInputText,
    getPivotNoteNumbersFromInputText: getPivotNoteNumbersFromInputText,
    getChordsMmlFromInputText: getChordsMmlFromInputText,
    getInventionNoteNumbersFromInputText: getInventionNoteNumbersFromInputText,
    getInventionMmlFromInputText: getInventionMmlFromInputText,
    setPrefixAllStr: setPrefixAllStr,
    getPrefixAllStr: getPrefixAllStr
  };
}]);
