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

;(function($, window, document, undefined) {
    var plugin = {
        name: 'typographer'
    };

    function Typographer(context, options) {
        this.context = context;
        this.$context = $(context);
        this.options = $.extend({}, $.fn[plugin.name].defaults, options);

        this.init();
    }

    Typographer.prototype.init = function() {
        this.$context.addClass(this.options.contextClass);
        this.execute();
    };

    Typographer.prototype.execute = function() {
        var self = this;

        $.each(self.options.modules, function(i, moduleName) {
            if (isValidModule(moduleName)) {
                var moduleFullName = Typographer.getModuleFullName(moduleName);

                self.$context[moduleFullName].call(
                    self.$context,
                    self.options[moduleName]
                );
            } else {
                $.error('Module ' + moduleName + ' does not exist!');
            }
        });
    };

    Typographer.getModuleFn = function(name) {
        var moduleFullName = Typographer.getModuleFullName(name);
        return $.fn[moduleFullName];
    };

    Typographer.getModuleFullName = function(name) {
        return plugin.name + '_' + name;
    };

    function isValidModule(name) {
        var fn = Typographer.getModuleFn(name);
        return fn != undefined && typeof fn == 'function';
    }


    $.fn[plugin.name] = function(options) {
        return this.each(function () {
            if (!$.data(this, plugin.name)) {
                $.data(this, plugin.name, new Typographer(this, options));
            }
        });
    }

    $.fn[plugin.name].defaults = {
        contextClass: 'jquery-' + plugin.name,
        modules: []
    };

})(jQuery, window, document);