/**
 * Created by pupboss on 3/13/16.
 */
'use strict';

var express = require('express');
var router = express.Router();
var agent = require('../agent/dom_agent');
var room_schedule_parser = require('../parser/room_schedule');
var room_schedule_parser_v2 = require('../parser/room_schedule_v2');
var lntu_building = require('../parser/lntu_building');
var constant = require('../agent/constant');
var config = require('../config');
var model = require('../utility/db');

router.post('/hex-trans', function (req, res) {
  var result = {};
  result.msg = parseInt(req.body['count'], 2).toString(8);
  return res.status(200).json(result);
});

router.get('/auto-fix', function (req, res) {

  agent.test_speed(function (content) {
    return res.send(content);
  });
});

router.post('/v1/room-schedule', function (req, res) {
  var trusted_arr = ['6', '7', '9', '11', '14'];
  var building_id = req.body['buildingID'];
  var week = req.body['week'];
  var week_day = req.body['weekDay'];

  if (trusted_arr.indexOf(building_id) < 0 || parseInt(week) > 26 || parseInt(week) < 1 || parseInt(week_day) < 1 || parseInt(week_day) > 7) {
    return res.status(400).json({ code: constant.cookie.args_error, message: '' });
  }

  room_schedule_parser(config.admin.user_id, config.admin.password, building_id, week, week_day, 'teacher/teachresource/roomschedule_week.jsdo', function (err, result) {
    if (err == constant.cookie.user_error) {
      return res.status(400).json({ code: err, message: 'password error' });
    } else if (err == constant.cookie.net_error) {
      return res.status(500).json({ code: err, message: 'The server may be down.' });
    }
    return res.status(200).json(result);
  })
});

router.post('/v2/room-schedule', function (req, res) {
  var location_id = req.body['location_id'];
  var building_id = req.body['building_id'];
  var week = req.body['week'];
  var week_day = req.body['week_day'];

  if (parseInt(week) > 26 || parseInt(week) < 1 || parseInt(week_day) < 1 || parseInt(week_day) > 7) {
    return res.status(400).json({ code: constant.cookie.args_error, message: '' });
  }
  room_schedule_parser_v2(config.admin.user_id, config.admin.password, location_id, building_id, week, week_day, 'teacher/teachresource/roomschedule_week.jsdo', function (err, result) {
    if (err == constant.cookie.user_error) {
      return res.status(400).json({ code: err, message: 'password error' });
    } else if (err == constant.cookie.net_error) {
      return res.status(500).json({ code: err, message: 'The server may be down.' });
    }
    return res.status(200).json(result);
  })
});

router.post('/v1/lntu-building', function (req, res) {
  if (typeof req.body['location_name'] == 'undefined' || typeof req.body['send_time'] == 'undefined' || typeof req.body['auto_send'] == 'undefined' || typeof req.body['building_name'] == 'undefined' || typeof req.body['building_phone'] == 'undefined' || typeof req.body['location_id'] == 'undefined' || typeof req.body['building_id'] == 'undefined' || req.body['building_id'] == '' || req.body['building_name'] == '' || req.body['building_phone'] == '' || req.body['location_id'] == '' || req.body['send_time'] == '' || req.body['auto_send'] == '' || req.body['location_name'] == '') {
    return res.status(400).json({ code: constant.cookie.args_error, message: 'it seems something went wrong' });
  }
  var building = {
    location_id: req.body['location_id'],
    location_name: req.body['location_name'],
    building_id: req.body['building_id'],
    building_name: req.body['building_name'],
    building_phone: req.body['building_phone'],
    send_time: req.body['send_time'],
    auto_send: req.body['auto_send']
  };
  model.building_model.find({ building_id: req.body['building_id'], location_id: req.body['location_id'] }, function (error, docs) {
    if(error || docs.length < 1){
      model.building_model.create(building, function (error, docs) {
      });
    } else {
      model.building_model.update({ building_id: req.body['building_id'], location_id: req.body['location_id'] }, building, function (error) {
      });
    }
    return res.status(204).send();
  });
});

router.put('/v1/lntu-building', function (req, res) {
  if (typeof req.body['location_name'] == 'undefined' || typeof req.body['send_time'] == 'undefined' || typeof req.body['auto_send'] == 'undefined' || typeof req.body['building_name'] == 'undefined' || typeof req.body['building_phone'] == 'undefined' || typeof req.body['location_id'] == 'undefined' || typeof req.body['building_id'] == 'undefined' || req.body['building_id'] == '' || req.body['building_name'] == '' || req.body['building_phone'] == '' || req.body['location_id'] == '' || req.body['send_time'] == '' || req.body['auto_send'] == '' || req.body['location_name'] == '') {
    return res.status(400).json({ code: constant.cookie.args_error, message: 'it seems something went wrong' });
  }
  var building = {
    location_id: req.body['location_id'],
    location_name: req.body['location_name'],
    building_id: req.body['building_id'],
    building_name: req.body['building_name'],
    building_phone: req.body['building_phone'],
    send_time: req.body['send_time'],
    auto_send: req.body['auto_send']
  };
  model.building_model.update({ building_id: req.body['building_id'], location_id: req.body['location_id'] }, building, function (error) {
    if (error) {
      return res.status(500).json({ code: constant.cookie.net_error, message: 'The server may be down.' });
    }
    return res.status(204).send();
  });
});

