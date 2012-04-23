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
            options = $.extend({}, $.fn.typographer.defaults, opts);
            saveState();

            $(context).addClass(options.contextClass);
            execute();
        },
        destroy: function() {
            teardown();
        }
    }

    /**
     * Associates plugin's options with context element.
     */
    function saveState() {
        $(context).data('jquery-typographer', options);
    }

    /**
     * Restores plugin's options from data associated with context element.
     */
    function restoreState(ctx) {
        context = ctx;
        options = $(context).data('jquery-typographer');
    }

    function teardown() {
        $(context).removeClass(options.contextClass);
    }

    function execute() {
        for(var prop in $.fn.typographer) {
            if (shouldRunModule(prop)) {
                $(context).typographer[prop].apply(context, [options[prop]]);
            }
        }
    }

    function shouldRunModule(moduleName) {
        return typeof $.fn.typographer[moduleName] == 'function'
            && $.inArray(moduleName, options.modules) != -1;
    }

    $.fn.typographer = function(method) {
        var args = arguments;

        return $(this).each(function() {
            if (methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(args, 1));
            } else if (typeof method === 'object' || !method) {
                return methods.init.apply(this, args);
            } else {
                $.error('Method ' +  method + ' does not exist on jQuery.typographer');
            }
        });
    };

    $.fn.typographer.defaults = {
        contextClass: 'jquery-typographer',
        modules: []
    };
})(jQuery);
