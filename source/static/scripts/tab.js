function openTab(tabGroup, tabId) {
    var group = document.querySelectorAll('[data-tab="' + tabGroup + '"]');
    var tab = document.querySelector('[data-tab-id="' + tabId + '"]');

    group.forEach(el => {
        el.className += ' is-hidden';
    });
    tab.className = tab.className.replaceAll('is-hidden', '').trim();
}