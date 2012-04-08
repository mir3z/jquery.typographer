$(document).ready(function() {
    var $sandbox = $('#sandbox');

    module('typographer', {
        teardown: function() {
            $sandbox.empty();
        }
    });

    test('Initialization', function() {
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
});
