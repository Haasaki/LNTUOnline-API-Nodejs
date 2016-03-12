/**
 * Created by pupboss on 3/11/16.
 */
'use strict';

var express = require('express');
var router = express.Router();
var model = require('../utility/db');
var parser = require('../parser/student');

router.get('/:name', function (req, res) {

  parser(req.lntu_user_id, req.lntu_password, 'student/studentinfo/studentinfo.jsdo', function (err, result) {
    if (err) {
      return res.status(400).json({ code: err, message: 'it seems something went wrong' });
    }
    model.user_detail_model.find({ id: result['id'] }, function (error, docs) {
      var user_detail = {
        id: result['id'],
        name: result['name'],
        photo_url: result['photoUrl'],
        class_info: result['classInfo'],
        sex: result['sex'],
        college: result['college'],
        update_at: new Date().toISOString()
      };
      if(error || docs.length < 1){
        model.user_detail_model.create(user_detail, function (error, docs) {
        });
      } else {
        model.user_detail_model.update({ id: result['id'] }, user_detail, function (error, docs) {
        });
      }
    });
    return res.status(200).json(result);
  });
});

module.exports = router;
