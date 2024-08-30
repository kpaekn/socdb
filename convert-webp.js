const fs = require('fs');
const webp=require('webp-converter');

const files = fs.readdirSync(__dirname + '/source/static/images/stat');
const tasks = [];
files.forEach(file => {
    if (file.endsWith('.png')) {
        tasks.push(webp.cwebp(
            __dirname + "/source/static/images/stat/" + file,
            __dirname + "/source/static/images/stat/" + file.replace('.png', '.webp'),
            "-q 80",
            logging="-v",
        ));
    }
});

Promise.all(tasks).then(() => {
    console.log('done');
});
