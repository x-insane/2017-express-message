// 单表查询类

var cfg = require("./../config.js");
var pool = require('mysql').createPool(cfg.mysql);

function SQL() {
	// if(!(this instanceof SQL)) {
	// 	return new SQL();
	// }
	// this._where = [];
}

/*
SQL.prototype = {
	tb : function(tbName) {
		this._tb = tbName;
		return this;
	},
	where : function() {
		switch (arguments.length) {
			case 1:
				this._where.push(arguments[0]);
				break;
			case 2:
				this._where.push(arguments[0]+"="+arguments[1]);
				break;
			case 3:
				this._where.push(arguments[0]+arguments[1]+arguments[2]);
				break;
		}
		return this;
	},
	exec : function(callback) {
		var query = "SELECT * FROM " + this._tb + " ";
		if (this._where.length) {
			query + "WHERE ";
		}
		for (var e in this._where) {
			query += e + " ";
		}
		if(callback)
			pool.query(query, callback);
		else
			return query;
	}
}*/

SQL.pool = SQL.prototype.pool = pool;

module.exports = SQL;