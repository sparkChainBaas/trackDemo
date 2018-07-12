var Async = require('async');
var ApplicationErr = require('../error/ApplicationError');
var config = require('../sparkchain-api/SparkchainConfig');

var Utils = require('../common/Utils');
var RKG = require('../common/RedisKeyGenerator');
var RedisClient = require('../common/RedisClient');
var SparkchainRequest = require('../sparkchain-api/SparkchainRequest');
var uuid = require('uuid');

var trackRequest = {

    /**
     * 获取accessToken
     * @param callback
     */
    getAccessToken: function (callback) {
        //到redis里面取accesstoken
        var key = RKG.generateAccessTokenKey();
        RedisClient.get(key, function (err, accessToken) {
            //取到了，直接返回
            if (!!accessToken){
                return callback(null, accessToken);
            }
            //没取到，再从服务器去申请
            SparkchainRequest.getAccessTokenFromServer(function (err, newAccessToken) {
                if (err){
                    return callback(new ApplicationErr('获取AccessToken失败', 505, 1))
                }
                if (!newAccessToken){
                    return callback(new ApplicationErr('获取AccessToken失败', 505, 1))
                }
                //写到redis里面，2小时有效，设为1小时超时
                RedisClient.setex(key, 60 * 60, newAccessToken);
                callback(null, newAccessToken);
            })
        });
    },

    addTrackData: function(req, callback){
        var params = req.body;
        var tracker = params.tracker;
        var event = params.event;
        var trackObjStr = params.trackObjs;
        var trackDatas = [];
        var trackObjs = [];
        var trackData = {};
        var accessToken =  null;

        if (!tracker) {
            return callback(new ApplicationErr('没有定位者数据', 501, 1));
        }
        if (!trackObjStr) {
            return callback(new ApplicationErr('没有定位对象数据', 501, 2));
        }
        trackObjs = trackObjStr.split(',');

        Async.waterfall([
            function (callback) {
                trackRequest.getAccessToken(function (err, token) {
                    if (err) {
                        return callback(new ApplicationError("记录流水失败", 400, 3));
                    }
                    accessToken = token;
                    callback(null, accessToken);
                });
            },
            function (accessToken, callback) {
                var i = 0;
                var tempObjs = [];
                trackObjs.forEach(function (obj) {
                    if (i == 0) {
                        trackData = {
                            tracker: tracker,
                            event: event
                        };
                        tempObjs = [];
                    }

                    tempObjs.push(obj);
                    i++;

                    if (i == 5){
                        trackData.trackObjs = tempObjs;
                        trackDatas.push(trackData);
                        i = 0;
                    }
                });
                trackData.trackObjs = tempObjs;
                trackDatas.push(trackData);
                callback(null, trackDatas);
            },
            function (trackDatas, callback) {
                var fns = [];
                for (var j = 0; j < trackDatas.length; j++) {
                    var fun = function (j) {
                        fns.push(function (callback) {
                            trackRequest._addRecord(trackDatas[j], accessToken, callback);
                        });
                    };
                    fun(j);
                }
                console.log('fns=' + JSON.stringify(fns[0]));
                Async.parallelLimit(fns, 5, function (err, list) {
                    callback(err, list);
                });
            }
        ], function (err, list) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            callback(null ,list);
        });
    },

    _addRecord: function(data, accessToken, callback){
        var record = {
            accessToken: accessToken,
            srcAccount: config.api.srcAccount,
            payPassword: config.api.srcSecret,
            chainCode: 'jingtumTest',
            tokenCode: 'SWT',
            destAccount: config.api.destAccount,
            memo: JSON.stringify(data),
            bizId: uuid.v1(),
            amount: 0.01
        };
        SparkchainRequest.textRecord(record, function (err, result){
            data.trackObjs.forEach(function(obj){
                var listKey = RKG.generateTrackObjHistoryKey(obj);
                // var statusKey = RKG.generateTrackObjStatusKey(obj);
                var info = {
                    tracker: data.tracker,
                    event: data.event,
                    time: new Date(),
                    hash: result.hash
                };
                RedisClient.rpush(listKey, JSON.stringify(info));
            });
            return callback(null, result);
        });
    },
    
    searchTrackData: function (req, callback) {
        var params = req.query;
        var searchKey = params.key;
        var listKey = RKG.generateTrackObjHistoryKey(searchKey);
        var histories = [];
        Async.waterfall([
            function (callback) {
                RedisClient.llen(listKey, function (err, len) {
                    callback(null, len);
                })
            },
            function (count, callback) {
                RedisClient.lrange(listKey, 0, count, function (err, list) {
                    list.forEach(function (item) {
                        var history = JSON.parse(item);
                        histories.push(history);
                    })
                    callback(null, histories);
                })
            }
        ], function (err, list) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            callback(null, list);
        });
    }
};

module.exports = trackRequest;