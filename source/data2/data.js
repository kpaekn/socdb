var fs = require('fs');
var yaml = require('js-yaml');

var charaLegendary = yaml.load(fs.readFileSync(__dirname + '/charas.yaml'));
var charaEpic = yaml.load(fs.readFileSync(__dirname + '/charas-epic.yaml'));
var charaRare = yaml.load(fs.readFileSync(__dirname + '/charas-rare.yaml'));
var charaCommon = yaml.load(fs.readFileSync(__dirname + '/charas-common.yaml'));
var characters = [].concat(...charaLegendary, ...charaEpic, ...charaRare, ...charaCommon);
var stats = yaml.load(fs.readFileSync(__dirname + '/stats.yaml'));
var skills = require('./skills');

function getStats(character) {
  var arr = stats[character.name].split(/\s*,\s*/);
  arr.push((character.role == 'Seeker') ? 5 : 3);
  var result = {};
  ['P.ATK', 'M.ATK', 'P.DEF', 'M.DEF', 'HP', 'SPD', 'MOV'].forEach((name, idx) => {
    result[name] = arr[idx];
  });
  return result;
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
        const typedNames = ['Melee', 'Ranged', 'Curved', 'Magic'];
        for (let i = 0; i < typedNames.length; i++) {
          var typedName = skillName + ` (${typedNames[i]})`;
          if (skills[typedName]) {
            return skills[typedName];
          }
        }
        console.log('missing skill:', skillName);
        return null;
      }
      return skills[skillName];
    });
  }
});

characters = characters.sort((a, b) => (a.name < b.name) ? -1 : 1);
module.exports.characters = characters;