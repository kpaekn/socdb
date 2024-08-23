var fs = require('fs');
var yaml = require('js-yaml');
var charactersLegendary = yaml.load(fs.readFileSync(__dirname + '/data/characters-legendary.yaml'));
var charactersEpic = yaml.load(fs.readFileSync(__dirname + '/data/characters-epic.yaml'));
var charactersRare = yaml.load(fs.readFileSync(__dirname + '/data/characters-rare.yaml'));
var charactersCommon = yaml.load(fs.readFileSync(__dirname + '/data/characters-common.yaml'));
console.log(charactersLegendary, charactersEpic);
var characters = [].concat(...charactersLegendary, ...charactersEpic, ...charactersRare, ...charactersCommon);
var attributes = yaml.load(fs.readFileSync(__dirname + '/data/attributes.yaml'));
var traits = yaml.load(fs.readFileSync(__dirname + '/data/traits.yaml'));
var skills = yaml.load(fs.readFileSync(__dirname + '/data/skills.yaml'));
var glossary = yaml.load(fs.readFileSync(__dirname + '/data/glossary.yaml'));

function getKeywords(text) {
  var keywords = text.match(/\[\[.+?\]\]/g);
  if (keywords) {
    var obj = {};
    keywords.forEach(keyword => {
      var trimmed = keyword.replaceAll(/[\[\]]/g, '');
      var decoratedThenTrimmed = decorate(keyword).replaceAll(/[\[\]]/g, '');
      obj[decoratedThenTrimmed] = decorate(glossary[trimmed]);
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
    .replaceAll(/\[\[\+(.+?)\]\]/g, '<span class="keyword"><i class="ri-arrow-up-double-line green"></i>$1</span>')
    .replaceAll(/\[\[\-(.+?)\]\]/g, '<span class="keyword"><i class="ri-arrow-down-double-line red"></i>$1</span>')
    .replaceAll(/\[\[\x(.+?)\]\]/g, '<span class="keyword"><i class="ri-forbid-2-line red"></i>$1</span>')
    .replaceAll(/\[\[(.+?)\]\]/g, '<span class="keyword">$1</span>')

    .replaceAll(/\<\<\+(.+?)\>\>/g, '<span class="is-inline-block green bold">$1</span>')
    .replaceAll(/\<\<(.+?)\>\>/g, '<span class="is-inline-block red bold">$1</span>')

    .replaceAll(/\((.+?)\)/g, '<span class="is-inline-block">(<span class="is-inline-block bold">$1</span>)</span>')

    .replaceAll(/(P.DMG|P.ATK)/g, '<span class="is-inline-block"><img class="image is-inline-block" src="images/attr/patk.png" />$1</span>')
    .replaceAll(/(M.DMG|M.ATK)/g, '<span class="is-inline-block"><img class="image is-inline-block" src="images/attr/matk.png" />$1</span>')
    .replaceAll(/ (P.DEF)/g, ' <span class="is-inline-block"><img class="image is-inline-block" src="images/attr/pdef.png" />$1</span>')
    .replaceAll(/ (M.DEF)/g, ' <span class="is-inline-block"><img class="image is-inline-block" src="images/attr/mdef.png" />$1</span>')

    .replaceAll('"Sword of Convallaria"', '<span class="is-inline-block">"<img class="image is-inline-block" src="images/faction/sword-of-convallaria.webp" />Sword of Convallaria"</span>');
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
for (const key in skills) {
  skills[key].keywords = getKeywords(skills[key].description);
  skills[key].description = decorate(skills[key].description);
}

// map trait/skill objects into characters object
characters.forEach(character => {
  character.attributes = attributes[character.name];
  for (const rank in character.skills) {
    if (rank === 'Trait') {
      var traitName = character.skills[rank];
      if (traits[traitName]) {
        character.skills[rank] = traits[traitName].description.map((description, i) => {
          return {
            name: traitName,
            type: 'Trait',
            keywords: traits[traitName].keywords,
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