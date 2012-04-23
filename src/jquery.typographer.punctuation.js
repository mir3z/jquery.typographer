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
            context = $(this).get(0);
            options = $.extend({}, $.fn.typographer.punctuation.defaults, opts);

            $(context).addClass(options.contextClass);
            execute();
        }
    };
    var ents = {
        'bdquo' : '\u201E', // &bdquo; cudzysłów otwierający
        'rdquo' : '\u201D', // &rdquo; cudzysłów zamykający
        'laquo' : '\u00AB', // &laquo; cudzysłów otwierający francuski
        'raquo' : '\u00BB', // &raquo; cudzysłów zamykający francuski
        'hellip': '\u2026', // &hellip; wielokropek
        'rsquo' : '\u2019', // &rsquo; apostrof
        'ndash' : '\u2013', // &ndash; półpauza
        'mdash' : '\u2014'  // &ndash; pauza
    };

    function execute() {
        var textNodes = $.fn.typographer.common.getTextNodesIn(context, false);
        $.each(textNodes, function() {
            if($.fn.typographer.common.shouldIgnore(this, context, options)) return true;

            var text = this.nodeValue;
            text = $.fn.typographer.punctuation.correctQuotes(text);
            text = $.fn.typographer.punctuation.correctEllipsis(text);
            text = $.fn.typographer.punctuation.correctApostrophe(text);
            text = $.fn.typographer.punctuation.correctDash(text);

            this.nodeValue = text;
        });
    }

    $.fn.typographer.punctuation = function(method) {
        var args = arguments;

        return $(this).each(function() {
            if (methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(args, 1));
            } else if (typeof method === 'object' || !method) {
                return methods.init.apply(this, args);
            } else {
                $.error('Method ' +  method + ' does not exist on jQuery.typographer.punctuation');
            }
        });
    };

    $.fn.typographer.punctuation.correctQuotes = function(text) {
        // zamiana cudzysłowów prostych na drukarskie
        text = text.replace(/"([a-ząćęłńóśżź])/gi, ents.bdquo + '$1');
        text = text.replace(/([a-ząćęłńóśżź])"/gi, '$1' + ents.rdquo);

        // korekta cudzysłowów francuskich
        text = text.replace(/\u00BB([a-ząćęłńóśżź])/gi, ents.laquo + '$1');
        text = text.replace(/([a-ząćęłńóśżź])\u00AB/gi, '$1' + ents.raquo);

        return text;
    }

    $.fn.typographer.punctuation.correctEllipsis = function(text) {
        text = text.replace(/\.\.\./gi, ents.hellip);
        return text;
    }

    $.fn.typographer.punctuation.correctApostrophe = function(text) {
        text = text.replace(/'/gi, ents.rsquo);
        return text;
    }

    $.fn.typographer.punctuation.correctDash = function(text) {
        text = text.replace(/(\d)\s*-\s*(\d)/gi, '$1' + ents.ndash + '$2');
        text = text.replace(/(\d)\s+(?:\u2012|\u2013)\s+(\d)/gi, '$1' + ents.ndash + '$2');
        text = text.replace(/\s+-\s+/gi, ' ' + ents.ndash + ' ');
        text = text.replace(/([a-ząćęłńóśżź])(?:\u2012|\u2013)([a-ząćęłńóśżź])/gi, "$1-$2");
        return text;
    }

    $.fn.typographer.punctuation.entities = ents;

    $.fn.typographer.punctuation.defaults = {
        contextClass: 'jquery-typographer-punctuation',
        ignoreTags: ['pre', 'code'],
        ignoreClass: 'ignore-punctuation'
    };
})(jQuery);
