// user

var cfg = require('./../config.js');
var app = require('express').Router();
var pool = require('./../lib/sql.js').pool;

app.get('/get-user-info', function(req, res) {
	if (req.session.user) {
		res.json(req.session.user);
	}
	else {
		res.json({
			islogin : false
		});
	}
})

app.all('/logout', function(req, res) {
	delete req.session.user;
	res.json({
		error : 0
	})
})

app.get('/login', function(req, res) {
	res.sendFile('login.html', {
		root : __dirname + '/../views/'
	});
})

app.get('/register', function(req, res) {
	res.render('user/register');
})

app.post('/login', function(req, res) {
	// if (!req.xhr)
	// 	return res.status(403).render('error/403');
	pool.query("SELECT * FROM `users` WHERE `name` = ? OR `mailbox` = ?",
		[req.body.account, req.body.account],
		function(error, results, fields) {
			if (error)
				throw error;
			if(results.length && results[0].passwd == req.body.passwd) {
				delete results[0].passwd;
				results[0].islogin = true;
				req.session.user = results[0];
				res.json({
					error : 0,
					msg : "登陆成功!"
				});
			}
			else {
				res.json({
					error : 403,
					msg : "帐号或密码错误！"
				});
			}
	});
});

app.post('/register', function(req, res) {
	// if (!req.xhr)
	// 	return res.status(403).render('error/403');

	// GlobalCheck
	if(!cfg.regtest.name.test(req.body.name)) {
		return res.json({
			error : 701,
			msg : "用户名不符合规范"
		});
	}
	if(!cfg.regtest.mailbox.test(req.body.mailbox)) {
		return res.json({
			error : 702,
			msg : "邮箱地址不符合规范"
		});
	}
	if(!cfg.regtest.passwd.test(req.body.passwd)) {
		return res.json({
			error : 703,
			msg : "密码不符合规范"
		});
	}

	var CheckName = function(next) {
		pool.query("SELECT * FROM `users` WHERE `name` = ?",
			[req.body.name],
			function(error, results, fields) {
				if (error)
					throw error;
				if(results.length) {
					res.json({
						error : 201,
						msg : "该用户名已被注册！"
					});
				}
				else
					next();
		});
	}
	var CheckMailbox = function(next) {
		pool.query("SELECT * FROM `users` WHERE `mailbox` = ?",
			[req.body.mailbox],
			function(error, results, fields) {
				if (error)
					throw error;
				if(results.length) {
					res.json({
						error : 202,
						msg : "该邮箱已被注册！"
					});
				}
				else
					next();
		});
	}
	var Register = function(next) {
		pool.query("INSERT INTO `users`(`name`, `mailbox`, `passwd`) VALUE(?, ?, ?)",
			[req.body.name, req.body.mailbox, req.body.passwd],
			function(error, results, fields) {
				if (error)
					throw error;
				res.json({
					error : 0,
					msg : "注册成功！"
				});
		});
	};

	(function Next(ar) {
		var fn = function() {
			ar[ar.length-1](function(){});
		}
		for(var i=ar.length-1;i;--i) {
			fn = (function(fn, prev) {
				return function() {
					prev(fn);
				}
			})(fn, ar[i-1]);
		}
		fn();
	})([CheckName, CheckMailbox, Register]);
});

module.exports = app;