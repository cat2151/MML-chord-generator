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
      return 0;
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

  return {
    generate: generate,
    getRootNoteType: getRootNoteType,
    getChordType: getChordType
  };
}]);
