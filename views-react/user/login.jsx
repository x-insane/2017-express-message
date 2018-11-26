var React = require('react');
var MainLayout = require('./../layouts/main');
var MainLogo = require('./../components/main-logo');

class Input extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	value : props.value
	    };
	    this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
    	this.setState({
    		value : event.target.value + "1"
    	});
	}

	render() {
		return (
			<div className="form-group">
				<label htmlFor={this.props.name}
					className="col-sm-2 control-label hidden-xs">{this.props.label}</label>
				<div className="col-sm-10">
					<input type={this.props.type || "text"}
						id={this.props.name}
						className="form-control"
						name={this.props.name}
						placeholder={this.props.placeholder || this.props.label ?
							"请输入" + this.props.label : ""}
						value={this.state.value}
						onChange={this.handleChange} />
				</div>
			</div>
		);
	}
}

class Submit extends React.Component {
	render() {
		return (
			<div className="form-group">
			    <div className="col-sm-offset-2 col-sm-10">
			    	<button type="submit" className="btn btn-default">登录</button>
			    </div>
			</div>
		);
	}
}

class Login extends React.Component {

	constructor(props) {
		super(props);
		this.submitLogin = this.submitLogin.bind(this);
	}

	submitLogin() {
		var account = this.refs.account.value;
		var passwd = this.refs.passwd.value;
		if(account == "") {
			alert(112);
			console.log(112);
		}
	}

	render() {
		return (
			<MainLayout>
				<MainLogo title="登录到 梦的天空之城"></MainLogo>
				<div className="container">
					<form action="" method="POST" role="form"
							className="form-horizontal col-sm-10 col-md-8 col-lg-6
								col-md-offset-1 col-lg-offset-2">
						<Input ref="account" name="account" label="帐号" />
						<Input ref="passwd" name="passwd" type="password" label="密码" />
						<Submit ref="submit" onClick={this.submitLogin} />
					</form>
				</div>
			</MainLayout>
		);
	}
}

module.exports = Login;