/*jshint -W054 */
(function (exports) {
  'use strict';

  var _p
    , _ = require('lodash')
    , Promise = require('bluebird').Promise
    , _d
    , path = require('path')
    , fs = require('fs')
    ;

  function Dict(opts) {
    var me = this
      ;

    this._todo = opts;
    this._filepath = path.join(__dirname, 'dictionary.json');
    try {
      this._dict = require(me._filepath);
    } catch(e) {
      this._dict = {};
    }
  }
  _d = Dict.prototype;
  _d.get = function (word) {
    var me = this
      ;

    me._dict[word] = me._dict[word] || { info: {}, length: 0 };
    return Promise.resolve(me._dict[word]);
  };
  _d.mget = function (words) {
    var me = this
      , ps = []
      ;

    words.forEach(function (w) {
      ps.push(me.get(w));
    });

    return Promise.all(ps);
  };
  _d.search = function (re) {
    var me = this
      , words = []
      ;

    // still pretty dang fast
    Object.keys(me._dict).forEach(function (k) {
      console.log('k');
      console.log(k);
      if (re.test(k)) {
        console.log(k);
        words.push(k);
      }
    });

    return words;
  };
  _d.put = function (word, docId, indices) {
    var me = this
      ;

    return me.get(word).then(function (data) {
      data.info[docId] = data.info[docId] || {};
      data.info[docId].indices = indices;
      data.length = data.length || 0;
      data.length += indices.length;
      // slightly better suck impl: setTimeout
      fs.writeFileSync(me._filepath, JSON.stringify(me._dict, null, '  '), 'utf8');
    });
  };
  //mput
  //del
  //mdel

  function FTS(opts) {
    opts = opts || opts;
    var me = this
      ;

    if (!(me instanceof FTS)) {
      return new FTS(opts);
    }

    me._dict = new Dict();
  }
  FTS.create = FTS.FTS = FTS;
  _p = FTS.prototype;

  _p.parse = function (page) {
    var me = this
      , words = page
        .toLowerCase()
        .replace(/'/, '')
        .replace(/[^a-z]/g, ' ')
        .split(/\s+/g)
      , wordsMap = {}
      , list = _
        .unique(words)
        .filter(function (w) {
          return w;
        })
        .sort(function (a, b) { return b.length - a.length; })
      , ps = []
      ;

    words.forEach(function (word, i) {
      wordsMap[word] = wordsMap[word] || [];
      wordsMap[word].push(i);
    });

    words.forEach(function (word) {
      ps.push(me._dict.put(word, 'dclr', wordsMap[word]));
    });

    console.log(Object.keys(wordsMap).map(function (k) { return { word: k, length: wordsMap[k].length }; }).sort(function (a, b) { return a.length - b.length; }));
    console.log(list.length);

    Promise.all(ps).then(function () {
      var terms = me._dict.search(/declar/)
        ;

      console.log(terms);
      me._dict.mget(terms).then(function (thingies) {
        console.log('thingies');
        console.log(JSON.stringify(thingies));
      });
    });
  };

  exports.FTS = FTS;
  if ('undefined' !== typeof module) { module.exports = FTS; }
}('undefined' !== typeof exports && exports || new Function('return this')()));
