var fs = require('fs');
var yaml = require('js-yaml');

var basicSkills = yaml.load(fs.readFileSync(__dirname + '/skills-basic.yaml'));
for (const name in basicSkills) {
  basicSkills[name].type = 'Basic Attack';
}

var reactionSkills = yaml.load(fs.readFileSync(__dirname + '/skills-reaction.yaml'));
for (const name in reactionSkills) {
  reactionSkills[name].type = 'Reaction';
}

var passiveSkills = yaml.load(fs.readFileSync(__dirname + '/skills-passive.yaml'));
var leaderSkills = yaml.load(fs.readFileSync(__dirname + '/skills-leader.yaml'));
var otherSkills = yaml.load(fs.readFileSync(__dirname + '/skills.yaml'));
var skills = { ...otherSkills, ...passiveSkills, ...leaderSkills }
for (const name in skills) {
  skills[name].type = 'Skill';
}

module.exports = { ...basicSkills, ...reactionSkills, ...skills };