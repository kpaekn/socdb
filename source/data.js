var fs = require('fs');
var characters = JSON.parse(fs.readFileSync(__dirname + '/data/characters.json'));

function decorate(text) {
  return text
    .replaceAll(/\[\[\-(.+?)\]\]/g, '[<a class="gold bold"><i class="ri-arrow-down-double-line red"></i>$1</a>]')
    .replaceAll(/\[\[\+(.+?)\]\]/g, '[<a class="gold bold"><i class="ri-arrow-up-double-line green"></i></i>$1</a>]')
    .replaceAll(/\[\[(.+?)\]\]/g, '[<a class="gold bold">$1</a>]')
    .replaceAll(/\<\<\+(.+?)\>\>/g, '<span class="green bold">$1</span>')
    .replaceAll(/\<\<(.+?)\>\>/g, '<span class="red bold">$1</span>')
    .replaceAll('P.DMG', '<img class="image is-inline-block is-16x16" src="images/attr/patk.png" />P.DMG')
    .replaceAll('"Sword of Convallaria"', '"<img class="image is-inline-block is-16x16" src="images/faction/sword-of-convallaria.webp" />Sword of Convallaria"');
}

characters.forEach(character => {
  character.skillsByRank.map(rankedSkill => {
    return rankedSkill.skills.map(skill => {
      skill.description = decorate(skill.description);
      return skill;
    });
  });
});

module.exports.characters = characters;