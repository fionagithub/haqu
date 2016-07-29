var config = require('ez-config-loader')('fileConfig/ams');
module.exports = function(server) {
    server.get('/config', function(req, res) {
        res.send(config);
        console.log('-==--=' + config);
    })
};
