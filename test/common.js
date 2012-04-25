$.fn.normalizedHtml = function() {
    return $(this).get(0).innerHTML.replace(/&shy;/g, '\u00AD').replace(/(<[^>]+>)/g, function(match) {
        return match.toLowerCase().replace(/class=([^">]+)/, "class=\"$1\"");
    });
};