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

        var selectedFactionToggles = $('.filter a[data-faction].is-selected');
        var selectedFactions = selectedFactionToggles.map((_, el) => {
            return $(el).data('faction');
        }).get();

        charaItems.each((_, el) => {
            var rarity = $(el).data('rarity');
            var role = $(el).data('role')
            var factions = $(el).data('factions').split(/\s*,\s*/);
            var hasRarity = (selectedRarities.length === 0) || selectedRarities.indexOf(rarity) !== -1;
            var hasRole = (selectedRoles.length === 0) || selectedRoles.indexOf(role) !== -1;
            console.log(factions, selectedFactions);
            [].every
            var hasAllFactions = (selectedFactions.length === 0) || (() => {
                var hasAll = selectedFactions.every(selectedFaction => {
                    return factions.indexOf(selectedFaction) !== -1;
                });
                return hasAll;
            })();
            console.log(hasAllFactions);
            if (hasRarity && hasRole && hasAllFactions) {
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

    var factionImages = $('.faction-image');
    $('input#faction-checkbox').change((e) => {
        var checked = e.currentTarget.checked;
        if (checked) {
            factionImages.addClass('show-faction-image');
        } else {
            factionImages.removeClass('show-faction-image');
        }
    });
});