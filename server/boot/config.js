var config = require('ez-config-loader')('config/ibuildweb');
module.exports = function(server) {
    server.get('/config', function(req, res) {
        res.send(config);
        console.log('-==--=' + config);
    })
};