router.delete('/v1/lntu-building', function (req, res) {
  if (typeof req.body['location_id'] == 'undefined' || typeof req.body['building_id'] == 'undefined' || req.body['building_id'] == '' || req.body['location_id'] == '') {
    return res.status(400).json({ code: constant.cookie.args_error, message: 'it seems something went wrong' });
  }
  model.building_model.remove({ building_id: req.body['building_id'], location_id: req.body['location_id'] }, function (error) {
    if (error) {
      return res.status(500).json({ code: constant.cookie.net_error, message: 'The server may be down.' });
    }
    return res.status(204).send();
  });
});

router.get('/v1/lntu-building', function (req, res) {
  model.building_model.find({ }, function (error, docs) {
    return res.status(200).json(docs);
  });
});

router.post('/v1/lntu-useless-class', function (req, res) {
  if (typeof req.body['class_name'] == 'undefined' || typeof req.body['location_id'] == 'undefined' || typeof req.body['building_id'] == 'undefined' || req.body['building_id'] == '' || req.body['class_name'] == '') {
    return res.status(400).json({ code: constant.cookie.args_error, message: 'it seems something went wrong' });
  }
  var useless_class = {
    location_id: req.body['location_id'],
    location_name: req.body['location_name'],
    building_id: req.body['building_id'],
    building_name: req.body['building_name'],
    class_name: req.body['class_name']
  };
  model.useless_class_model.find({ class_name: req.body['class_name'] }, function (error, docs) {
    if(error || docs.length < 1){
      model.useless_class_model.create(useless_class, function (error, docs) {
      });
    } else {
      model.useless_class_model.update({ class_name: req.body['class_name'] }, useless_class, function (error) {
      });
    }
    return res.status(204).send();
  });
});

router.delete('/v1/lntu-useless-class', function (req, res) {
  if (typeof req.body['class_name'] == 'undefined' || req.body['class_name'] == '') {
    return res.status(400).json({ code: constant.cookie.args_error, message: 'it seems something went wrong' });
  }
  model.useless_class_model.remove({ class_name: req.body['class_name'] }, function (error) {
    if (error) {
      return res.status(500).json({ code: constant.cookie.net_error, message: 'The server may be down.' });
    }
    return res.status(204).send();
  });
});

router.get('/v1/lntu-useless-class', function (req, res) {
  model.useless_class_model.find({ }, function (error, docs) {
    return res.status(200).json(docs);
  });
});

router.get('/v1/lntu-location-from-system', function (req, res) {
  lntu_building.analyse_location(config.admin.user_id, config.admin.password, 'teacher/teachresource/roomschedulequery.jsdo', function (err, result) {
    if (err == constant.cookie.user_error) {
      return res.status(400).json({ code: err, message: 'password error' });
    } else if (err == constant.cookie.net_error) {
      return res.status(500).json({ code: err, message: 'The server may be down.' });
    }
    return res.status(200).json(result);
  })
});

router.get('/v1/lntu-building-from-system', function (req, res) {
  var location_id = req.query['location_id'];
  if (location_id == '' ||  typeof location_id == 'undefined') {
    return res.status(400).json({ code: constant.cookie.args_error, message: 'location_id can not be null' });
  }
  lntu_building.analyse_building(config.admin.user_id, config.admin.password, location_id, function (err, result) {
    if (err == constant.cookie.user_error) {
      return res.status(400).json({ code: err, message: 'password error' });
    } else if (err == constant.cookie.net_error) {
      return res.status(500).json({ code: err, message: 'The server may be down.' });
    }
    return res.status(200).json(result);
  })
});

router.get('/v1/lntu-room-from-system', function (req, res) {
  var location_id = req.query['location_id'];
  var building_id = req.query['building_id'];
  if (location_id == '' ||  typeof location_id == 'undefined' || building_id == '' ||  typeof building_id == 'undefined') {
    return res.status(400).json({ code: constant.cookie.args_error, message: 'location_id or building_id can not be null' });
  }
  lntu_building.analyse_room(config.admin.user_id, config.admin.password, location_id, building_id, function (err, result) {
    if (err == constant.cookie.user_error) {
      return res.status(400).json({ code: err, message: 'password error' });
    } else if (err == constant.cookie.net_error) {
      return res.status(500).json({ code: err, message: 'The server may be down.' });
    }
    return res.status(200).json(result);
  })
});

module.exports = router;
