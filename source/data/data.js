var fs = require('fs');
var yaml = require('js-yaml');

var charactersLegendary = yaml.load(fs.readFileSync(__dirname + '/charas.yaml'));
var charactersEpic = yaml.load(fs.readFileSync(__dirname + '/charas-epic.yaml'));
var charactersRare = yaml.load(fs.readFileSync(__dirname + '/charas-rare.yaml'));
var charactersCommon = yaml.load(fs.readFileSync(__dirname + '/charas-common.yaml'));
var characters = [].concat(...charactersLegendary);

var stats = yaml.load(fs.readFileSync(__dirname + '/stats.yaml'));
var traits = yaml.load(fs.readFileSync(__dirname + '/traits.yaml'));
var skills = yaml.load(fs.readFileSync(__dirname + '/skills.yaml'));
var glossary = yaml.load(fs.readFileSync(__dirname + '/glossary.yaml'));

function getStats(character) {
  var arr = stats[character.name].split(/\s*,\s*/);
  arr.push((character.role == 'Seeker') ? 5 : 3);
  var result = {};
  ['P.ATK', 'M.ATK', 'P.DEF', 'M.DEF', 'HP', 'SPD', 'MOV'].forEach((name, idx) => {
    result[name] = arr[idx];
  });
  return result;
}

function getKeywords(text) {
  var keywords = text.match(/\[\[.+?\]\]/g);
  if (keywords) {
    var obj = null;
    keywords.forEach(keyword => {
      var trimmed = keyword.replaceAll(/[\[\]]/g, '');
      var name = decorate(keyword);
      var description = decorate(glossary[trimmed]);
      if (description) {
        if (!obj) {
          obj = {};
        }
        obj[name] = description;
      }
    });
    return obj;
  }
  return null;
}

function decorate(text) {
  if (!text) {
    return text;
  }
  return text
    .replaceAll(/\[\[\+(.+?)\]\]/g, '<b>[<span class="green">▲</span><b class="gold">$1</b>]</b>')
    .replaceAll(/\[\[\-(.+?)\]\]/g, '<b>[<span class="red">▼</span><b class="gold">$1</b>]</b>')
    .replaceAll(/\[\[\x(.+?)\]\]/g, '<b>[<i class="ri-forbid-2-line red"></i><b class="gold">$1</b>]</b>')
    .replaceAll(/\[\[(.+?)\]\]/g, '<b>[<b class="gold">$1</b>]</b>')

    .replaceAll(/\<\<\+(.+?)\>\>/g, '<b class="green">$1</b>')
    .replaceAll(/\<\<(.+?)\>\>/g, '<b class="red">$1</b>')

    // .replaceAll(/\((.+?)\)/g, '<span class="is-inline-block">(<span class="is-inline-block bold">$1</span>)</span>')

    // .replaceAll(/(P.DMG|P.ATK)/g, '<span class="is-inline-block"><img class="image is-inline-block" src="images/attr/patk.png" />$1</span>')
    // .replaceAll(/(M.DMG|M.ATK)/g, '<span class="is-inline-block"><img class="image is-inline-block" src="images/attr/matk.png" />$1</span>')
    // .replaceAll(/ (P.DEF)/g, ' <span class="is-inline-block"><img class="image is-inline-block" src="images/attr/pdef.png" />$1</span>')
    // .replaceAll(/ (M.DEF)/g, ' <span class="is-inline-block"><img class="image is-inline-block" src="images/attr/mdef.png" />$1</span>')

    .replaceAll('"Sword of Convallaria"', '<span class="is-inline-block">"<img class="image is-inline-block" src="images/faction/sword-of-convallaria.webp" />Sword of Convallaria"</span>');
}

function getSkillRarity(skillName) {
  if (charactersHaveSkill(charactersCommon, skillName)) {
    return 'Common';
  } else if (charactersHaveSkill(charactersRare, skillName)) {
    return 'Rare';
  } else if (charactersHaveSkill(charactersEpic, skillName)) {
    return 'Epic';
  } else if (charactersHaveSkill(charactersLegendary, skillName)) {
    return 'Legendary';
  }
  return 'Unknown';
}

function charactersHaveSkill(characters, skillName) {
  for (let i = 0; i < characters.length; i++) {
    for (const rank in characters[i].skills) {
      if (rank === 'Trait') {
        if (characters[i].skills[rank] === skillName) {
          return true;
        }
      } else {
        for (let j = 0; j < characters[i].skills[rank].length; j++) {
          if (characters[i].skills[rank][j] === skillName) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

// decorate skill/trait descriptions
for (const key in traits) {
  for (let i = 0; i < traits[key].description.length; i++) {
    if (i === 0) {
      traits[key].keywords = getKeywords(traits[key].description[i]);
    }
    traits[key].description[i] = decorate(traits[key].description[i]);
  }
}
for (const skillName in skills) {
  skills[skillName].keywords = getKeywords(skills[skillName].description);
  skills[skillName].description = decorate(skills[skillName].description);
  // skills[skillName].rarity = getSkillRarity(skillName);
}

// map trait/skill objects into characters object
characters.forEach(character => {
  character.stats = getStats(character);

  character.factions = character.factions.sort((a, b) => (a < b) ? -1 : 1);
  for (const rank in character.skills) {
    if (rank === 'Trait') {
      var trait = traits[character.name];
      if (trait) {
        character.skills[rank] = trait.description.map((description, i) => {
          return {
            name: trait.name,
            type: 'Trait',
            keywords: trait.keywords,
            rarity: 'epic',
            description,
            tabs: ['Lv.1', 'Lv.2', 'Lv.3', 'Lv.4', 'Lv.5'],
            tabId: 'Lv.' + (i + 1)
          };
        })
      }
    } else {
      character.skills[rank] = character.skills[rank].map(skillName => {
        return {
          ...{
            name: skillName
          },
          ...skills[skillName]
        };
      });
    }
  }
});

module.exports.characters = characters;