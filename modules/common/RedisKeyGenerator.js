var redisKeyGenerator = {

    generateAccessTokenKey: function() {
        return 'spc_tracking_access_token';
    },

    generateTrackObjStatusKey: function(trackObj){
        return 'spc_track_obj_status_' + trackObj;
    },

    generateTrackObjHistoryKey: function(trackObj){
        return 'spc_track_obj_his_' + trackObj;
    }
};

module.exports = redisKeyGenerator;
