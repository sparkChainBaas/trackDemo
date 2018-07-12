var RedisClustr = require('redis-clustr');
var redis = require('redis');
//var config = require('config');

var redisClient;

redisClient = redis.createClient((process.env.REDIS_PORT || 6379), (process.env.REDIS_URL || "127.0.0.1"));
console.log("redis startup connect info %s:%s", (process.env.REDIS_URL || "127.0.0.1"),(process.env.REDIS_PORT || 6379));

module.exports = redisClient;