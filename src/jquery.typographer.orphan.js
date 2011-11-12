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

            $(context).addClass(options.contextClass);

            compileRegex();
            execute();
        }
    };
    var deorphanizeRegex;
    var nbsp = '&nbsp;';

    function compileRegex() {
        var forbiddenAlt = $.fn.typographer.orphan.defaults.forbidden.join('|');
        var pattern = '(' + forbiddenAlt + ')(?:\\n|\\s)+';
        deorphanizeRegex = new RegExp(pattern, 'gi');
    }

    function execute() {
        console.log("typographer.orphan.execute()");

        context.innerHTML = $.fn.typographer.orphan.deorphanize(context.innerHTML);
    }

    $.fn.typographer = $.fn.typographer || function() {
        context = $(this).get(0);
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
        return text.replace(deorphanizeRegex, function($0, $1, pos) {
            var preMatchChar = text.substring(pos - 1, pos);
            if (preMatchChar != ' ' && preMatchChar != '') {
                return $0;
            } else {
                return $1 + nbsp;
            }
        });
    }

    $.fn.typographer.orphan.defaults = {
        contextClass: 'jquery-typographer-orphan',
        forbidden: ['a', 'i', 'o', 'u', 'w', 'z']
    };
})(jQuery);
