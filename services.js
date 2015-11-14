angular.module('generatorApp')
.service('GeneratorService', [
function() {

  function isEmpty(v) {
    if (v === undefined || v === null || v === '') return true;
    return false;
  }

  function generate(inputText) {
    if (isEmpty(inputText)) return '';
    var mml = '';
    mml += ';';
    mml += inputText.replace(/C/g, 'c;e;g');
    return mml;
  }
  
  // [イメージ] 'Bb' → 10, ''
  function getRootNoteType(inputText) {
    var ret = {r: -1, p: inputText};
    if (isEmpty(inputText)) return ret;
    if (inputText.search(/Bb/) == 0) {
      ret.r = 10;
      ret.p = inputText.replace(/Bb/, '');
      return ret;
    }
    if (inputText.search(/C/) == 0) {
      ret.r = 0;
      ret.p = inputText.replace(/C/, '');
      return ret;
    }
    return ret;
  }
  
  // [イメージ] '' → MAJOR, 'm' → MINOR
  var MAJOR = 'Major';
  var MINOR = 'Minor';
  function getChordType(parsedText) {
    var ret = {t: '', p: parsedText};
    if (isEmpty(parsedText)) return ret;
    if (parsedText == '') {
      ret.t = MAJOR;
      return ret;
    }
    if (parsedText == 'm') {
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
