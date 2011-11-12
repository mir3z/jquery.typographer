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
    ];

    (function runDeorphanizationTests(testSpec) {
        $.each(testSpec, function(i, data) {
            test('Deorphanization: "' + data.init + '"', function() {
                $sandbox.text(data.init);

                $sandbox.typographer({
                    modules: ['orphan']
                });

                equal($sandbox.html(), data.expected, 'Non-breaking spaces inserted correctly.');
            });
        });
    }(testSpec));
});
