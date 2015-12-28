angular.module('generatorApp')
.service('GeneratorService', [
function() {
  var CHORD_DEFINITIONS = [
    ['MAJOR', ['', 'maj'], [0, 4, 7]],
    ['MAJORADD9', ['2', 'add9'], [0, 4, 7, 14]],
    ['MAJOR7', ['M7', 'maj7'], [0, 4, 7, 11]],
    ['MAJOR9', ['M9', 'maj9'], [0, 4, 7, 11, 14]],
    ['MAJOR11', ['M11', 'maj11'], [0, 4, 7, 11, 14, 17]],
    ['MAJOR13', ['M13', 'maj13'], [0, 4, 7, 11, 14, 17, 21]],

    ['SIXTH', ['6', 'maj6'], [0, 4, 7, 9]],
    ['SIXTH9', ['69', 'maj69'], [0, 4, 7, 9, 14]],

    ['MINOR', ['m', '-', 'min'], [0, 3, 7]],
    ['MINADD9', ['madd9', 'm(9)', 'minadd9'], [0, 3, 7, 14]],
    ['MINOR7', ['m7', 'min7'], [0, 3, 7, 10]],
    ['MINOR7ADD11', ['m7(11)', 'min7add11'], [0, 3, 7, 10, 17]],
    ['MINOR9', ['m9', 'min9'], [0, 3, 7, 10, 14]],
    ['MINOR11', ['m11', '-11', 'min11'], [0, 3, 7, 10, 14, 17]],
    ['MINOR13', ['m13', '-13', 'min13'], [0, 3, 7, 10, 14, 17, 21]],

    ['MIN6', ['m6', 'min6'], [0, 3, 7, 9]],
    ['MIN69', ['m69', 'min69'], [0, 3, 7, 9, 14]],

    ['SEVENTH', ['7', 'dom7'], [0, 4, 7, 10]],
    ['SEVENTHADD13', ['7add13', '7(13)'], [0, 4, 7, 10, 21]],
    ['SEVENTHFLAT9', ['-9', '7-9', '7b9'], [0, 4, 7, 10, 13]],
    ['NINTH', ['9', 'dom9', '7add9', '7add2', '7/9'], [0, 4, 7, 10, 14]],
    ['SEVENTHAUG9', ['7+9'], [0, 4, 7, 10, 15]],
    ['SEVENTHAUG9', ['7+11'], [0, 4, 7, 10, 18]],
    ['SEVENTHMAJ13', ['7+13'], [0, 4, 10, 21]],
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
    ['MIN7DIM5', ['m7b5', 'm7-5', 'min7dim5'], [0, 3, 6, 10]],
    ['DIM9', ['dim9'], [0, 3, 6, 9, 14]],
    ['DIM11', ['dim11'], [0, 3, 6, 9, 13, 16]],
    ['DIMMIN9', ['dimb9', 'dim7b9'], [0, 3, 6, 9, 13]],
    ['MIN7FLAT5FLAT9', ['m7b5b9', 'm7(b5b9)', 'min7b5b9', 'min7(b5b9)'], [0, 3, 6, 9, 13]],

    ['FLAT5', ['b5', '-5'], [0, 4, 6]],
    ['SEVENTHFLAT5', ['7b5', '7-5', 'dom7dim5'], [0, 4, 6, 10]],
    ['NINTHFLAT5', ['9-5'], [0, 4, 6, 10, 14]],

    ['AUG', ['+', 'aug'], [0, 4, 8]],
    ['AUG7', ['+7', 'aug7'], [0, 4, 8, 10]],
    ['SEVENTHFLAT9AUG5', ['-9+5'], [0, 4, 8, 10, 13]],
    ['AUG9', ['+9', '9#5', 'aug9'], [0, 4, 8, 10, 14]],
    ['AUG11', ['+11', '11#5', 'aug11'], [0, 4, 8, 10, 14, 17]],
    ['AUG13', ['+13', '13#5', 'aug13'], [0, 4, 8, 10, 14, 17, 21]],
    ['AUGMAJ7', ['+M7', 'augM7', 'augmaj7'], [0, 4, 8, 11]],
    ['AUGMAJ9', ['+M9', 'augmaj9'], [0, 4, 8, 11, 14]],
    ['AUGMAJ11', ['+M11', 'augmaj11'], [0, 4, 8, 11, 14, 17]],
    ['AUGMAJ13', ['+M13', 'augmaj13'], [0, 4, 8, 11, 14, 17, 21]],

    ['MAJORADD4', ['add4'], [0, 4, 5, 7]],

    null
  ];

  function isEmpty(v) {
    if (v === undefined || v === null || v === '') return true;
    return false;
  }

  function isNumberStr(x) {
    if (Number(x) !== Number(x)) return false;
    return true;
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


  var prefixTrackStr = '%6 @0 l2 ';

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
  function getOnChordBassNoteType(oneChordName) {
    var txt = oneChordName;
    if (isEmpty(txt)) txt = ''; // undefined → ''
    if (!isOnChord(txt)) txt = ''; // オンコードなし
    var ret = {r: -1, p: txt};
    if (!isEmpty(txt)) {
      var arr = oneChordName.split('on'); // [前提] F/A をFonAに置換済みであること。オンコードモード固定であること。
      return getRootNoteTypeFromOneChordName(arr[arr.length - 1]);
    }
    return ret;
  }

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
    if (isOnChord(txt)) txt = txt.split('on')[0]; // オンコードのベースノートはここでは取り除いて扱う（別途扱うので）
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
    txt = txt.replace(/ on ([A-G])/g, 'on$1'); // オンコード表記の正規化
    txt = txt.replace(/(?:\/| \/ )([A-G])/g, 'on$1'); // slashはオンコードモード時はオンコードとみなす（現在オンコードモード固定）
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
        mml += volume();
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
    function volume() {
      var l = pivoted.length;
      if (l <= 3) { return 'v8'; }  // [例] C5 + bass (3poly)
      if (l <= 4) { return 'v8'; }
      if (l <= 5) { return 'v8'; }
      if (l <= 6) { return 'v7'; }  // [例] C9 + bass (6poly)
      if (l <= 7) { return 'v7'; }
      return 'v7';  // [例] C13 + bass (8poly)
    }
  }

  // [イメージ] 'C Dm' → 'o4c o4d; o4e o4f; o4g o4a'
  function getChordsMmlFromInputText(inputText, prefixTrackType, centerCnoteNum, prefixAllType, delay) {
    if (isEmpty(inputText)) return '';
    var pivoted = getPivotNoteNumbersFromInputText(inputText, centerCnoteNum);
    return getChordsMml(pivoted, prefixTrackType, prefixAllType, delay);
  }
  // [イメージ] [60, 64, 67] → [72, 64, 67] → [64, 67, 72]
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
      this[key] = getInventionNoteNumber(noteNumbers, maxTopNoteNum, 'CLOSE');
    });
    return noteNumbersList;
  }
  // トップノートがmaxTopNoteNum以下となるよう転回する
  function getInventionNoteNumber(noteNumbers, maxTopNoteNum, voicingType) {
    if (!noteNumbers.length) return [];
    var i;
    var topNote;
    for (i = 0; i < noteNumbers.length; i++) {
      inventionNoteNumbersUp(noteNumbers);
    }
    for (i = 0; i < noteNumbers.length; i++) { // [例] o4ceg o5d → o4cdeg
      inventionNoteNumbersDown(noteNumbers);
    }
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
    drop();
    // トップノートとセカンドノートが半音差の場合は、そうならないよう、トップノートを下げる転回を行う
    // [前提] Drop 2等の後に行う。[理由] Drop 2を行うことで、トップノートとセカンドノートの半音差問題に対応できることがある
    if (noteNumbers.length <= 2) return noteNumbers;
    for (i = 0; i < 128; i++) {
      topNote = noteNumbers[noteNumbers.length - 1];
      var secondNote = noteNumbers[noteNumbers.length - 2];
      if (topNote - secondNote != 1) return noteNumbers;
      inventionNoteNumbersDown(noteNumbers);
    }
    return noteNumbers;
    function drop() {
      if (voicingType == 'DROP2') {
        if (noteNumbers.length < 2) return;
        noteNumbers[noteNumbers.length - 2] -= 12;
        noteNumbers.sort(function(a, b) {
          return a - b; // 数値ソート
        });
      } else if (voicingType == 'DROP3') {
        if (noteNumbers.length < 3) return;
        noteNumbers[noteNumbers.length - 3] -= 12;
        noteNumbers.sort(function(a, b) {
          return a - b; // 数値ソート
        });
      } else if (voicingType == 'DROP24') {
        if (noteNumbers.length < 4) return;
        noteNumbers[noteNumbers.length - 2] -= 12;
        noteNumbers[noteNumbers.length - 4] -= 12;
        noteNumbers.sort(function(a, b) {
          return a - b; // 数値ソート
        });
      }
    }
  }

  // [イメージ] 'C' → '[[60, 64, 67]]' → '[[60+12, 64, 67]] → '[[64, 67, 60+12]]
  function getInventionNoteNumbersFromInputText(inputText, centerCnoteNum, maxTopNoteNum) {
    if (isEmpty(inputText)) return [];
    var noteNumbersList = getNoteNumbersListFromInputText(inputText, centerCnoteNum);
    return getInventionNoteNumbers(noteNumbersList, maxTopNoteNum);
  }

  function isOnChord(chordName) {
    if (chordName.indexOf('on') == -1) return false; // 非オンコード
    return true;
  }

  // noteNumbersにbassをつけたうえでsortもする
  // [補足] 転回の後に追加すること
  function getAddedBassFromOneChordName(chordName, noteNumbers, centerCnoteNum, maxbassNoteNum) {
    if (!isNumberStr(maxbassNoteNum)) return [];
    if (!noteNumbers.length) return [];
    var bass;
    if (isOnChord(chordName)) {
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
      var bassNoteType = getOnChordBassNoteType(chordName).r;
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

  function getInventionMmlFromInputText(inputText, prefixTrackType, centerCnoteNum, prefixAllType, maxTopNoteNums, maxbassNoteNum, delay, voicingType) {
    if (isEmpty(inputText)) return '';
    var chordNames = getChordNames(inputText);
    if (isEmpty(chordNames)) return '';
    var noteNumbersList = [];
    var i;
    for (i = 0; i < chordNames.length; i++) {
      var chordName = chordNames[i];
      var noteNumbers = getChordNoteNumbersFromOneChordName(chordName, centerCnoteNum);
      var maxTopNoteNum = maxTopNoteNums[i].maxTopNoteNum;
      if (!isNumberStr(maxTopNoteNum)) return '';
      noteNumbers = getInventionNoteNumber(noteNumbers, maxTopNoteNum, voicingType);
      noteNumbers = getAddedBassFromOneChordName(chordName, noteNumbers, centerCnoteNum, maxbassNoteNum);
      noteNumbersList.push(noteNumbers);
    }
    var pivoted = getPivotNoteNumbers(noteNumbersList);
    return getChordsMml(pivoted, prefixTrackType, prefixAllType, delay);
  }

  function getInputTextFromInputNumbers(inputNumbers, chordKeyOffset, inputNumbersType) {
    inputNumbers = getNormalized(inputNumbers); // [イメージ] 'III - VI' → '3 6'
    chordKeyOffset = Number(chordKeyOffset);
    var arr = inputNumbers.split(" ");
    if (isEmpty(arr)) return "";
    var inputText = "";
    angular.forEach(arr, function(v) {
      if (!isEmpty(inputText)) inputText += " ";
      inputText += getChordName(v);
    });
    return inputText;
    function getChordName(degree) {
      var semitone = getSemitoneFromDegree(degree);
      if (semitone === undefined) return "";
      semitone += chordKeyOffset;
      return getRootFromSemitone(semitone) + getChordTypeFromDegree(degree);
      function getRootFromSemitone(s) {
        s = ((s % 12) + 12) % 12;
        return ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][s];
      }
      function getChordTypeFromDegree(d) {
        if (inputNumbersType == "TRIAD") {
          if (d == "1") return "";
          if (d == "2") return "m";
          if (d == "3") return "m";
          if (d == "4") return "";
          if (d == "5") return "";
          if (d == "6") return "m";
          if (d == "7") return "mb5";
        } else if (inputNumbersType == "SEVENTH") {
          if (d == "1") return "M7";
          if (d == "2") return "m7";
          if (d == "3") return "m7";
          if (d == "4") return "M7";
          if (d == "5") return "7";
          if (d == "6") return "m7";
          if (d == "7") return "m7b5";
        } else if (inputNumbersType == "NINTH") {
          if (d == "1") return "M9";
          if (d == "2") return "m9";
          if (d == "3") return "m9";
          if (d == "4") return "M9";
          if (d == "5") return "9";
          if (d == "6") return "m9";
          if (d == "7") return "m7b5b9";
        }
        return "";
      }
    }
    function getSemitoneFromDegree(d) {
      if (d == 1) return 0;
      if (d == 2) return 2;
      if (d == 3) return 4;
      if (d == 4) return 5;
      if (d == 5) return 7;
      if (d == 6) return 9;
      if (d == 7) return 11;
      return undefined;
    }
    function getNormalized(v) {
      // III は II より前に置換
      v = v.replace(/III/g, '3');
      v = v.replace(/VII/g, '7');
      // II は I より前に置換
      v = v.replace(/II/g, '2');
      v = v.replace(/IV/g, '4');
      v = v.replace(/VI/g, '6');
      // 1文字
      v = v.replace(/I/g, '1');
      v = v.replace(/V/g, '5');
      v = v.replace(/Ⅲ/g, '3');
      v = v.replace(/Ⅶ/g, '7');
      v = v.replace(/Ⅱ/g, '2');
      v = v.replace(/Ⅳ/g, '4');
      v = v.replace(/Ⅵ/g, '6');
      v = v.replace(/Ⅰ/g, '1');
      v = v.replace(/Ⅴ/g, '5');
      // 数字化のあとに置換
      v = v.replace(/\-([1-7])/g, ' $1'); // [イメージ] '3-6' → '3 6'
      v = v.replace(/ - |->|→|>/g, ' ');
      v = v.replace(/\s+/g, ' '); // 連続spaceをspace1つへ
      v = v.replace(/^\s|\s$/g, ''); // 先頭と末尾のspaceを削除
      return v;
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
    getChordsMmlFromInputText: getChordsMmlFromInputText,
    getInventionNoteNumbersFromInputText: getInventionNoteNumbersFromInputText,
    getInventionMmlFromInputText: getInventionMmlFromInputText,
    setPrefixAllStr: setPrefixAllStr,
    getPrefixAllStr: getPrefixAllStr,
    setPrefixAllStrFromType: setPrefixAllStrFromType,
    getInputTextFromInputNumbers: getInputTextFromInputNumbers
  };
}]);
