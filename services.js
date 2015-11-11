angular.module('generatorApp')
.service('GeneratorService', [
function() {

  function generate(inputText) {
    var mml = '';
    mml += ';';
    mml += inputText.replace(/C/g, 'c;e;g');
    return mml;
  }
  
  function getRootNoteType(inputText) {
    if (inputText.search(/Bb/) == 0) {
      return 10;
    }
    if (inputText.search(/C/) == 0) {
      return 0;
    }
    return -1;
  }

  return {
    generate: generate,
    getRootNoteType: getRootNoteType
  };
}]);
