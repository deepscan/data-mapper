/*
 * Copyright (c) 2012-2015 S-Core Co., Ltd.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var dateFormat = require('dateformat');
var winston = require('winston');
var cluster = require('cluster');

function curTime() {
    return dateFormat(new Date(), 'yyyy-mm-dd hh:MM:ss-l');
}

var logger = null;

if (cluster.isMaster) {
    cluster.setupMaster({ silent: true });
            
    logger = new (winston.Logger) ({
        transports: [
            new (winston.transports.Console)({
                level: 'debug',
                timestamp: curTime,
                colorize: true
            })
        ]
    });
    
    logger.transports.console.level = 'debug';

} else {
    console.log('...');
    logger = new (winston.Logger) ({
        transports: [
            new (winston.transports.Console)({
                level: 'debug',
                timestamp: curTime,
                colorize: true
            })
        ]
    });
    
    logger.transports.console.level = 'debug';
}

module.exports = logger;

module.exports.stream = {
    write: function(msg/*, encoding*/) {
        logger.info(msg);
    }
};

module.exports.simpleLogger = function (tagMessage) {
    return function (req, res, next) {
        var loggingText = tagMessage;
        if (req.ip) { loggingText = loggingText + ' : ' + req.ip; }
        if (req.method) { loggingText = loggingText + ' : ' + req.method; }
        if (req.url) { loggingText = loggingText + ' : ' + req.url; }
        logger.debug(loggingText);
        next();
    };
};
