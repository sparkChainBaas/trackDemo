/**
 * Created by heipacker on 2016/11/29.
 */
'use strict';
process.env.TZ = 'Asia/Shanghai';

process.on('uncaughtException', function(err) {
    // 记录日志
    console.log(err);
    // 结束进程
    process.exit(1);
});

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var timeMonitor = require('./modules/common/TimeMointor');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(timeMonitor());
app.use(logger());

app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes');
routes(app);

app.use(function (err, req, res, next) {
    console.error(process.domain ? process.domain.id : "", req.ip, req.method, req.originalUrl, err);
    res.status(err.status || err.code || 500).send({
        code: err.code || err.status || 500,
        data: err.message
    }).end();
});

module.exports = app;
