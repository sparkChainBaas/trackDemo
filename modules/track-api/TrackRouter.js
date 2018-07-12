var SparkchainRequest = require('../sparkchain-api/SparkchainRequest');
var TrackRequest = require('./TrackRequest');

module.exports = function (app) {

    app.post('/track/add', function (req, res, next) {
        TrackRequest.addTrackData(req, function (err, result) {
            if (err) {
                res.send({
                    success: false,
                    status_code: err.code,
                    message: err.message
                });
            } else {
                res.send({
                    code: 0,
                    data: result
                });
            }
        });
    });

    app.get('/track/list', function (req, res, next) {
        TrackRequest.searchTrackData(req, function (err, result) {
            if (err) {
                res.send({
                    success: false,
                    status_code: err.code,
                    message: err.message
                });
            } else {
                res.send({
                    code: 0,
                    data: result
                });
            }
        });
    });
};