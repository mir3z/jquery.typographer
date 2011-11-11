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
            console.log('typographer.hyphen.init()');
            context = $(this).get(0);
            options = $.extend({}, $.fn.typographer.hyphen.defaults, opts);

            $(context).addClass(options.contextClass);
            console.time('hyphen.execute');
            execute();
            console.timeEnd('hyphen.execute');

            console.log(hyphenate('dnia'));
            console.log(hyphenate('czereśnie'));
            console.log(hyphenate('wciąż'));
            console.log(hyphenate('wracała'));
            console.log(hyphenate('wszystkie'));
            console.log(hyphenate('mama'));
            console.log(hyphenate('bynajmniej'));
        }
    };
    var trie = {};
    var shy = '&shy;';

    function execute() {
        console.log("typographer.hyphen.execute()");

        console.time('buildTrie');
        trie = buildTrie($.fn.typographer.hyphen.patterns);
        console.timeEnd('buildTrie');

        hyphenateContext();
    }

    function buildTrie(patterns) {
        var trie = {};
        var currentNode;
        for(var i = 0; i < patterns.length; i++) {
            var pattern = patterns[i];
            var letters = pattern.replace(/[0-9]/g, '');
            var points = pattern.split(/[^0-9]/);

            for (var k = 0; k < points.length; ++k) {
                points[k] = points[k] || '0';
            }

            currentNode = trie;

            for(var j = 0; j < letters.length; j++) {
                var letter = letters[j];

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

    function hyphenate(word) {
        if (word.length < 3) return [word];

        if($.fn.typographer.hyphen.exceptions[word]) {
            return $.fn.typographer.hyphen.exceptions[word];
        }

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
                var char = part[j];

                if(node[char] != null) {
                    node = node[char];
                    if (node.hasOwnProperty('$')) {
                        var nodePoints = node['$'];

                        for (var k = 0; k < nodePoints.length; k++) {
                            points[i+k] = Math.max(points[i+k], nodePoints[k]);
                        }
                    }
                } else {
                    break;
                }
            }
        }

        points[0] = points[1] = points[2] = 0; // min prefix length: 2
        points[points.length-1] = points[points.length-2] = 0; // min sufix length: 2

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

    function hyphenateContext() {
        console.time('getWordsToHyphenate');
        var words = getWordsToHyphenate();
        console.timeEnd('getWordsToHyphenate');

        console.time('hyphenateWords');
        var text = $(context).text();
        $.each(words, function(i, word) {
            var parts = hyphenate(word);
            var hyphWord = parts.join(shy);
            var regex = new RegExp(word, 'g');
            text = text.replace(regex, hyphWord);
        });
        context.innerHTML = text;
        console.timeEnd('hyphenateWords');
    }

    function getWordsToHyphenate() {
        var words = $.grep(
            $(context).text().split(/\s+|[.,;:"'()]+/), function(e) {
                return e.length >= 3;
            }
        );
        return $.unique(words);
    }

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

    $.fn.typographer.hyphen.defaults = {
        contextClass: 'jquery-typographer-hyphen',
    };

})(jQuery);
