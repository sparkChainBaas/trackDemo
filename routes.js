 /**
 * routes - the router of url request
 */
var TrackRouter = require('./modules/track-api/TrackRouter');

module.exports = function (app) {
    TrackRouter(app);
};