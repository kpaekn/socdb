var fs = require('fs');
var yaml = require('js-yaml');

var charactersLegendary = yaml.load(fs.readFileSync(__dirname + '/charas.yaml'));
var charactersEpic = yaml.load(fs.readFileSync(__dirname + '/charas-epic.yaml'));
var charactersRare = yaml.load(fs.readFileSync(__dirname + '/charas-rare.yaml'));
var charactersCommon = yaml.load(fs.readFileSync(__dirname + '/charas-common.yaml'));
var characters = [].concat(...charactersLegendary);

var stats = yaml.load(fs.readFileSync(__dirname + '/stats.yaml'));
var traits = yaml.load(fs.readFileSync(__dirname + '/traits.yaml'));

var skills = require('./skills');

var glossary = yaml.load(fs.readFileSync(__dirname + '/glossary.yaml'));
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

function getKeywords(text) {
  if (!text) return text;
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

function decorateV2(text) {
  if (!text) return text;

  // bold [keywords]
  text = text.replaceAll(/\[+(.+?)\]+/g, (_, matchedGroup) => {
    var replacement = (() => {
      if (matchedGroup.startsWith('+')) {
        return `<b>[<b class="green">▲</b><b class="gold">${matchedGroup.substring(1)}</b>]</b>`;
      } else if (matchedGroup.startsWith('-')) {
        return `<b>[<b class="red">▼</b><b class="gold">${matchedGroup.substring(1)}</b>]</b>`;
      } else if (matchedGroup.startsWith('x')) {
        return `<b>[<i class="ri-forbid-2-line red"></i><b class="gold">${matchedGroup.substring(1)}</b>]</b>`;
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
    traits[key].description[i] = decorateV2(traits[key].description[i]);
  }
}
for (const skillName in skills) {
  skills[skillName].keywords = getKeywords(skills[skillName].description);
  skills[skillName].description = decorateV2(skills[skillName].description);
  // skills[skillName].rarity = getSkillRarity(skillName);
}

// map trait/skill objects into characters object
characters.forEach(character => {
  character.stats = getStats(character);
  if (character.factions) character.factions = character.factions.sort((a, b) => (a < b) ? -1 : 1);
  character.trait = traits[character.name];

  for (const rank in character.skills) {
    character.skills[rank] = character.skills[rank].map(skillName => {
      if (!skillName) {
        return null;
      }
      if (!skills[skillName]) {
        console.log('missing skill:', skillName);
      }
      return {
        ...{
          name: skillName
        },
        ...skills[skillName]
      };
    });
  }
});

module.exports.characters = characters;