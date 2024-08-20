var fs = require('fs');
var characters = JSON.parse(fs.readFileSync(__dirname + '/data/characters.json'));
var traits = JSON.parse(fs.readFileSync(__dirname + '/data/traits.json'));
var skills = JSON.parse(fs.readFileSync(__dirname + '/data/skills.json'));

function decorate(text) {
  return text
    .replaceAll(/\[\[\-(.+?)\]\]/g, '[<a class="gold bold"><i class="ri-arrow-down-double-line red"></i>$1</a>]')
    .replaceAll(/\[\[\+(.+?)\]\]/g, '[<a class="gold bold"><i class="ri-arrow-up-double-line green"></i></i>$1</a>]')
    .replaceAll(/\[\[(.+?)\]\]/g, '[<a class="gold bold">$1</a>]')
    .replaceAll(/\<\<\+(.+?)\>\>/g, '<span class="green bold">$1</span>')
    .replaceAll(/\<\<(.+?)\>\>/g, '<span class="red bold">$1</span>')
    .replaceAll(/\((.+?)\)/g, '(<span class="bold">$1</span>)')
    .replaceAll('P.DMG', '<img class="image is-inline-block is-16x16" src="images/attr/patk.png" />P.DMG')
    .replaceAll('"Sword of Convallaria"', '"<img class="image is-inline-block is-16x16" src="images/faction/sword-of-convallaria.webp" />Sword of Convallaria"');
}

// decorate skill/trait descriptions
for (const key in traits) {
  for (let i = 0; i < traits[key].length; i++) {
    traits[key][i] = decorate(traits[key][i]);
  }
}
for (const key in skills) {
  skills[key].description = decorate(skills[key].description);
}

// map trait/skill objects into characters object
characters.forEach(character => {
  character.skillsByRank.forEach(rankedSkill => {
    if (rankedSkill.isTrait) {
      rankedSkill.skills = traits[rankedSkill.skill].map((description, i) => {
        var skillObj = {
          type: "Trait Lv." + (i+1),
          description
        };
        if (i == 0) {
          skillObj.name = rankedSkill.skill
        }
        return skillObj;
      });
    } else {
      rankedSkill.skills = rankedSkill.skills.map(skillName => {
        return {...{name: skillName}, ...skills[skillName]};
      });
    }
  });
});

module.exports.characters = characters;