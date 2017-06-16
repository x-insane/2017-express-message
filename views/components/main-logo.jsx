var React = require('react');

class Title extends React.Component {
	render() {
		return (
			<h2 className="col-md-offset-1 col-lg-offset-2">
				{this.props.title}
			</h2>
		);
	}
}

class MainLogo extends React.Component {
	render() {
		return (
			<div className="jumbotron masthead">
			  <div className="container">
			  	<Title title={this.props.title || "梦的天空之城 - 留言板"}></Title>
			  </div>
		  </div>
		);
	}
}

module.exports = MainLogo;