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
            console.log('typographer.orphan.init()');
            context = context || $(this).get(0);
            options = $.extend({}, $.fn.typographer.orphan.defaults, opts);
            options.ignoreTags = $.map(options.ignoreTags, function(tagName) {
                return tagName.toLowerCase();
            });

            $(context).addClass(options.contextClass);

            compileRegex();
            execute();
        }
    };
    var findOrphanRegex = null;
    var orphanAtTheEndRegex = null;
    var nbsp = '\u00A0';

    function compileRegex() {
        var forbiddenAlt = options.forbidden.join('|');

        var findOrphanPattern = '(' + forbiddenAlt + ')(?:\\n|\\s)+';
        findOrphanRegex = new RegExp(findOrphanPattern, 'gi');

        var orphanAtTheEndPattern = '\\s+(' + forbiddenAlt + ')$';
        orphanAtTheEndRegex = new RegExp(orphanAtTheEndPattern, 'i');
    }

    function execute() {
        console.log("typographer.orphan.execute()");

        var orphanAtTheEnd = false;
        var textNodes = $.fn.typographer.common.getTextNodesIn(context, false);
        $.each(textNodes, function() {
            if($.fn.typographer.common.shouldIgnore(this, context, options)) return true;

            var text = this.nodeValue;
            text = $.fn.typographer.orphan.deorphanize(text);

            if (orphanAtTheEnd == true) {
                text = text.replace(/^\s+/, nbsp);
                orphanAtTheEnd = false;
            }

            if (orphanAtTheEndRegex.test(text)) {
                orphanAtTheEnd = true;
            }

            this.nodeValue = text;
        });
    }

    $.fn.typographer = $.fn.typographer || function() {
        context = $(this).get(0);
        return $.fn.typographer;
    };

    $.fn.typographer.orphan = function(method) {
        var args = arguments;

        return $(this).each(function() {
            if (methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(args, 1));
            } else if (typeof method === 'object' || !method) {
                return methods.init.apply(this, args);
            } else {
                $.error('Method ' +  method + ' does not exist on jQuery.typographer.orphan');
            }
        });
    };

    $.fn.typographer.orphan.deorphanize = function(text) {
        options = $.extend({}, $.fn.typographer.orphan.defaults);
        if (!findOrphanRegex) {
            compileRegex();
        }

        text = text.replace(findOrphanRegex, function($0, $1, pos) {
            var preMatchChar = text.substring(pos - 1, pos);

            if (preMatchChar != ' ' && preMatchChar != '') {
                return $0;
            } else {
                return $1 + nbsp;
            }
        });

        return text;
    }

    $.fn.typographer.orphan.defaults = {
        contextClass: 'jquery-typographer-orphan',
        forbidden: ['a', 'i', 'o', 'u', 'w', 'z'],
        ignoreTags: ['pre', 'code'],
        ignoreClass: 'ignore-orphan'
    };
})(jQuery);
