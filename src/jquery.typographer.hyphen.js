/**
 * jQuery Typographer
 * Copyright (C) 2011 by mirz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function($, window, document, undefined) {
    'use strict';

    var plugin = {
        ns: 'typographer',
        name: 'hyphen'
    };
    plugin.fullName = plugin.ns + '_' + plugin.name;

    function Hyphenator(context, options) {
        this.context = context;
        this.$context = $(context);
        this.options = $.extend({}, $.fn[plugin.fullName].defaults, options);

        this.init();
    }

    Hyphenator.prototype.init = function() {
        this.options.ignoreTags = Utils.normalizeTagNames(this.options.ignoreTags);
        this.$context.addClass(this.options.contextClass);

        Hyphenator.trie = Hyphenator.trie || [];
        if (!Hyphenator.trie[this.options.lang]) {
            this.rebuildTrie(this.options.lang);
        }

        this.execute();
    };

    Hyphenator.prototype.execute = function() {
        var textNodes = Utils.getTextNodesIn(this.context, false);
        var self = this;

        $.each(textNodes, function() {
            if (Utils.shouldIgnore(this, self.context, self.options)) {
                return true;
            }

            var text = this.nodeValue;
            this.nodeValue = self.hyphenate(text);
        });
    };

    Hyphenator.prototype.splitWord = function(word) {
        return Hyphenator.splitWord(word, this.options);
    };

    Hyphenator.prototype.hyphenate = function(text) {
        return Hyphenator.hyphenate(text, this.options);
    };

    Hyphenator.prototype.rebuildTrie = function(lang) {
        var patterns = getPatterns(lang);
        if (patterns) {
            Hyphenator.trie[lang] = buildTrie(patterns);
        } else {
            $.error('Hyphenation patterns for language "' + lang + '" are undefined');
        }
    };

    Hyphenator.splitWord = function(word, options) {
        options = $.extend({}, $.fn[plugin.fullName].defaults, options);

        if (word.length < options.minWordLength) {
            return [word];
        }
        if ($.fn.typographer_hyphen.patterns.exceptions[options.lang][word]) {
            return $.fn.typographer_hyphen.patterns.exceptions[options.lang][word];
        }

        var points = computeHyphenationPoints(Hyphenator.trie[options.lang], word);
        for (var i = 0; i <= options.minLeft; i++) {
            points[i] = 0;
        }
        for (var j = 1, len = points.length; j <= options.minRight; j++) {
            points[len - j] = 0;
        }

        var pieces = [];
        var piece = '';
        var letters = word.split('');
        for (var k = 0; k < word.length; k++) {
            var ch = letters[k];
            var point = points[k + 2];

            piece += ch;
            if (point % 2 == 1) {
                pieces.push(piece);
                piece = '';
            }
        }
        pieces.push(piece);

        return pieces;
    };

    Hyphenator.hyphenate = function(text, options) {
        options = $.extend({}, $.fn[plugin.fullName].defaults, options);
        var words = getWordsToHyphenate(text, options);

        $.each(words, function(i, word) {
            var parts = $[plugin.fullName].splitWord(word, options);
            var hyphWord = parts.join(Entities.shy);
            var regex = new RegExp(Utils.quoteRegex(word), 'g');
            text = text.replace(regex, hyphWord);
        });

        return text;
    };

    function getPatterns(lang) {
        return $.fn[plugin.fullName]['patterns'][lang];
    }

    function buildTrie(patterns) {
        var trie = {};
        var currentNode;
        for (var i = 0; i < patterns.length; i++) {
            var pattern = patterns[i];
            var letters = pattern.replace(/\d/g, '');
            var points = getPatternPoints(pattern);

            currentNode = trie;

            for (var j = 0; j < letters.length; j++) {
                var letter = letters.charAt(j);

                var pos = currentNode[letter];

                if (pos == null) {
                    currentNode = currentNode[letter] = j === letters.length - 1 ? { $: points }: {};
                } else if (pos === 0) {
                    currentNode = currentNode[letter] = { $: points };
                } else {
                    currentNode = currentNode[letter];
                }
            }
        }
        return trie;
    }

    function getPatternPoints(pattern) {
        var points = [];

        if ("ze4p".split(/\D/).length == 1) { // IE<9
            var chars = pattern.split(''), c, i = 0, lastWasNum = false;

            while (i < chars.length) {
                c = chars[i];
                if (~~c) {  // c is numeric
                    points.push(c);
                    i += 2;
                    lastWasNum = true;
                } else {
                    points.push(0);
                    i += 1;
                    lastWasNum = false;
                }
            }
            if (!lastWasNum) {
                points.push(0);
            }
        } else {
            points = pattern.split(/\D/);
            for (var k = 0; k < points.length; ++k) {
                points[k] = points[k] || '0';
            }
        }

        return points;
    }

    function computeHyphenationPoints(trie, word) {
        var wordPattern = '.' + word + '.';
        var patternLen = wordPattern.length;
        var points = new Array(patternLen);
        while (--patternLen >= 0) {
            points[patternLen] = 0;
        }

        for (var i = 0; i < wordPattern.length; i++) {
            var node = trie;

            var part = wordPattern.slice(i);
            for (var j = 0; j < part.length; j++) {
                var ch = part.charAt(j);

                if (node[ch] != null) {
                    node = node[ch];
                    if (node.hasOwnProperty('$')) {
                        var nodePoints = node['$'];
                        for (var k = 0, len = points.length; k < nodePoints.length; k++) {
                            if (i + k > len - 1) {
                                continue;
                            }
                            points[i + k] = Math.max(points[i + k], nodePoints[k]);
                        }
                    }
                } else {
                    break;
                }
            }
        }

        return points;
    }

    function getWordsToHyphenate(text, options) {
        var words = $.grep(
            text.split(/\s+|[.?!,;:"'-()]+/),
            function(e) {
                return e.length >= options.minWordLength;
            }
        );

        return $.unique(words);
    }

    $.fn[plugin.fullName] = function(options) {
        return this.each(function () {
            if (!$.data(this, plugin.fullName)) {
                $.data(this, plugin.fullName, new Hyphenator(this, options));
            }
        });
    };

    $.fn[plugin.fullName].entities = {
        shy: '\u00AD' // soft-hyphen, &shy;
    };

    $.fn[plugin.fullName].defaults = {
        contextClass: 'jquery-' + plugin.ns + '-' + plugin.name,
        lang: 'pl',
        minWordLength: 3,
        minLeft: 2,
        minRight: 2,
        ignoreTags: ['pre', 'code'],
        ignoreClass: 'ignore-' + plugin.name
    };

    $[plugin.fullName] = {
        splitWord: Hyphenator.splitWord,
        hyphenate: Hyphenator.hyphenate
    };

    var Utils = $.typographer_common;
    var Entities = $.fn[plugin.fullName].entities;
})(jQuery, window, document);
