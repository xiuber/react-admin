const result = {};
const req = require.context('./', true, /\.js$/);

req.keys().forEach(key => {
    if ([
        './index.js',
    ].includes(key)) return;

    const model = req(key);
    const keys = key.split('/');
    let fileName = keys.pop().replace('.js', '');

    result[fileName] = model.default;
});

export default result;
