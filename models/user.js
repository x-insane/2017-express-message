// 用户模型

var sql = require("./../lib/sql.js");
var pool = sql.pool;

var getById = function(id, fn) {
	pool.query("SELECT * FROM `users` WHERE `id` = ?", [id],
		function(error, results, fields) {
			if (error)
				throw error;
			if (results.length)
				fn(results[0]);
			else
				fn();
	});
}

var User = function() {
}

User.get = User.prototype.get = function() {
	switch (arguments.length) {
		case 2:
			if (isFinite(arguments[0])) {
				return getById(Number(arguments[0]), arguments[1]);
			}
			break;
	}
}

module.exports = User;