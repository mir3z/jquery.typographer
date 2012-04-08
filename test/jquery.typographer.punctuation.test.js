$(document).ready(function() {
    var $sandbox = $('#sandbox');

    module('typographer.punctuation', {
        teardown: function() {
            $sandbox.empty();
        }
    });

    var bdquo = '\u201E'; // &bdquo;
    var rdquo = '\u201D'; // &rdquo;
    var laquo = '\u00AB'; // &laquo;
    var raquo = '\u00BB'; // &raquo;
    var nbsp = '\u00A0'; // &nbsp;
    var ellip = '\u2026'; // &hellip;
    var apos = '\u2019'; // &rsquo;
    var ndash = '\u2013'; // '&ndash; półpauza
    var mdash = '\u2014'; // '&ndash; pauza

    test('Initialization', function() {
        $sandbox.typographer({
            modules: ['punctuation']
        });

        ok($.fn.typographer.punctuation.defaults, '$.fn.typographer.punctuation.defaults present');
        ok($sandbox.hasClass($.fn.typographer.punctuation.defaults.contextClass),
           'Context has valid class');

    });

    test('Quotes correction', function() {
        var testSpec = [
            {
                init: 'Lorem "ipsum" dolor sit amet.',
                expected: 'Lorem \u201Eipsum\u201D dolor sit amet.'
            },
            {
                init: 'Oto "źdźbło" trawy.',
                expected: 'Oto \u201Eźdźbło\u201D trawy.'
            },
            {
                init: 'Taką "długą grę" lubię.',
                expected: 'Taką \u201Edługą grę\u201D lubię.'
            },
            {
                init: 'Lorem "ipsum »dolor« sit" amet.',
                expected: 'Lorem \u201Eipsum \u00ABdolor\u00BB sit\u201D amet.'
            }
        ];

        $.each(testSpec, function(i, data) {
            $sandbox.get(0).innerHTML = data.init;

            $sandbox.typographer({
                modules: ['punctuation']
            });
            equal($sandbox.get(0).innerHTML, data.expected, data.init);
        });
    });

    test('Ellipsis correction', function() {
        var testSpec = [
            {
                init: 'Dawno, dawno temu...',
                expected: 'Dawno, dawno temu' + ellip
            },
            {
                init: 'Wprost do... domu.',
                expected: 'Wprost do' + ellip + ' domu.'
            }

        ];

        $.each(testSpec, function(i, data) {
            $sandbox.get(0).innerHTML = data.init;

            $sandbox.typographer({
                modules: ['punctuation']
            });
            equal($sandbox.get(0).innerHTML, data.expected, data.init);
        });
    });

    test('Apostrophe correction', function() {
        var testSpec = [
            {
                init: 'Alfabet Morse\'a',
                expected: 'Alfabet Morse' + apos + 'a'
            },
            {
                init: 'prawo Murphy\'ego',
                expected: 'prawo Murphy' + apos + 'ego'
            }

        ];

        $.each(testSpec, function(i, data) {
            $sandbox.get(0).innerHTML = data.init;

            $sandbox.typographer({
                modules: ['punctuation']
            });
            equal($sandbox.get(0).innerHTML, data.expected, data.init);
        });
    });

    test('Dash correction', function() {
        var testSpec = [
            {
                init: 'A to jest - rzecz oczywista - najlepsze wyjście.',
                expected: 'A to jest ' + ndash + ' rzecz oczywista ' + ndash + ' najlepsze wyjście.'
            },
            {
                init: 'Wiedza - to potęga.',
                expected: 'Wiedza ' + ndash + ' to potęga.'
            },
            {
                init: 'Działalność PAN-u',
                expected: 'Działalność PAN-u'
            },
            {
                init: 'Działalność PAN' + ndash + 'u',
                expected: 'Działalność PAN-u'
            },
            {
                init: 'Elżbieta Nowak-Kowalska',
                expected: 'Elżbieta Nowak-Kowalska'
            },
            {
                init: 'W latach 1999-2001',
                expected: 'W latach 1999' + ndash + '2001'
            },
            {
                init: 'W latach 1999 - 2001',
                expected: 'W latach 1999' + ndash + '2001'
            },
            {
                init: 'W latach 1999 ' + ndash + ' 2001',
                expected: 'W latach 1999' + ndash + '2001'
            }
        ];

        $.each(testSpec, function(i, data) {
            $sandbox.get(0).innerHTML = data.init;

            $sandbox.typographer({
                modules: ['punctuation']
            });
            equal($sandbox.get(0).innerHTML, data.expected, data.init);
        });
    });
});
