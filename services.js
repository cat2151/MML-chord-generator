angular.module('generatorApp')
.service('GeneratorService', [
function() {

  function isEmpty(v) {
    if (v === undefined || v === null || v === '') return true;
    return false;
  }

  var prefixAllStr = '#OPM@0 { 5, 1,' +
    ' 24,  9,  8,  5, 10, 48,  0,  4,  2,  0,  0,' +
    ' 17, 10,  9,  3, 15,  0,  0,  5,  3,  0,  0,' +
    '  9,  8,  6,  5, 12,  0,  0,  4,  5,  0,  0,' +
    ' 21,  7, 11,  5, 14,  0,  0,  5,  5,  0,  0,' +
    '};'
  ;

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
    var octave = 'o' + (Math.floor(noteNumber / 12) - 1);
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
  
  var prefixTrackStr = '%6 @0 l2';

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
  
  function getPivotNoteNumbersFromInputText(inputText, centerCnoteNum) {
    var noteNumbersList = getNoteNumbersListFromInputText(inputText, centerCnoteNum);
    // max和音数取得
    var maxLength = 0;
    angular.forEach(noteNumbersList, function(noteNumbers) {
      if (noteNumbers.length > maxLength) maxLength = noteNumbers.length;
    });
    // 配列初期化
    var arr = [];
    var ix, iy;
    for (iy = 0; iy < maxLength; iy++) {
      arr.push(new Array(noteNumbersList.length));
    }
    // 縦横交換
    for (ix = 0; ix < noteNumbersList.length; ix++) {
      for (iy = 0; iy < maxLength; iy++) {
        arr[iy][ix] = noteNumbersList[ix][iy];
      }
    }
    return arr;
  }
  
  // [イメージ] 'C Dm' → 'o4c o4d; o4e o4f; o4g o4a'
  function getChordsMmlFromInputText(inputText, prefixTrackType, centerCnoteNum, prefixAllType) {
    var arr = getPivotNoteNumbersFromInputText(inputText, centerCnoteNum);
    var mml = '';
    if (prefixAllType == 'PREFIX_ALL_1') {
      mml += prefixAllStr;
    }
    mml += getM();
    return mml;
    function getM() {
      var mml = '';
      angular.forEach(arr, function(trackNoteNumbers) {
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
    getChordsMmlFromInputText: getChordsMmlFromInputText
  };
}]);
