/**
 * Copyright (C) 2015-2016 LNTU.ORG (https://www.lntu.org)
 * Copyright (C) 2013-2015 PUPBOSS. (https://www.pupboss.com)
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

/*
 * Cookie agent Test
 */

var cookieAgent = require('./cookie_agent');
var agentConfig = require('./agent_config');
var async = require('async');

// async.waterfall([
// 	function (callback) {
// 		agentConfig.getCurrentUrl(function (baseUrl) {
// 			callback(null, baseUrl);
// 		});
// 	},
// 	function (data, callback) {
// 		console.log(data)
// 	}

// 	], function (err, result) {

// });

// console.log(agentConfig.J_SESSIONID)

// cookieAgent.getCookie('1306030411', '0123', function (cookie) {
// 	console.log(cookie)
// });
// agentConfig.getCurrentUrl(function (base) {
// 	console.log(base);
// });

var str = 'http://60.18.131.131:11180/academic/common/security/login.jsp;jsessionid=99D7AD2200204AB9B29FC0C01623A2F3.T55?login_error=1'
console.log(str.indexOf('frameset.jsp'));
// if (str.indexOf('frameset.jsp')) {
	
// 	result = result.replace(baseUrl + 'frameset.jsp;jsessionid=', '');
// 	callback(null, result);
// }