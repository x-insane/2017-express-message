var cfg = require("./config.js");
var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var app = express();

// var mail = nodemailer.createTransport('SMTP', cfg.mail);
// mail.sendMail({
// 	from: '"Meadowlark Travel" <info@meadowlarktravel.com>',
// 	to: 'joecustomer@gmail.com',
// 	subject: 'Your Meadowlark Travel Tour',
// 	html: '<h1>Meadowlark Travel</h1>\n<p>Thanks for book your trip with ' +
// 		'Meadowlark Travel. <b>We look forward to your visit!</b>',
// 	generateTextFromHtml: true,
// }, function(err){
// 	if(err) {
// 		console.error( 'Unable to send email: ' + error );
// 	}
// });

app.use(express.static(__dirname + '/public'));

// app.engine('.hbs', exphbs({
// 	defaultLayout: 'main',
// 	extname: '.hbs'
// }));
// app.set('view engine', '.hbs');

// app.set('views', __dirname + '/views');
// app.set('view engine', 'jsx');
// app.engine('jsx', require('express-react-views').createEngine({
// 	beautify: true
// }));

var urlencodedParser = bodyParser.urlencoded({
	extended: true
});
var jsonParser = bodyParser.json();
app.use(urlencodedParser);

// app.use(require('cookie-parser')(cfg.server.cookieSecret));
app.use(require('express-session')({
	secret : cfg.server.cookieSecret,
	resave : false,
	saveUninitialized : true
}));

app.use('/$', function(req, res) {
	res.sendFile('index.html', {
		root : __dirname + '/views/'
	});
});
app.use('/api', require('./router/user.js'));
app.use('/api', require('./router/message.js'));

app.use(function(req, res, next) {
	res.status(404).send(); // render('error/404');
});

app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500).send(); // render('error/500');
});

app.listen(cfg.server.port, function() {
	console.log("Start at Port " + cfg.server.port);
});