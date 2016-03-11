/**
 * Created by pupboss on 3/11/16.
 */

var config = require('../config');
var mongoose = require('mongoose');
var db = mongoose.connect(config.db.uri);

db.connection.on("error", function (error) {
  console.log("数据库连接失败：" + error);
});

var user_schema = new mongoose.Schema({
  id: { type: Number },
  login_token: { type: String },
  password: { type: String },
  type: { type: String },
  update_at: { type: Date, default: Date.now() },
  expires_at: { type: Date },
  create_at: { type: Date },
  ip_address: { type: String },
  user_agent: { type: String }
});

var user_model = db.model('user', user_schema);

module.exports.user_model  = user_model;
