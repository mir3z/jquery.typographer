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
        name: 'punctuation'
    };
    plugin.fullName = plugin.ns + '_' + plugin.name;

    function Punctuation(context, options) {
        this.context = context;
        this.$context = $(context);
        this.options = $.extend({}, $.fn[plugin.fullName].defaults, options);
        this.init();
    }

    Punctuation.prototype.init = function() {
        this.options.ignoreTags = Utils.normalizeTagNames(this.options.ignoreTags);
        this.$context.addClass(this.options.contextClass);


        this.execute();
    };

    Punctuation.prototype.execute = function() {
        var textNodes = Utils.getTextNodesIn(this.context, false);
        var self = this;

        $.each(textNodes, function() {
            if (Utils.shouldIgnore(this, self.context, self.options)) {
                return true;
            }

            var text = this.nodeValue;

            text = Punctuation.correctQuotes(text);
            text = Punctuation.correctEllipsis(text);
            text = Punctuation.correctApostrophe(text);
            text = Punctuation.correctDash(text);

            this.nodeValue = text;
        });
    };

    Punctuation.correctQuotes = function(text) {
        // zamiana cudzysłowów prostych na drukarskie
        text = text.replace(/(\s|^)"(\S)/gi, '$1' + Entities.bdquo + '$2');
        text = text.replace(/(\S)"(\s|$|[.,?!;:])/gi, '$1' + Entities.rdquo + '$2');

        // korekta cudzysłowów francuskich
        var raquoRegex = new RegExp(Entities.raquo + '([a-ząćęłńóśżź0-9])', 'gi');
        var laquoRegex = new RegExp('([a-ząćęłńóśżź0-9])' + Entities.laquo, 'gi');
        text = text.replace(raquoRegex, Entities.laquo + '$1');
        text = text.replace(laquoRegex, '$1' + Entities.raquo);

        return text;
    };

    Punctuation.correctEllipsis = function(text) {
        text = text.replace(/\.\.\./gi, Entities.hellip);
        return text;
    };

    Punctuation.correctApostrophe = function(text) {
        text = text.replace(/'/gi, Entities.rsquo);
        return text;
    };

    Punctuation.correctDash = function(text) {
        text = text.replace(/(\d)\s*-\s*(\d)/gi, '$1' + Entities.ndash + '$2');
        text = text.replace(/(\d)\s+(?:\u2012|\u2013)\s+(\d)/gi, '$1' + Entities.ndash + '$2');
        text = text.replace(/\s+-\s+/gi, ' ' + Entities.ndash + ' ');
        text = text.replace(/([a-ząćęłńóśżź])(?:\u2012|\u2013)([a-ząćęłńóśżź])/gi, "$1-$2");
        return text;
    };

    $.fn[plugin.fullName] = function(options) {
        return this.each(function () {
            if (!$.data(this, plugin.fullName)) {
                $.data(this, plugin.fullName, new Punctuation(this, options));
            }
        });
    };

    $.fn[plugin.fullName].entities = {
        'bdquo' : '\u201E', // &bdquo; cudzysłów otwierający
        'rdquo' : '\u201D', // &rdquo; cudzysłów zamykający
        'laquo' : '\u00AB', // &laquo; cudzysłów otwierający francuski
        'raquo' : '\u00BB', // &raquo; cudzysłów zamykający francuski
        'hellip': '\u2026', // &hellip; wielokropek
        'rsquo' : '\u2019', // &rsquo; apostrof
        'ndash' : '\u2013', // &ndash; półpauza
        'mdash' : '\u2014'  // &ndash; pauza
    };

    $.fn[plugin.fullName].defaults = {
        contextClass: 'jquery-' + plugin.ns + '-' + plugin.name,
        ignoreTags: ['pre', 'code'],
        ignoreClass: 'ignore-' + plugin.name
    };

    $[plugin.fullName] = {
        correctQuotes: Punctuation.correctQuotes,
        correctEllipsis: Punctuation.correctEllipsis,
        correctDash: Punctuation.correctDash,
        correctApostrophe: Punctuation.correctApostrophe
    };

    var Utils = $.typographer_common;
    var Entities = $.fn[plugin.fullName].entities;
})(jQuery, window, document);