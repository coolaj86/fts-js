fts-js
======

A Full-Text Search implementation in JavaScript

* a list of all words used ever and a link to their indexes
* an index for each word with link to all documents and occurence info
* the actual document

Ranking Algorithm
-----------------

Here are things we might want to do:

  * weight based on global rarity of word ('programmer' is found least often of all search terms used)
  * weight based on local density of word ('programmer' is found many times in this document)
  * weight based on local rarity 
  * weight based on n-grams (fast forward soup -> [fast forward, fast soup, soup forward])
  * weight based on closeness
