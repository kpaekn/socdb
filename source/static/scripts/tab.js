$(document).ready(function () {
    console.log('ready');
    $('a[data-tab]').click(function (e) {
        var tab = $(e.currentTarget).data('tab');
        var tabGroup = $(e.currentTarget).data('tab-group');
        if (tab && tabGroup) {
            $('[data-tab-group="' + tabGroup + '"]').addClass('is-hidden');
            $('[data-tab="' + tab + '"]').removeClass('is-hidden');
        }
    });
});