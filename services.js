angular.module('generatorApp')
.service('GeneratorService', [
function() {

  function generate(inputText) {
    var mml = '';
    mml += ';';
    mml += inputText.replace(/C/g, 'c;e;g');
    return mml;
  }
  
  // [イメージ] 'Bb' → 10, ''
  function getRootNoteType(inputText) {
    var ret = {r: -1, p: inputText};
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
  }

  // [イメージ] 10, [0, 4, 7], 60 → [70, 74, 77]
  function getChordNoteNumbers(rootNoteType, intervals, centerCnoteNum) {
    var ret = angular.copy(intervals);
    angular.forEach(ret, function(value, key) {
      this[key] += rootNoteType;
      this[key] += centerCnoteNum;
    });
    return ret;
  }

  return {
    generate: generate,
    getRootNoteType: getRootNoteType,
    getChordType: getChordType,
    getChordIntervals: getChordIntervals,
    getChordNoteNumbers: getChordNoteNumbers
  };
}]);
