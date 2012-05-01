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

(function($, window, document, undefined) {
    'use strict';

    var plugin = {
        ns: 'typographer',
        name: 'orphan'
    };
    plugin.fullName = plugin.ns + '_' + plugin.name;

    function Deorphanator(context, options) {
        this.context = context;
        this.$context = $(context);
        this.options = $.extend({}, $.fn[plugin.fullName].defaults, options);

        this.init();
    }

    Deorphanator.prototype.init = function() {
        this.options.ignoreTags = Utils.normalizeTagNames(this.options.ignoreTags);
        this.$context.addClass(this.options.contextClass);
        compileRegex(this.options);

        this.execute();
    };

    Deorphanator.prototype.execute = function() {
        var orphanAtTheEnd = false;
        var textNodes = Utils.getTextNodesIn(this.context, false);
        var self = this;

        $.each(textNodes, function() {
            if (Utils.shouldIgnore(this, self.context, self.options)) {
                return true;
            }

            var text = this.nodeValue;
            text = Deorphanator.deorphanize(text, this.options);

            if (orphanAtTheEnd) {
                text = text.replace(/^\s+/, Entities.nbsp);
                orphanAtTheEnd = false;
            }

            if (Deorphanator.orphanAtTheEndRegex.test(text)) {
                orphanAtTheEnd = true;
            }

            this.nodeValue = text;
        });
    };

    Deorphanator.deorphanize = function(text, options) {
        options = $.extend({}, $.fn[plugin.fullName].defaults, options);

        if (!Deorphanator.findOrphanRegex) {
            compileRegex(options);
        }

        text = text.replace(Deorphanator.findOrphanRegex, function($0, $1, pos) {
            var preMatchChar = text.substring(pos - 1, pos);

            if (preMatchChar !== ' ' && preMatchChar !== '') {
                return $0;
            } else {
                return $1 + Entities.nbsp;
            }
        });

        return text;
    };

    function compileRegex(options) {
        var forbiddenAlt = options.forbidden.join('|');

        var findOrphanPattern = '(' + forbiddenAlt + ')(?:\\n|\\s)+';
        Deorphanator.findOrphanRegex = new RegExp(findOrphanPattern, 'gi');

        var orphanAtTheEndPattern = '\\s+(' + forbiddenAlt + ')$';
        Deorphanator.orphanAtTheEndRegex = new RegExp(orphanAtTheEndPattern, 'i');
    }

    $.fn[plugin.fullName] = function(options) {
        return this.each(function () {
            if (!$.data(this, plugin.fullName)) {
                $.data(this, plugin.fullName, new Deorphanator(this, options));
            }
        });
    };

    $.fn[plugin.fullName].entities = {
        nbsp: '\u00A0' // non-breaking space, &nbsp;
    };

    $.fn[plugin.fullName].defaults = {
        contextClass: 'jquery-' + plugin.ns + '-' + plugin.name,
        forbidden: ['a', 'i', 'o', 'u', 'w', 'z'],
        ignoreTags: ['pre', 'code'],
        ignoreClass: 'ignore-' + plugin.name
    };

    $[plugin.fullName] = {
        deorphanize: Deorphanator.deorphanize
    };

    var Utils = $.typographer_common;
    var Entities = $.fn[plugin.fullName].entities;
})(jQuery, window, document);
