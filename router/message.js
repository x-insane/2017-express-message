// message

var cfg = require('./../config.js');
var app = require('express').Router();
var pool = require('./../lib/sql.js').pool;
var moment = require('moment');

app.get('/', function(req, res) {
	var page = Math.ceil(req.query.page) || 1;
	var total = 0,
		pages = 1,
		limit = cfg.message.pageContain,
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
					return res.render('index', {
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
				var num = results.length;
				var data = [];
				for (let i in results) {
					let item = results[i];
					pool.query("SELECT * FROM `users` WHERE `id` = ?", [item.uid],
						function(error, results, fields) {
							if(error)
								throw error;
							data.push({
								name : results.length ? results[0].name : "",
								content : item.content,
								time : moment(item.create_time).format("YYYY-M-D h:mm:ss")
							});
							if(data.length == num) {
								res.render('index', {
									items : data,
									total : total,
									pages : pages,
									page : page
								});
							}
						});
				}
		});
	}

	getTotalNum(getDatas);
});

module.exports = app;