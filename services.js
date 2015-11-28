angular.module('generatorApp')
.service('GeneratorService', [
function() {

  function isEmpty(v) {
    if (v === undefined || v === null || v === '') return true;
    return false;
  }

  function isNumberStr(x) {
    return !(Number(x) !== Number(x));
  }

  var prefixAllStr = '#OPM@0 { 5, 1,\n' +
    ' 26,  7,  9,  3, 10, 20,  1,  2,  2,  0,  0,' + '\n' +
    ' 24,  9,  9,  3, 15,  0,  2,  3,  3,  0,  0,' + '\n' +
    ' 22,  8,  6,  5, 12,  0,  1,  2,  5,  0,  0,' + '\n' +
    ' 20,  7, 11,  5, 14,  0,  0,  1,  4,  0,  0,' + '\n' +
    '};'
  ;
  var prefixAllArrStr = [
    '#OPM@0 { 6, 1, /*E.Piano*/\n' +
    ' 26,  7,  9,  3, 10, 23,  1,  5,  2,  0,  0,\n' +
    ' 24,  9,  9,  3, 15,  0,  2,  4,  3,  0,  1,\n' +
    ' 22,  8,  6,  5, 12,  0,  1,  3,  5,  0,  1,\n' +
    ' 20,  7, 11,  5, 14,  0,  0,  1,  4,  0,  1,\n' +
    '}t100 ma0,25,15,15;#EFFECT0{autopan};',
    '#OPM@0 { 5, 7, /*Brass*/\n' +
    ' 16,  7,  5,  4,  1, 20,  0,  1,  0,  0,  0,\n' +
    ' 10,  5,  3, 21,  1,  4,  1,  0,  5,  0,  0,\n' +
    ' 14,  4,  2, 20,  1,  0,  0,  1,  4,  0,  0,\n' +
    ' 15,  3,  4, 22,  1,  0,  0,  1,  5,  0,  0,\n' +
    '};',
    '#OPM@0 { 4, 7, /*Brass*/\n' +
    ' 16,  7,  5,  4,  1, 20,  0,  1,  3,  0,  0,\n' +
    ' 13,  5,  3, 21,  1,  0,  0,  1,  4,  0,  0,\n' +
    ' 14,  4,  2,  4,  1, 20,  0,  1,  5,  0,  0,\n' +
    ' 15,  3,  4, 22,  1,  0,  0,  1,  4,  0,  0,\n' +
    '};',
    '#OPM@0 { 4, 7, /*Brass slow*/\n' +
    '  8,  3,  5, 23,  1, 25,  0,  1,  3,  0,  0,\n' +
    ' 13,  5,  3, 23,  1,  0,  0,  1,  4,  0,  0,\n' +
    '  5,  4,  2, 23,  1, 20,  0,  1,  5,  0,  0,\n' +
    ' 15,  3,  4, 23,  1,  0,  0,  1,  4,  0,  0,\n' +
    '};'
  ];


  var prefixTrackStr = '%6 @0 l2 v8';

  function setPrefixAllStr(v) {
    prefixAllStr = v;
  }
  function getPrefixAllStr() {
    return prefixAllStr;
  }
  function getPrefixAllStrFromType(prefixAllType) {
    if (prefixAllType == 'PREFIX_ALL_1') return prefixAllStr;
    if (prefixAllType == 'PREFIX_ALL_2') return prefixAllArrStr[0];
    if (prefixAllType == 'PREFIX_ALL_3') return prefixAllArrStr[1];
    if (prefixAllType == 'PREFIX_ALL_4') return prefixAllArrStr[2];
    if (prefixAllType == 'PREFIX_ALL_5') return prefixAllArrStr[3];
    return '';
  }
  function setPrefixAllStrFromType(prefixAllType) {
    prefixAllStr = getPrefixAllStrFromType(prefixAllType);
  }

  // [イメージ] 'Cm' → 'c;e-;g'
  function generate(oneChordName, prefixTrackType, centerCnoteNum, prefixAllType) {
    var mml = '';
    mml += getPrefixAllStrFromType(prefixAllType);
    mml += getNoteMmlsFromOneChordName(oneChordName, prefixTrackType, centerCnoteNum);
    return mml;
  }

  function getNormalizedTxt(txt) {
    var ret = txt;
    ret = ret.replace(/[♯＃]/g, '#');
    ret = ret.replace(/♭/g, 'b');
    return ret;
  }

  // [イメージ] 'Bb' → {10, ''} 、 'Am' → {9, 'm'}
  function getRootNoteTypeFromOneChordName(oneChordName) {
    var txt = oneChordName;
    if (isEmpty(oneChordName)) txt = ''; // undefined → ''
    var ret = {r: -1, p: txt};
    txt = getNormalizedTxt(txt);
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
      if (txt.search(rgxp) === 0) {
        ret.r = r;
        ret.p = txt.replace(rgxp, '');
        return true;
      }
      return false;
    }
  }

  // [イメージ] 'F/A' → {9, ''} 、 'C/A' → {0, ''} [補足] 入出力フォーマットはgetRootNoteTypeFromOneChordNameに合わせる
  function getSlashChordBassNoteType(oneChordName) {
    var txt = oneChordName;
    if (isEmpty(txt)) txt = ''; // undefined → ''
    if (!isSlash(txt)) txt = ''; // slashなし
    var ret = {r: -1, p: txt};
    if (!isEmpty(txt)) {
      var arr = oneChordName.split('/');
      return getRootNoteTypeFromOneChordName(arr[arr.length - 1]);
    }
    return ret;
  }

  var CHORD_DEFINITIONS = [
    ['MAJOR', ['', 'maj'], [0, 4, 7]],
    ['SIXTH', ['6', 'maj6'], [0, 4, 7, 9]],
    ['MAJORADD9', ['2', 'add9'], [0, 4, 7, 14]],
    ['MAJOR7', ['M7', 'maj7'], [0, 4, 7, 11]],
    ['MAJOR9', ['M9', 'maj9'], [0, 4, 7, 11, 14]],
    ['MAJOR11', ['M11', 'maj11'], [0, 4, 7, 11, 14, 17]],
    ['MAJOR13', ['M13', 'maj13'], [0, 4, 7, 11, 14, 17, 21]],

    ['MINOR', ['m', '-', 'min'], [0, 3, 7]],
    ['MIN6', ['min6'], [0, 3, 7, 9]],
    ['MINADD9', ['madd9', 'm(9)', 'minadd9'], [0, 3, 7, 9, 14]],
    ['MINOR7', ['m7', 'min7'], [0, 3, 7, 10]],
    ['MINOR9', ['m9', 'min9'], [0, 3, 7, 10, 14]],
    ['MINOR11', ['m11', '-11', 'min11'], [0, 3, 7, 10, 14, 17]],
    ['MINOR13', ['m13', '-13', 'min13'], [0, 3, 7, 10, 14, 17, 21]],

    ['SEVENTH', ['7', 'dom7'], [0, 4, 7, 10]],
    ['SEVENTHADD13', ['7add13', '7(13)'], [0, 4, 7, 10, 21]],
    ['SEVENTHFLAT9', ['7-9', '7b9'], [0, 4, 7, 10, 13]],
    ['NINTH', ['9', 'dom9', '7add9', '7add2', '7/9'], [0, 4, 7, 10, 14]],
    ['ELEVENTH', ['11', 'dom11'], [0, 4, 7, 10, 14, 17]],
    ['THIRTEENTH', ['13', 'dom13'], [0, 4, 7, 10, 14, 17, 21]],

    ['SUS4', ['sus4'], [0, 5, 7]],
    ['SEVENTHSUS4', ['7sus4'], [0, 5, 7, 10]],
    ['NINTHSUS4', ['9sus4'], [0, 5, 7, 10, 14]],

    ['OMIT3', ['omit3', '5'], [0, 7]],

    ['MINMAJ7', ['mM7', 'm#7', 'm/M7', 'm(M7)', 'minmaj7', 'min/maj7', 'min(maj7)'], [0, 3, 7, 11]],
    ['MINMAJ9', ['mM9', '-M9', 'minmaj9'], [0, 3, 7, 11, 14]],
    ['MINMAJ11', ['mM11', '-M11', 'minmaj11'], [0, 3, 7, 11, 14, 17]],
    ['MINMAJ13', ['mM13', '-M13', 'minmaj13'], [0, 3, 7, 11, 14, 17, 21]],

    ['DIM', ['dim'], [0, 3, 6]],
    ['MINORFLAT5', ['mb5', 'm-5'], [0, 3, 6]], /* 構成音は同じだが意味合いが違うので分けたままにしておく（あとで連結するのは楽だがあとで分けるのは考慮が必要なので） */
    ['DIM7', ['dim7'], [0, 3, 6, 9]],
    ['DIM9', ['dim9'], [0, 3, 6, 9, 14]],
    ['DIM11', ['dim11'], [0, 3, 6, 9, 13, 16]],
    ['DIMMIN9', ['dimb9'], [0, 3, 6, 9, 13]],

    ['MIN7DIM5', ['min7dim5'], [0, 3, 6, 10]],

    ['SEVENTHFLAT5', ['7b5', '7-5', 'dom7dim5'], [0, 4, 6, 10]],

    ['AUG', ['+', 'aug'], [0, 4, 8]],
    ['AUG7', ['+7', 'aug7'], [0, 4, 8, 10]],
    ['AUG9', ['+9', '9#5', 'aug9'], [0, 4, 8, 10, 14]],
    ['AUG11', ['+11', '11#5', 'aug11'], [0, 4, 8, 10, 14, 17]],
    ['AUG13', ['+13', '13#5', 'aug13'], [0, 4, 8, 10, 14, 17, 21]],
    ['AUGMAJ7', ['+M7', 'augmaj7'], [0, 4, 8, 11]],
    ['AUGMAJ9', ['+M9', 'augmaj9'], [0, 4, 8, 11, 14]],
    ['AUGMAJ11', ['+M11', 'augmaj11'], [0, 4, 8, 11, 14, 17]],
    ['AUGMAJ13', ['+M13', 'augmaj13'], [0, 4, 8, 11, 14, 17, 21]],

    null
  ];

  var CHORD_OBJS = [];
  // [イメージ] {symbol: 'maj', type:'MAJOR', notes:[0, 4, 7]},
  //            {symbol: '', type:'MAJOR', notes:[0, 4, 7]} // symbolの文字列長で降順ソートしておく
  (function() {
    // 定義をメンテしやすいCHORD_DEFINITIONSから、処理をメンテしやすいCHORD_OBJSを生成
    angular.forEach(CHORD_DEFINITIONS, function(def) {
      if (!def) return; // forEachを1つ進める
      var type = def[0];
      var symbols = def[1];
      var notes = def[2];
      angular.forEach(symbols, function(symbol) {
        CHORD_OBJS.push({"symbol": symbol, "type": type, "notes": notes});
      });
    });
    // symbolの文字列長で降順ソート
    CHORD_OBJS.sort(function(a, b) {
      return - (a.symbol.length - b.symbol.length);
    });
  })();

  // [イメージ] '' → 'MAJOR'
  function getChordType(parsedText) {
    var txt = parsedText;
    if (isEmpty(parsedText)) txt = ''; // undefined → ''
    var ret = {t: '', p: txt};
    if (txt.indexOf('/') != -1) txt = txt.split('/')[0]; // 分数コードは一旦無視（仮実装、あとで変更予定）
    txt = getNormalizedTxt(txt);
    var i;
    for (i = 0; i < CHORD_OBJS.length; i++) {
      var obj = CHORD_OBJS[i];
      if (obj.symbol == txt) {
        ret.t = obj.type;
        return ret;
      }
    }
    return ret;
  }

  function getChordTypeFromOneChordName(oneChordName) {
    var parsedText = getRootNoteTypeFromOneChordName(oneChordName).p;
    return getChordType(parsedText);
  }


  // [イメージ] MAJOR → [0, 4, 7]
  function getChordIntervals(t) {
    var i;
    for (i = 0; i < CHORD_OBJS.length; i++) {
      var obj = CHORD_OBJS[i];
      if (obj.type == t) {
        return obj.notes;
      }
    }
    return [];
  }

  function getChordIntervalsFromOneChordName(oneChordName) {
    var t = getChordTypeFromOneChordName(oneChordName).t;
    return getChordIntervals(t);
  }


  // [イメージ] 10, [0, 4, 7], 60 → [70, 74, 77]
  function getChordNoteNumbers(rootNoteType, intervals, centerCnoteNum) {
    var ret = [];
    if (!isNumberStr(centerCnoteNum)) return ret;
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
  }

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
  }


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
  }

  // [イメージ] 'C D' → ['C','D']
  function getChordNames(inputText) {
    if (isEmpty(inputText)) return [];
    var txt = inputText;
    txt = txt.replace(/\-([A-G])/g, ' $1'); // [イメージ] 'Dm-Em' → 'Dm Em'
    txt = txt.replace(/ - |->|→|>/g, ' ');
    txt = txt.replace(/\{|\}/g, ' '); // ニコニコ大百科のコード進行の記事で使っている、1小節内の複数のコード進行をグルーピングするための表記
    txt = txt.replace(/\s+/g, ' '); // 連続spaceをspace1つへ
    txt = txt.replace(/^\s|\s$/g, ''); // 先頭と末尾のspaceを削除
    var chordNames = txt.split(' ');
    return chordNames;
  }

  // [イメージ] ['C', 'Dm'] → [ [60,64,67], [62,65,69] ]
  function getNoteNumbersListFromChordNames(chordNames, centerCnoteNum) {
    var noteNumbersList = [];
    var chordNoteNumbers;
    angular.forEach(chordNames, function(oneChordName) {
      chordNoteNumbers = getChordNoteNumbersFromOneChordName(oneChordName, centerCnoteNum);
      if (chordNoteNumbers.length) noteNumbersList.push(chordNoteNumbers);
    });
    return noteNumbersList;
  }

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

  function getChordsMml(/*pivotedNoteNumbersList as */pivoted, prefixTrackType, prefixAllType, delay) {
    if (!pivoted.length) return [];
    var mml = '';
    mml += getPrefixAllStrFromType(prefixAllType);
    mml += getM();
    return mml;
    function getM() {
      var mml = '';
      var delayMml = '';
      angular.forEach(pivoted, function(trackNoteNumbers) {
        if (mml) mml += ';';
        if (prefixTrackType == 'PREFIX_TRACK_1') {
          mml += prefixTrackStr;
        }
        mml += delayMml;
        delayMml += delay; // trackごとに増えてゆく
        angular.forEach(trackNoteNumbers, function(noteNumber) {
          if (isEmpty(noteNumber)) {
            mml += 'r';
            return; // forEachを1つ進める
          }
          mml += getNoteMml(noteNumber);
        });
      });
      return mml;
    }
  }

  // [イメージ] 'C Dm' → 'o4c o4d; o4e o4f; o4g o4a'
  function getChordsMmlFromInputText(inputText, prefixTrackType, centerCnoteNum, prefixAllType, delay) {
    if (isEmpty(inputText)) return '';
    var pivoted = getPivotNoteNumbersFromInputText(inputText, centerCnoteNum);
    return getChordsMml(pivoted, prefixTrackType, prefixAllType, delay);
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
    if (!isNumberStr(maxTopNoteNum)) return [];
    if (!noteNumbersList.length) return [];
    angular.forEach(noteNumbersList, function(noteNumbers, key) {
      this[key] = getInventionNoteNumber(noteNumbers, maxTopNoteNum);
    });
    return noteNumbersList;
  }
  function getInventionNoteNumber(noteNumbers, maxTopNoteNum) {
    if (!noteNumbers.length) return [];
    var i;
    var topNote;
    for (i = 0; i < 128; i++) {
      topNote = noteNumbers[noteNumbers.length - 1];
      if (topNote >= Number(maxTopNoteNum)) break;
      inventionNoteNumbersUp(noteNumbers);
    }
    for (i = 0; i < 128; i++) {
      topNote = noteNumbers[noteNumbers.length - 1];
      if (topNote <= Number(maxTopNoteNum)) break;
      inventionNoteNumbersDown(noteNumbers);
    }
   // トップノートとセカンドノートが半音差の場合は、そうならないよう、トップノートを下げる転回を行う
    if (noteNumbers.length <= 2) return noteNumbers;
    for (i = 0; i < 128; i++) {
      topNote = noteNumbers[noteNumbers.length - 1];
      var secondNote = noteNumbers[noteNumbers.length - 2];
      if (topNote - secondNote != 1) return noteNumbers;
      inventionNoteNumbersDown(noteNumbers);
    }
    return noteNumbers;
  }

  // [イメージ] 'C' → '[[60, 64, 67]]' → '[[60+12, 64, 67]] → '[[64, 67, 60+12]]
  function getInventionNoteNumbersFromInputText(inputText, centerCnoteNum, maxTopNoteNum) {
    if (isEmpty(inputText)) return [];
    var noteNumbersList = getNoteNumbersListFromInputText(inputText, centerCnoteNum);
    return getInventionNoteNumbers(noteNumbersList, maxTopNoteNum);
  }

  function isSlash(chordName) {
    if (chordName.indexOf('/') == -1) return false; // slashなし
    return true;
  }

  // noteNumbersにbassをつけたうえでsortもする
  // [補足] 転回の後に追加すること
  function getAddedBassFromOneChordName(chordName, noteNumbers, centerCnoteNum, maxbassNoteNum) {
    if (!isNumberStr(maxbassNoteNum)) return [];
    if (!noteNumbers.length) return [];
    var bass;
    if (isSlash(chordName)) {
      bass = getOnChordBass(chordName);
    } else {
      bass = getNormalBass(chordName);
    }
    if (isEmpty(bass)) return [];
    noteNumbers.push(bass);
    noteNumbers.sort(function(a, b) {
      return a - b; // 数値ソート
    });
    return noteNumbers;
    function getNormalBass(chordName) {
      var bassNoteType = getRootNoteTypeFromOneChordName(chordName).r;
      return getBass(bassNoteType);
    }
    function getOnChordBass(chordName) {
      var bassNoteType = getSlashChordBassNoteType(chordName).r;
      return getBass(bassNoteType);
    }
    function getBass(bassNoteType) {
      if (isEmpty(bassNoteType) || bassNoteType == -1) return null;
      var bass = bassNoteType + Number(centerCnoteNum);
      bass = getAdjustedBass(bass);
      return bass;
    }
    function getAdjustedBass(bass) {
      var i;
      for (i = 0; i < 128; i++) {
        if (bass >= Number(maxbassNoteNum)) break;
        bass += 12;
      }
      for (i = 0; i < 128; i++) {
        if (bass <= Number(maxbassNoteNum)) break;
        bass -= 12;
      }
      return bass;
    }
  }

  function getInventionMmlFromInputText(inputText, prefixTrackType, centerCnoteNum, prefixAllType, maxTopNoteNum, maxbassNoteNum, delay) {
    if (isEmpty(inputText)) return '';
    var chordNames = getChordNames(inputText);
    if (!isNumberStr(maxTopNoteNum)) return '';
    if (isEmpty(chordNames)) return '';
    var noteNumbersList = [];
    var i;
    for (i = 0; i < chordNames.length; i++) {
      var chordName = chordNames[i];
      var noteNumbers = getChordNoteNumbersFromOneChordName(chordName, centerCnoteNum);
      noteNumbers = getInventionNoteNumber(noteNumbers, maxTopNoteNum);
      noteNumbers = getAddedBassFromOneChordName(chordName, noteNumbers, centerCnoteNum, maxbassNoteNum);
      noteNumbersList.push(noteNumbers);
    }
    var pivoted = getPivotNoteNumbers(noteNumbersList);
    return getChordsMml(pivoted, prefixTrackType, prefixAllType, delay);
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
    getPrefixAllStr: getPrefixAllStr,
    setPrefixAllStrFromType: setPrefixAllStrFromType
  };
}]);
