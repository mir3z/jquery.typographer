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
            console.log('typographer.punctuation.init()');
            context = $(this).get(0);
            options = $.extend({}, $.fn.typographer.punctuation.defaults, opts);

            $(context).addClass(options.contextClass);
            execute();
        }
    };
    var bdquo = '&bdquo;';
    var rdquo = '&rdquo;';
    var ellip = '&hellip;';
    var apos = '&rsquo;';
    var ndash = '&ndash;';

    function execute() {
        console.log("typographer.punctuation.execute()");

        var text = context.innerHTML;
        var doCorrection = function(c) {
            text = c.apply(context, [text]);
        };

        doCorrection(correctQuotes);
        doCorrection(correctEllipsis);
        doCorrection(correctApostrophe);
        doCorrection(correctDash);

        context.innerHTML = text;
    }

    function correctQuotes(text) {
        //FIXME: można lepiej
        console.log('correcting quotes...');
        text = text.replace(/"([a-z])/gi, bdquo + '$1');
        text = text.replace(/([a-z])"/gi, '$1' + rdquo);
        return text;
    }

    function correctEllipsis(text) {
        console.log('correcting ellipsis...');
        text = text.replace(/\.\.\./gi, ellip);
        return text;
    }

    function correctApostrophe(text) {
        console.log('correcting apostrophe...');
        text = text.replace(/'/gi, apos);
        return text;
    }

    function correctDash(text) {
        console.log('correcting dash...');
        text = text.replace(/(\d)\s*-\s*(\d)/gi, '$1' + ndash + '$2');
        text = text.replace(/\s+-\s+/gi, ' ' + ndash + ' ');
        return text;
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

    $.fn.typographer.punctuation.defaults = {
        contextClass: 'jquery-typographer-punctuation',
    };

})(jQuery);
