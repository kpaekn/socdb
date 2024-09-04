const fs = require('fs');
const webp = require('webp-converter');

const dir = __dirname + '/source/static/images2/skill';
const files = fs.readdirSync(dir);
const tasks = [];
files.forEach(file => {
    if (file.endsWith('.png')) {
        tasks.push(webp.cwebp(
            dir + '/' + file,
            dir + '/' + file.replace('.png', '.webp'),
            "-q 80",
            logging = "-v",
        ));
    }
});

Promise.all(tasks).then(() => {
    console.log('done');
});
