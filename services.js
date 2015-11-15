angular.module('generatorApp')
.service('GeneratorService', [
function() {

  function isEmpty(v) {
    if (v === undefined || v === null || v === '') return true;
    return false;
  }

  function generate(inputText) {
    var mml = '';
    // TODO [イメージ] 'Cm' → 'c; e-; g'
    return mml;
  }
  
  // [イメージ] 'Bb' → 10, ''
  function getRootNoteType(inputText) {
    var txt = inputText;
    txt = txt.replace(/[♯＃]/g, '#');
    txt = txt.replace(/♭/g, 'b');
    if (isEmpty(inputText)) txt = ''; // undefined → ''
    var ret = {r: -1, p: txt};
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

  // [イメージ] MAJOR → [0, 4, 7]
  function getChordIntervals(chordType) {
    if (chordType == MAJOR) return [0, 4, 7];
    if (chordType == MINOR) return [0, 3, 7];
    if (chordType == SEVENTH) return [0, 4, 7, 10];
    if (chordType == SUS4) return [0, 5, 7];
    if (chordType == MAJOR7) return [0, 4, 7, 11];
    if (chordType == MINOR7) return [0, 3, 7, 10];
    if (chordType == SIXTH) return [0, 4, 7, 9];
    return [];
  }

  // [イメージ] 10, [0, 4, 7], 60 → [70, 74, 77]
  function getChordNoteNumbers(rootNoteType, intervals, centerCnoteNum) {
    var ret = [];
    if (rootNoteType < 0 || rootNoteType > 11) return ret; // 0～11 のみ許可
    angular.forEach(intervals, function(interval, key) {
      this[key] = centerCnoteNum + rootNoteType + interval;
    }, ret);
    return ret;
  }

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

  function getNoteMmls(noteNumbers) {
    if (!noteNumbers.length) return '';
    var mml = '';
    angular.forEach(noteNumbers, function(noteNumber) {
      if (mml) mml += ';';
      mml += getNoteMml(noteNumber);
    });
    return mml;
  }

  return {
    isEmpty: isEmpty,
    generate: generate,
    getRootNoteType: getRootNoteType,
    getChordType: getChordType,
    getChordIntervals: getChordIntervals,
    getChordNoteNumbers: getChordNoteNumbers,
    getNoteMml: getNoteMml,
    getNoteMmls: getNoteMmls
  };
}]);
