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
        name: 'common'
    };
    plugin.fullName = plugin.ns + '_' + plugin.name;

    $[plugin.fullName] = $[plugin.fullName] || {};

    $[plugin.fullName].normalizeTagNames = function(tags) {
        return $.map(tags, function(tagName) {
            return tagName.toLowerCase();
        });
    };

    $[plugin.fullName].getTextNodesIn = function(node, includeWhitespaceNodes) {
        var textNodes = [], onlyWhitespaces = /^\s*$/;
        var TEXT_NODE = 3;

        function getTextNodes(node) {
            if (node.nodeType == TEXT_NODE) {
                if (includeWhitespaceNodes || !onlyWhitespaces.test(node.nodeValue)) {
                    textNodes.push(node);
                }
            } else {
                for (var i = 0, len = node.childNodes.length; i < len; ++i) {
                    getTextNodes(node.childNodes[i]);
                }
            }
        }

        getTextNodes(node);
        return textNodes;
    };

    $[plugin.fullName].shouldIgnore = function(node, stopNode, options) {
        while (node !== stopNode) {
            if (node.tagName && $.inArray(node.tagName.toLowerCase(), options.ignoreTags) > -1) {
                return true;
            }

            if ($(node).hasClass(options.ignoreClass)) {
                return true;
            }

            node = node.parentNode;
        }

        return false;
    };
})(jQuery, window, document);