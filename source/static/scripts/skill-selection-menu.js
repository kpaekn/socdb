$(document).ready(function () {
    $('a[data-rank]').click(function (e) {
        var rank = $(e.currentTarget).data('rank');

        var selectedContainer = $(e.currentTarget).parent('.skill-image-container');
        var allContainers = $('.skill-image-container');
        allContainers.removeClass('is-selected');
        selectedContainer.addClass('is-selected');

        var allTraitGroups = $(`.trait-group`);
        var selectedTraitGroup = $(`.trait-group[data-rank="${rank}"]`)
        allTraitGroups.addClass('is-hidden');
        selectedTraitGroup.removeClass('is-hidden');
    });
});