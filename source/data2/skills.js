var fs = require('fs');

var skills = JSON.parse(fs.readFileSync(__dirname + '/skills.json'));

var mappedSkills = {};
skills.forEach(skill => {
  if (mappedSkills[skill.name]) {
    console.log('found duplicate skill:', skill.name);
  }
  mappedSkills[skill.name] = skill;
});

for (const name in mappedSkills) {
  // if (mappedSkills[name].type === 'Basic Attack') {
  //   mappedSkills[name].name = mappedSkills[name].name.replaceAll(/ \((Melee|Magic|Ranged|Curved)\)/g, '');
  // }
}

module.exports = mappedSkills;