$(document).ready(function() {
    var $sandbox = $('#sandbox');

    module('typographer', {
        teardown: function() {
            teardownSandbox($sandbox);
        }
    });

    test('Initialization', function() {
        ok(jQuery(), 'jQuery is loaded');
        ok(jQuery().typographer, 'typograher is loaded');
        ok(jQuery().typographer_hyphen, 'typographer.hyphen is loaded');
        ok(jQuery().typographer_orphan, 'typographer.orphan is loaded');
        ok(jQuery().typographer_punctuation, 'typographer.punctuation is loaded');

        $sandbox.typographer({
            modules: ['hyphen', 'orphan', 'punctuation']
        });

        ok($.fn.typographer.defaults, '$.fn.typographer.defaults present');
        ok($sandbox.hasClass($.fn.typographer.defaults.contextClass),
              'Context has valid class');
    });
});
