const result = {};
const req = require.context('./', false, /\.js$/);

req.keys().forEach(key => {
    if ([
        './index.js',
    ].includes(key)) return;

    const model = req(key);
    let fileName = key.replace('./', '').replace('.js', '');
    result[fileName] = model.default;
});

export default result;
