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
    if (isEmpty(inputText)) txt = ''; // undefined → ''
    var ret = {r: -1, p: txt};
    if (txt.search(/Bb/) == 0) {
      ret.r = 10;
      ret.p = txt.replace(/Bb/, '');
      return ret;
    }
    if (txt.search(/C/) == 0) {
      ret.r = 0;
      ret.p = txt.replace(/C/, '');
      return ret;
    }
    return ret;
  }
  
  // [イメージ] '' → MAJOR, 'm' → MINOR
  var MAJOR = 'Major';
  var MINOR = 'Minor';
  function getChordType(parsedText) {
    var txt = parsedText;
    if (isEmpty(parsedText)) txt = ''; // undefined → ''
    var ret = {t: '', p: txt};
    if (txt == '') {
      ret.t = MAJOR;
      return ret;
    }
    if (txt == 'm') {
      ret.t = MINOR;
      return ret;
    }
  }

  // [イメージ] MAJOR → [0, 4, 7]
  function getChordIntervals(chordType) {
    if (chordType == MAJOR) return [0, 4, 7];
    if (chordType == MINOR) return [0, 3, 7];
    return [];
  }

  // [イメージ] 10, [0, 4, 7], 60 → [70, 74, 77]
  function getChordNoteNumbers(rootNoteType, intervals, centerCnoteNum) {
    var ret = [];
    angular.forEach(intervals, function(interval, key) {
      this[key] = centerCnoteNum + rootNoteType + interval;
    }, ret);
    return ret;
  }

  return {
    isEmpty: isEmpty,
    generate: generate,
    getRootNoteType: getRootNoteType,
    getChordType: getChordType,
    getChordIntervals: getChordIntervals,
    getChordNoteNumbers: getChordNoteNumbers
  };
}]);
