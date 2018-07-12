const request = require('request');
const stringformat = require('stringformat');
var uuid = require('uuid');


const ACCESS_TOKEN_PATH = '/app/access';
const ADD_TEXT_PATH = '/text/record';

const HTTP_SUCCESS_CODE = 200;

var Utils = require('../common/Utils');
var config = require('./SparkchainConfig');

var apiRequest = {
    /**============================================状态接口===================================================**/
    /**
     * 从BAAS服务器，获取accessToken
     * @param callback
     */
    getAccessTokenFromServer: function (callback) {
        var url = config.api.url + config.api.version + ACCESS_TOKEN_PATH;
        var appItem = {
            appid: config.api.appid,
            appsecret: config.api.appsecret
        };
        var options = {
            method: 'POST',
            url: url,
            headers: {'Connection': 'close'},
            // json: true,
            form: appItem
        };
        var timestamp = Date.now();
        console.log(JSON.stringify(options));
        request(options, function (err, res, data) {
            console.log("request accessToken elapsed", Date.now() - timestamp, "mills");
            if (err) {
                console.log("request accessToken error", err);
                return callback(new Error(err));
            }
            // callback(null, data);
            if (res.statusCode === HTTP_SUCCESS_CODE) {
                if (data){
                    data = JSON.parse(data);
                    if (data.success) {
                        callback(null, data.data.accessToken);
                    } else {
                        console.log("request accessToken error data", data);
                        callback(new Error(JSON.stringify(res.body)));
                    }
                }
            } else {
                console.log("request accessToken error", JSON.stringify(res.body));
                callback(new Error(JSON.stringify(res.body)));
            }
        });
    },

    textRecord: function (record, callback) {
        var url = config.api.url + config.api.version + ADD_TEXT_PATH;
        var options = {
            method: 'POST',
            url: url,
            headers: {'Connection': 'close'},
            // json: true,
            form: record
        };
        var timestamp = Date.now();
        console.log(JSON.stringify(options));
        request(options, function (err, res, data) {
            console.log("text record elapsed", Date.now() - timestamp, "mills");
            if (err) {
                console.log("text record error", err);
                return callback(new Error(err));
            }
            // callback(null, data);
            if (res.statusCode === HTTP_SUCCESS_CODE) {
                if (data){
                    data = JSON.parse(data);
                    if (data.success) {
                        callback(null, data.data);
                    } else {
                        console.log("text record data", data);
                        callback(new Error(JSON.stringify(res.body)));
                    }
                }
            } else {
                console.log("text record", JSON.stringify(res.body));
                callback(new Error(JSON.stringify(res.body)));
            }
        });
    },

    /**============================================订阅接口===================================================**/
    /**
     * 订阅交易信息
     * @param address
     * @param secret
     */
    getWebsocket: function (address, secret, callback) {
        var WebSocket = require('ws');
        callback(null, new WebSocket(config.api.wss_url));
    }
};

module.exports = apiRequest;