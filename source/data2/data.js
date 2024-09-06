var fs = require('fs');
var yaml = require('js-yaml');

var charaLegendary = yaml.load(fs.readFileSync(__dirname + '/charas.yaml'));
var charaEpic = yaml.load(fs.readFileSync(__dirname + '/charas-epic.yaml'));
var charaRare = yaml.load(fs.readFileSync(__dirname + '/charas-rare.yaml'));
var charaCommon = yaml.load(fs.readFileSync(__dirname + '/charas-common.yaml'));
var characters = [].concat(...charaLegendary, ...charaEpic, ...charaRare, ...charaCommon);
var stats = yaml.load(fs.readFileSync(__dirname + '/stats.yaml'));
var skills = require('./skills');

var blueKeywords = yaml.load(fs.readFileSync(__dirname + '/blue-keywords.yaml'));
blueKeywords = blueKeywords.concat(Object.keys(skills));

function getStats(character) {
  var arr = stats[character.name].split(/\s*,\s*/);
  arr.push((character.role == 'Seeker') ? 5 : 3);
  var result = {};
  ['P.ATK', 'M.ATK', 'P.DEF', 'M.DEF', 'HP', 'SPD', 'MOV'].forEach((name, idx) => {
    result[name] = arr[idx];
  });
  return result;
}

function decorate(text) {
  if (!text) return text;

  // bold [keywords]
  // [{x}Passive Skills]
  text = text.replaceAll(/\[(.+?)\]/g, (_, matchedGroup) => {
    var replacement = (() => {
      if (matchedGroup.startsWith('{+}')) {
        return `<b>[<b class="green">▲</b><b class="gold">${matchedGroup.substring(3)}</b>]</b>`;
      } else if (matchedGroup.startsWith('{-}')) {
        return `<b>[<b class="red">▼</b><b class="gold">${matchedGroup.substring(3)}</b>]</b>`;
      } else if (matchedGroup.startsWith('{x}')) {
        return `<b>[<i class="ri-forbid-2-line red"></i><b class="gold">${matchedGroup.substring(3)}</b>]</b>`;
      }
      if (blueKeywords.indexOf(matchedGroup) >= 0) {
        return `<b>[<b class="blue">${matchedGroup}</b>]</b>`;
      }
      return `<b>[<b class="gold">${matchedGroup}</b>]</b>`;
    })();
    // prefix numbers with x.
    // in the next replaceAll step, it will ignore numbers with x prefix
    return replacement.replaceAll(/(\d+)/g, 'x$1');
  });

  // bold numbers
  text = text.replaceAll(/[x+~]*\d+%*/g, (matchedWord) => {
    if (matchedWord.startsWith('x')) {
      return matchedWord.substring(1);
    } else if (matchedWord.startsWith('+')) {
      return `<b class="green">${matchedWord.substring(1)}</b>`;
    } else if (matchedWord.startsWith('~')) {
      return `<b class="purple">${matchedWord.substring(1)}</b>`;
    }
    return `<b class="red">${matchedWord}</b>`;
  });

  return text;
}

for (const name in skills) {
  skills[name].desc = decorate(skills[name].desc);
}

// map trait/skill objects into characters object
characters.forEach(character => {
  if (!character.image) character.image = [];
  character.stats = getStats(character);
  if (character.factions) character.factions = character.factions.sort((a, b) => (a < b) ? -1 : 1);
  character.trait = skills[character.trait];

  for (const rank in character.skills) {
    character.skills[rank] = character.skills[rank].map(skillName => {
      if (!skillName) {
        return null;
      }
      if (!skills[skillName]) {
        // const typedNames = ['Melee', 'Ranged', 'Curved', 'Magic'];
        // for (let i = 0; i < typedNames.length; i++) {
        //   var typedName = skillName + ` (${typedNames[i]})`;
        //   if (skills[typedName]) {
        //     return skills[typedName];
        //   }
        // }
        console.log('missing skill:', character.name, ':', skillName);
        return null;
      }
      return skills[skillName];
    });
  }
});

characters = characters.sort((a, b) => (a.name < b.name) ? -1 : 1);
module.exports.characters = characters;