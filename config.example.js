
module.exports = {
	server : {
		port : 3000,
		cookieSecret : '1234567890'
	},
	mail : {
		host: '',
		secureConnection: true,
		auth: {
			user: '',
			pass: '',
		}
	},
	mysql : {
		host     : 'localhost',
		user     : 'root',
		password : '',
		database : 'express_message'
	},
	regtest : {
		name : /^[\u4e00-\u9fa50-9A-Za-z]{1,26}$/,
		mailbox : /^[\w!#$%&'*+\/=?^_`{|}~-]+(?:\.[\w!#$%&'*+\/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/,
		passwd : /^.{6,26}$/
	},
	message : {
		pageContain : 10
	}
}