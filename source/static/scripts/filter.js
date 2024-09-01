$(document).ready(function () {
    var charaItems = $('.chara-container .chara-item');
    var toggles = $('.filter a')

    var showHideCharaItems = () => {
        var selectedRarityToggles = $('.filter a[data-rarity].is-selected');
        var selectedRarities = selectedRarityToggles.map((_, el) => {
            return $(el).data('rarity');
        }).get();

        var selectedRoleToggles = $('.filter a[data-role].is-selected');
        var selectedRoles = selectedRoleToggles.map((_, el) => {
            return $(el).data('role');
        }).get();

        charaItems.each((_, el) => {
            var rarity = $(el).data('rarity');
            var role = $(el).data('role')
            var hasRarity = (selectedRarities.length === 0) || selectedRarities.indexOf(rarity) !== -1;
            var hasRole = (selectedRoles.length === 0) || selectedRoles.indexOf(role) !== -1;
            if (hasRarity && hasRole) {
                $(el).removeClass('is-hidden');
            } else {
                $(el).addClass('is-hidden');
            }
        });
    };

    toggles.click((e) => {
        var currentToggle = $(e.currentTarget);
        if (currentToggle.hasClass('is-selected')) {
            currentToggle.removeClass('is-selected');
        } else {
            currentToggle.addClass('is-selected');
        }
        showHideCharaItems();
    });
});