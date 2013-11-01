$(document).ready(function() {
    var $sandbox = $('#sandbox');

    module('typographer_hyphen', {
        teardown: function() {
            teardownSandbox($sandbox);

            $.fn.typographer_hyphen.defaults.minWordLength = 3;
            $.fn.typographer_hyphen.defaults.minLeft = 2;
            $.fn.typographer_hyphen.defaults.minRight = 2;
        }
    });

    test('Initialization', function() {
        $sandbox.typographer_hyphen();

        ok($.fn.typographer_hyphen.defaults, '$.fn.typographer_hyphen.defaults present');
        ok($sandbox.hasClass($.fn.typographer_hyphen.defaults.contextClass),
           'Context has valid class');

    });

    test('Hyphenation', function() {
        var testSpec = [
            {
                init: 'Białoruska wycieczka krajoznawcza',
                expected: 'Bia|ło|ru|ska wy|ciecz|ka kra|jo|znaw|cza'
            },
            {
                init: 'Dzisiaj',
                expected: 'Dzi|siaj'
            },
            {
                init: 'Dzisiaj?',
                expected: 'Dzi|siaj?'
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
            },
            {
                init: '[a] Albo tak albo nie, może mają, czy też nie?',
                expected: '[a] Al|bo tak al|bo nie, mo|że ma|ją, czy też nie?'
            }
        ];

        $.each(testSpec, function(i, data) {
            $sandbox.get(0).innerHTML = data.init;

            $sandbox.typographer_hyphen();

            var expected = data.expected.replace(/\|/g, '\u00AD');
            var actual = $sandbox.normalizedHtml();
            equal(actual, expected, data.init);

            teardownSandbox($sandbox);
        });
    });

    test('Public method - splitWord', function() {
        var init = 'truskawkowa';
        var expected = ['tru', 'skaw', 'ko', 'wa'];

        ok($.typographer_hyphen.splitWord, 'Method presence');
        var got = $.typographer_hyphen.splitWord(init);

        deepEqual(got, expected, 'Word splitting');
    });

    test('Public method - hyphenate', function() {
        var init = 'truskawkowa symfonia';
        var expected = 'tru|skaw|ko|wa sym|fo|nia';

        ok($.typographer_hyphen.hyphenate, 'Method presence');
        var got = $.typographer_hyphen.hyphenate(init);

        deepEqual(got, expected.replace(/\|/g, '\u00AD'), 'Hyphenation');
    });

    var minLen = 5;
    test('Options - minLen = ' + minLen, function() {
        var init = 'mama';
        var expected = ['mama'];

        $.fn.typographer_hyphen.defaults.minWordLength = minLen;

        var got = $.typographer_hyphen.splitWord(init);
        deepEqual(got, expected, 'Word splitting');
    });

    var left = 4;
    test('Options - minLeft = ' + left, function() {
        var init = 'rabarbar';
        var expected = ['rabar', 'bar'];

        $.fn.typographer_hyphen.defaults.minLeft = left;

        var got = $.typographer_hyphen.splitWord(init);
        deepEqual(got, expected, 'Word splitting');
    });

    var right = 4;
    test('Options - minRight = ' + right, function() {
        var init = 'rabarbar';
        var expected = ['ra', 'barbar'];

        $.fn.typographer_hyphen.defaults.minRight = right;

        var got = $.typographer_hyphen.splitWord(init);
        deepEqual(got, expected, 'Word splitting');
    });
});
