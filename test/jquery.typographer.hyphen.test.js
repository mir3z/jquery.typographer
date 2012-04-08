$(document).ready(function() {
    var $sandbox = $('#sandbox');

    module('typographer.hyphen', {
        teardown: function() {
            $sandbox.empty();
            $.fn.typographer.hyphen.defaults.minWordLength = 3;
            $.fn.typographer.hyphen.defaults.minLeft = 2;
            $.fn.typographer.hyphen.defaults.minRight = 2;
        }
    });

    test('Initialization', function() {
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
    test('Options - minLen = ' + minLen, function() {
        var init = 'mama';
        var expected = ['mama'];

        $.fn.typographer.hyphen.defaults.minWordLength = minLen;

        var got = $.fn.typographer.hyphen.splitWord(init);
        deepEqual(got, expected, 'Word splitting');
    });

    var left = 4;
    test('Options - minLeft = ' + left, function() {
        var init = 'rabarbar';
        var expected = ['rabar', 'bar'];

        $.fn.typographer.hyphen.defaults.minLeft = left;

        var got = $.fn.typographer.hyphen.splitWord(init);
        deepEqual(got, expected, 'Word splitting');
    });

    var right = 4;
    test('Options - minRight = ' + right, function() {
        var init = 'rabarbar';
        var expected = ['ra', 'barbar'];

        $.fn.typographer.hyphen.defaults.minRight = right;

        var got = $.fn.typographer.hyphen.splitWord(init);
        deepEqual(got, expected, 'Word splitting');
    });
});
