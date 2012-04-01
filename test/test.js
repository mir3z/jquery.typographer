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

    test('Deorphanization', function() {
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
            {
                init: 'A to <b>w domu o</b> świcie',
                expected: 'A&nbsp;to <b>w&nbsp;domu o</b>&nbsp;świcie'
            },
            {
                init: 'A to <b>w domu i</b> o świcie',
                expected: 'A&nbsp;to <b>w&nbsp;domu i</b>&nbsp;o&nbsp;świcie'
            },
            {
                init: 'A oto kod: <code>a w domu</code>',
                expected: 'A&nbsp;oto kod: <code>a w domu</code>'
            },
            {
                init: 'A oto kod: <b class="ignore-orphan">a w domu</b>',
                expected: 'A&nbsp;oto kod: <b class="ignore-orphan">a w domu</b>'
            }
        ];

        $.each(testSpec, function(i, data) {
            $sandbox.get(0).innerHTML = data.init;

            $sandbox.typographer({
                modules: ['orphan']
            });

            equal($sandbox.get(0).innerHTML, data.expected, data.init);
        });
    });

    test('Public method - deorphanize', function() {
        var init = 'Być u nieba bram';
        var expected = 'Być u\u00A0nieba bram';

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
        teardown: function() {
            teardown();
            $.fn.typographer.hyphen.defaults.minWordLength = 3;
            $.fn.typographer.hyphen.defaults.minLeft = 2;
            $.fn.typographer.hyphen.defaults.minRight = 2;
        }
    });

    test('initialization', function() {
        $sandbox.typographer({
            modules: ['hyphen']
        });

        ok($.fn.typographer.hyphen.defaults, '$.fn.typographer.hyphen.defaults present');
        ok($sandbox.hasClass($.fn.typographer.hyphen.defaults.contextClass),
           'Context has valid class');

    });

    test('Hyphenation', function() {
        var testSpec = [
            {
                init: 'Białoruska wycieczka krajoznawcza',
                expected: 'Bia|ło|ru|ska wy|ciecz|ka kra|jo|znaw|cza'
            },
            {
                init: 'Wrona gdzieniegdzie kracze i puchają puchacze',
                expected: 'Wro|na gdzie|nie|gdzie kra|cze i pu|cha|ją pu|cha|cze'
            },
            {
                init: 'Wrona <code>gdzieniegdzie kracze</code> i puchają puchacze',
                expected: 'Wro|na <code>gdzieniegdzie kracze</code> i pu|cha|ją pu|cha|cze'
            },
            {
                init: 'Wrona <span class="ignore-hyphen">gdzieniegdzie kracze</span> i puchają puchacze',
                expected: 'Wro|na <span class="ignore-hyphen">gdzieniegdzie kracze</span> i pu|cha|ją pu|cha|cze'
            }
        ];

        $.each(testSpec, function(i, data) {
            $sandbox.get(0).innerHTML = data.init;

            $sandbox.typographer({
                modules: ['hyphen']
            });
            var expected = data.expected.replace(/\|/g, '\u00AD');
            equal($sandbox.get(0).innerHTML, expected, data.init);
        });
    });

    test('Public method - splitWord', function() {
        var init = 'truskawkowa';
        var expected = ['tru', 'skaw', 'ko', 'wa'];

        ok($.fn.typographer.hyphen.splitWord, 'Method presence');
        var got = $.fn.typographer.hyphen.splitWord(init);

        deepEqual(got, expected, 'Word splitting');
    });

    test('Public method - hyphenate', function() {
        var init = 'truskawkowa symfonia';
        var expected = 'tru|skaw|ko|wa sym|fo|nia';

        ok($.fn.typographer.hyphen.hyphenate, 'Method presence');
        var got = $.fn.typographer.hyphen.hyphenate(init);

        deepEqual(got, expected.replace(/\|/g, '\u00AD'), 'Hyphenation');
    });

    var minLen = 5;
    test('Custom options - minLen = ' + minLen, function() {
        var init = 'mama';
        var expected = ['mama'];

        $.fn.typographer.hyphen.defaults.minWordLength = minLen;

        var got = $.fn.typographer.hyphen.splitWord(init);
        deepEqual(got, expected, 'Word splitting');
    });

    var left = 4;
    test('Custom options - minLeft = ' + left, function() {
        var init = 'rabarbar';
        var expected = ['rabar', 'bar'];

        $.fn.typographer.hyphen.defaults.minLeft = left;

        var got = $.fn.typographer.hyphen.splitWord(init);
        deepEqual(got, expected, 'Word splitting');
    });

    var right = 4;
    test('Custom options - minRight = ' + right, function() {
        var init = 'rabarbar';
        var expected = ['ra', 'barbar'];

        $.fn.typographer.hyphen.defaults.minRight = right;

        var got = $.fn.typographer.hyphen.splitWord(init);
        deepEqual(got, expected, 'Word splitting');
    });
});
