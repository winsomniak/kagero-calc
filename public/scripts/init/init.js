/*
 * Legacy Globals
 */
var data;
var weaponInfo;
var specialInfo;
var assistInfo;
var skillInfo;
var supportInfo;
var refinementsInfo;
var blessingsInfo;
var imageUrl = 'https://kagerochart.com';

// stat total upper limit
var HIGHESTSTAT = 99;

// index of the selected characters
var selectedAttacker = 0;
var selectedDefender = 0;

// character slots
var attackerTeam = [{}, {}, {}, {}, {}];
var defenderTeam = [{}, {}, {}, {}, {}];

// matchup table info
var previousTable = true; // true if one vs all, false if all vs one
var keepTable = false;    // true if we keep the matchup table currently displayed

// sorted matchup table column
var mTableSorted = -1;
var mSortDesc = true; // sort in descending order?

// true if battle log is open, false otherwise
var openLog = true;

// stat growth amounts from lvl 1 to lvl 40
var statGrowths = [
    [6, 8, 9, 11, 13, 14, 16, 18, 19, 21, 23, 24, 26],
    [7, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 26, 28],
    [7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31],
    [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 31, 33],
    [8, 10, 13, 15, 17, 19, 22, 24, 26, 28, 30, 33, 35]
];

// default states
var defaultAttacker = true;
var defaultDefender = true;

// prevent filterMatchups function from being called multiple times when resetting filters
var resetFilterLock = false;

// use to fix filters bug
var initFilters = true;

var data = JSON.parse(document.getElementById('data').textContent);

weaponInfo = data.weapons;
specialInfo = data.specials;
assistInfo = data.assists;
skillInfo = data.passives;
refinementsInfo= data['refinements'];
blessingsInfo= data['blessings'];
supportInfo = data['support-bonus'];
charInfo = data.heroes;
charInfo.Custom = {
    "display": "Custom",
    "id": "Custom",
    "name": "Custom"
};
document.onreadystatechange = function() {
    setupCalc();
}

function setupCalc() {

    var tabEls = document.querySelectorAll('.mdc-tab-bar');

    var tabBars = [];
    tabEls.forEach(function(el, key) {
        var bar = new mdc.tabs.MDCTabBar(el);
        bar.preventDefaultOnClick = true;
        bar.listen('MDCTabBar:change', function (t) {
            var dynamicTabBar = t.detail;
            var nthChildIndex = dynamicTabBar.activeTabIndex;

            var selector = '#attack-panel';

            if (el.id === 'override-tab-bar') {
                selector = '#matchup-overrides';
            }
            else if (el.id === 'char-tab-bar-2') {
                selector = '#defend-panel';
            }
            var panels = document.querySelector(selector + ' .mdc-card__media');

            updatePanel(panels, nthChildIndex);
        });

        tabBars.push(bar);
    });

    var tfs = document.querySelectorAll('.mdc-text-field');
    tfields = [];
    for (var i = 0, tf; tf = tfs[i]; i++) {
        var textField = new mdc.textField.MDCTextField(tf);
        tfields.push(textField);
    }

    try {
        updatePanel(document.querySelector('#attack-panel .mdc-card__media'), 0);
        updatePanel(document.querySelector('#defend-panel .mdc-card__media'), 0);
        updatePanel(document.querySelector('#matchup-overrides .mdc-card__media'), 0);
    }
    catch(err) {
        console.log('Panel query failed');
    }

    $("#matchup-filters").hide();
    $("#matchup-overrides").hide();
    $("#matchups").hide();

    // setup initial display
    setupChars();
    setupOverrides();

}

function updatePanel(panels, index) {
    var activePanel = panels.querySelector('.tab-panel.active');
    var newActivePanel = panels.querySelector('.tab-panel:nth-child(' + (index + 1) + ')');

    if (activePanel) {
      activePanel.classList.remove('active');
      activePanel.style.display = 'none';
    }

    if (newActivePanel) {
      newActivePanel.classList.add('active');
      newActivePanel.style.display = 'block';
    }
}
