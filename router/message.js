// message

var cfg = require('./../config.js');
var app = require('express').Router();
var pool = require('./../lib/sql.js').pool;
var moment = require('moment');

app.get('/get-messages', function(req, res) {
	var page = Math.ceil(req.query.page) || 1;
	var total = 0,
		pages = 1,
		limit = cfg.message.pageContain || 10,
		start = 0;

	var getTotalNum = function(next) {
		pool.query("SELECT COUNT(*) AS n FROM `message`",
			function(error, results, fields) {
				if (error)
					throw error;
				total = results[0].n;
				pages = Math.ceil(total/limit);
				if (page < 1 || page > pages)
					page = 1;
				start = (page-1)*limit;
				if(!total) {
					return res.json({
						items : [],
						total : total,
						pages : pages,
						page : page
					});
				}
				next();
		});
	}

	var getDatas = function() {
		pool.query("SELECT * FROM `message` ORDER BY `id` DESC LIMIT " +
			start + "," + limit,
			function(error, results, fields) {
				if (error)
					throw error;
				var num = results.length-1;
				var data = [];
				for (var i in results) {
					data.push({});
					(function(i){
						var item = results[i];
						pool.query("SELECT * FROM `users` WHERE `id` = ?", [item.uid],
						function(error, results, fields) {
							if(error)
								throw error;
							var can = (req.session.user ?
								(req.session.user.id == item.uid) : false);
							data[i].id = item.id;
							data[i].canDelete = can;
							data[i].canModify = can;
							data[i].username = results[0].name;
							data[i].useravatar = results[0].avatar;
							data[i].content = item.content;
							data[i].time = moment(item.create_time).
										format("YYYY-M-D h:mm:ss");
							if(!num) {
								res.json({
									items : data,
									total : total,
									pages : pages,
									page : page
								});
							}
							num--;
						});
					})(i);
				}
		});
	}

	getTotalNum(getDatas);
});

app.post('/leave-message', function(req, res) {
	if (!req.session.user) {
		return res.json({
			error : 401,
			msg : "请先登录再留言"
		});
	}
	if (!req.body.content) {
		return res.json({
			error : 201,
			msg : "内容不能为空"
		});
	}
	pool.query("INSERT INTO `message`(uid, content) VALUE(?,?)", [
		req.session.user.id, req.body.content], function(error, results, fields) {
			if (error) {
				res.json({
					error : 501,
					msg : "数据库错误"
				});
				throw error;
			}
			res.json({
				error : 0
			});
		});
});

app.post('/delete-message', function(req, res) {
	if (!req.session.user) {
		return res.json({
			error : 401,
			msg : "请先登录再操作"
		});
	}
	pool.query("SELECT `uid` FROM `message` WHERE `id`=?", [req.body.id],
		function(error, results, fields) {
			if (error)
				throw error;
			if (!results.length) {
				return res.json({
					error : 404,
					msg : "该条留言不存在"
				});
			}
			if (results[0].uid != req.session.user.id) {
				return res.json({
					error : 403,
					msg : "权限不足"
				});
			}
			pool.query("DELETE FROM `message` WHERE `id`=?", [req.body.id],
				function(error, results, fields) {
					if (error)
						throw error;
					res.json({
						error : 0
					});
				});
		});
});

module.exports = app;