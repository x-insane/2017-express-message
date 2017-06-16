var React = require('react');
var MainLayout = require('./layouts/main');
var MainLogo = require('./components/main-logo');

class Message extends React.Component {
	render() {
		return (
			<div className="row">
				<header>
					<span>{this.props.name}</span>
					<span>{this.props.time ? "@"+this.props.time : ""}</span>
				</header>
				<div>{this.props.content}</div>
			</div>
		);
	}
}

class Pagination extends React.Component {
	render() {
		if(this.props.pages < 2)
			return null;
		var lis = [];
		for (var i=1;i<=this.props.pages;++i) {
			if(i == this.props.page)
				lis.push(<li key={i} className="active"><span>{i}</span></li>);
			else
				lis.push(<li key={i}><a href={"/?page="+i}>{i}</a></li>);
		}
		return (
			<ul className="pagination">
				{lis}
			</ul>
		);
	}
}

class Index extends React.Component {
	render() {
		var items = [];
		for (var i in this.props.items) {
			var item = this.props.items[i];
			items.push(<Message key={i} name={item.name} content={item.content}
					time={item.time}></Message>);
		}
		return (
			<MainLayout>
				<MainLogo></MainLogo>
				<div className="container">
					{items.length ? items : <Message content="暂无留言"></Message>}
					<Pagination page={this.props.page || 1} pages={this.props.pages || 1}></Pagination>
				</div>
			</MainLayout>
		);
	}
}

module.exports = Index;