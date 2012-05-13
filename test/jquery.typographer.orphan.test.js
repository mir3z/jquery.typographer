$(document).ready(function() {
    var $sandbox = $('#sandbox');

    module('typographer_orphan', {
        teardown: function() {
            teardownSandbox($sandbox);
        }
    });

    test('Initialization', function() {
        $sandbox.typographer_orphan();

        ok($.fn.typographer_orphan.defaults, '$.fn.typographer_orphan.defaults present');
        ok($sandbox.hasClass($.fn.typographer_orphan.defaults.contextClass),
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

            $sandbox.typographer_orphan();

            var actual = $sandbox.normalizedHtml();
            equal(actual, data.expected, data.init);

            teardownSandbox($sandbox);
        });
    });

    test('Public method - deorphanize', function() {
        var init = 'Być u nieba bram';
        var expected = 'Być u\u00A0nieba bram';

        ok($.typographer_orphan.deorphanize, 'Deorphanize method present');
        var got = $.typographer_orphan.deorphanize(init);

        equal(got, expected, 'Non-breaking spaces inserted correctly.');
    });

    test('Custom forbidden line-break list', function() {
        var init = "Spójrz na wprost w ciemności";
        var forbidList = ['na'];
        var expected = "Spójrz na&nbsp;wprost w ciemności";

        $sandbox.text(init);

        $sandbox.typographer_orphan({
            forbidden: forbidList
        });

        equal($sandbox.html(), expected, 'Non-breaking spaces inserted correctly.');
    });
});
