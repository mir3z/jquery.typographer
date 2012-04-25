/**
 * @license jQuery Typographer
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

(function($) {
    var context = null;
    var options = {};
    var methods = {
        init: function(opts) {
            context = context || $(this).get(0);
            options = $.extend({}, $.fn.typographer.hyphen.defaults, opts);
            options.ignoreTags = $.map(options.ignoreTags, function(tagName) {
                return tagName.toLowerCase();
            });

            $(context).addClass(options.contextClass);
            execute();
        }
    };
    var trie = null;
    var shy = '\u00AD'; // &shy; (soft-hyphen)

    function execute() {
        trie = trie || buildTrie($.fn.typographer.hyphen.patterns);

        var textNodes = $.fn.typographer.common.getTextNodesIn(context, false);
        $.each(textNodes, function() {
            if($.fn.typographer.common.shouldIgnore(this, context, options)) return true;

            var text = this.nodeValue;
            var hyphenatedText = hyphenate(text);

            this.nodeValue = hyphenatedText;
        });
    }

    function buildTrie(patterns) {
        var getPoints = function(pattern) {
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
        };


        var trie = {};
        var currentNode;
        for (var i = 0; i < patterns.length; i++) {
            var pattern = patterns[i];
            var letters = pattern.replace(/\d/g, '');
            var points = getPoints(pattern);

            currentNode = trie;

            for(var j = 0; j < letters.length; j++) {
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

    function hyphenate(text) {
        var words = getWordsToHyphenate(text);

        $.each(words, function(i, word) {
            var parts = splitWord(word);
            var hyphWord = parts.join(shy);
            var regex = new RegExp(word, 'g');
            text = text.replace(regex, hyphWord);
        });

        return text;
    }

    function getWordsToHyphenate(text) {
        var words = $.grep(
            text.split(/\s+|[.,;:"'-()]+/),
            function(e) {
                return e.length >= options.minWordLength;
            }
        );

        return $.unique(words);
    }

    function splitWord(word) {
        if (word.length < options.minWordLength) return [word];
        if ($.fn.typographer.hyphen.exceptions[word]) {
            return $.fn.typographer.hyphen.exceptions[word];
        }

        var points = computeHyphenationPoints(word);
        for (var i = 0; i <= options.minLeft; i++) {
            points[i] = 0;
        }
        for (var i = 1, len = points.length; i <= options.minRight; i++) {
            points[len-i] = 0;
        }

        var pieces = [];
        var piece = '';
        var letters = word.split('');
        for (i = 0; i < word.length; i++) {
            var char = letters[i];
            var point = points[i+2];

            piece += char;
            if (point % 2 == 1) {
                pieces.push(piece);
                piece = '';
            }
        }
        pieces.push(piece);

        return pieces;
    }

    function computeHyphenationPoints(word) {
        var wordPattern = '.' + word + '.';
        var len = wordPattern.length;
        var points = new Array(len);
        while (--len >= 0) {
            points[len] = 0;
        }


        for (var i = 0; i < wordPattern.length; i++) {
            var node = trie;

            var part = wordPattern.slice(i);
            for(var j = 0; j < part.length; j++) {
                var char = part.charAt(j);

                if(node[char] != null) {
                    node = node[char];
                    if (node.hasOwnProperty('$')) {
                        var nodePoints = node['$'];
                        for (var k = 0, len = points.length; k < nodePoints.length; k++) {
                            if (i+k > len - 1) continue;
                            points[i+k] = Math.max(points[i+k], nodePoints[k]);
                        }
                    }
                } else {
                    break;
                }
            }
        }

        return points;
    }

    $.fn.typographer = $.fn.typographer || function() {
        context = $(this).get(0);
        return $.fn.typographer;
    };

    $.fn.typographer.hyphen = function(method) {
        var args = arguments;

        return $(this).each(function() {
            if (methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(args, 1));
            } else if (typeof method === 'object' || !method) {
                return methods.init.apply(this, args);
            } else {
                $.error('Method ' +  method + ' does not exist on jQuery.typographer.hyphen');
            }
        });
    };

    $.fn.typographer.hyphen.splitWord = function(word) {
        trie = trie || buildTrie($.fn.typographer.hyphen.patterns);
        options = $.extend({}, $.fn.typographer.hyphen.defaults);

        return splitWord(word);
    };

    $.fn.typographer.hyphen.hyphenate = function(text) {
        trie = trie || buildTrie($.fn.typographer.hyphen.patterns);
        options = $.extend({}, $.fn.typographer.hyphen.defaults);

        return hyphenate(text);
    };

    $.fn.typographer.hyphen.rebuildTrie = function() {
        trie = buildTrie($.fn.typographer.hyphen.patterns);
    };

    $.fn.typographer.hyphen.defaults = {
        contextClass: 'jquery-typographer-hyphen',
        minWordLength: 3,
        minLeft: 2,
        minRight: 2,
        ignoreTags: ['pre', 'code'],
        ignoreClass: 'ignore-hyphen'
    };

})(jQuery);
