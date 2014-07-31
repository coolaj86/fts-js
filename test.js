(function () {
  'use strict';

  var fs = require('fs')
    , path = require('path')
    , docpath = 'docs'
    , pages = []
    , fts
    ;

  fs.readdirSync(docpath).forEach(function (node) {
    if (/^\./.test(node)) {
      return;
    }
    pages.push(fs.readFileSync(path.join(docpath, node), 'utf8'));
  });

  fts = require('./fts').create();
  pages.forEach(function (page) {
    fts.parse(page);
  });
}());
