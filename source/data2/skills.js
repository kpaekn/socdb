var fs = require('fs');

var skills = JSON.parse(fs.readFileSync(__dirname + '/skills.json'));

var mappedSkills = {};
skills.forEach(skill => {
  if (mappedSkills[skill.name]) {
    console.log('found duplicate skill:', skill.name);
  }
  mappedSkills[skill.name] = skill;
});

module.exports = mappedSkills;