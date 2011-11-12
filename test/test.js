$(document).ready(function() {
    var $sandbox = $('#sandbox');
    var teardown = function() {
        $sandbox.empty();
    };

    // =========================================================================

    module('typographer', {
        teardown: teardown
    });

    test('initialization', function() {
        ok(jQuery(), 'jQuery is loaded');
        ok(jQuery().typographer, 'typograher is loaded');
        ok(jQuery().typographer.hyphen, 'typographer.hyphen is loaded');
        ok(jQuery().typographer.orphan, 'typographer.orphan is loaded');
        ok(jQuery().typographer.punctuation, 'typographer.punctuation is loaded');

        $sandbox.typographer();

        ok($.fn.typographer.defaults, '$.fn.typographer.defaults present');
        equal($sandbox.attr('class'), $.fn.typographer.defaults.contextClass,
              'Context has valid class');
    });

    // =========================================================================

    module('typographer.orphan', {
        teardown: teardown
    });

    test('initialization', function() {
        $sandbox.typographer({
            modules: ['orphan']
        });

        ok($.fn.typographer.orphan.defaults, '$.fn.typographer.orphan.defaults present');
        ok($sandbox.hasClass($.fn.typographer.orphan.defaults.contextClass),
           'Context has valid class');

    });

    var testSpec = [
        {
            init: 'A kot i pies w pokoju o zmroku.',
            expected: 'A&nbsp;kot i&nbsp;pies w&nbsp;pokoju o&nbsp;zmroku.'
        },
        {
            init: 'Jest wieczór, a w pokoju kot i pies u stołu.',
            expected: 'Jest wieczór, a&nbsp;w&nbsp;pokoju kot i&nbsp;pies u&nbsp;stołu.'
        },
        {
            init: "Ciemno, a\n            w pokoju kot.",
            expected: 'Ciemno, a&nbsp;w&nbsp;pokoju kot.'
        },
        {
            init: 'a i o u w z',
            expected: 'a&nbsp;i&nbsp;o&nbsp;u&nbsp;w&nbsp;z'
        },
    ];

    (function runDeorphanizationTests(testSpec) {
        test('Deorphanization', function() {
            $.each(testSpec, function(i, data) {
                $sandbox.html(data.init);

                $sandbox.typographer({
                    modules: ['orphan']
                });

                equal($sandbox.html(), data.expected, data.init);
            });
        });
    }(testSpec));

    test('Public method - deorphanize', function() {
        var init = 'Być u nieba bram';
        var expected = 'Być u&nbsp;nieba bram';

        ok($.fn.typographer.orphan.deorphanize, 'Deorphanize method present');
        var got = $.fn.typographer.orphan.deorphanize(init);

        equal(got, expected, 'Non-breaking spaces inserted correctly.');
    });

    test('Custom forbidden line-break list', function() {
        var init = "Spójrz na wprost w ciemności";
        var forbidList = ['na'];
        var expected = "Spójrz na&nbsp;wprost w ciemności";

        $sandbox.text(init);

        $sandbox.typographer({
            modules: ['orphan'],
            orphan: {
                forbidden: forbidList
            }
        });

        equal($sandbox.html(), expected, 'Non-breaking spaces inserted correctly.');
    });

    // =========================================================================

    module('typographer.hyphen', {
        teardown: teardown
    });

    test('initialization', function() {
        $sandbox.typographer({
            modules: ['hyphen']
        });

        ok($.fn.typographer.hyphen.defaults, '$.fn.typographer.hyphen.defaults present');
        ok($sandbox.hasClass($.fn.typographer.hyphen.defaults.contextClass),
           'Context has valid class');

    });

    var testSpec = [
        {
            init: 'Białoruska wycieczka krajoznawcza',
            expected: 'Bia|ło|ru|ska wy|ciecz|ka kra|jo|znaw|cza'
        },
        {
            init: 'Wrona gdzieniegdzie kracze i puchają puchacze',
            expected: 'Wro|na gdzie|nie|gdzie kra|cze i pu|cha|ją pu|cha|cze'
        }
    ];

    (function runHyphenationTests(testSpec) {
        test('Hyphenation', function() {
            $.each(testSpec, function(i, data) {
                $sandbox.html(data.init);
                console.log($sandbox);

                $sandbox.typographer({
                    modules: ['hyphen']
                });
                var expected = data.expected.replace(/\|/g, '\u00AD');
                equal($sandbox.html(), expected, data.init);
            });
        });
    }(testSpec));
});
