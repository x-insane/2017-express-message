var React = require('react');

class MainLayout extends React.Component {
	render() {
		return (
		<html>
			<head>
				<title>{this.props.title || "留言板"}</title>
				<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no" />
				<link href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" />
				<link rel="stylesheet" href="/css/main.css" />
			</head>
			<body>
				{this.props.children}
				<script src="https://cdn.bootcss.com/jquery/3.2.0/jquery.min.js"></script>
				<script src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
			</body>
		</html>
		);
	}
}

module.exports = MainLayout;