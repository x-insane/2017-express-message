Vue.component('message-frame', {
	template: '#message-frame-template'
});

Vue.component('message', {
	template: '#message-template',
	props : ['data'],
	data : function() {
		return {
			content : this.data.content,
			modifying : false
		}
	},
	methods : {
		deleteMessage : function() {
			$.post("/api/delete-message", {id : this.data.id}, function(data, status) {
				if(status == "success") {
					if(data.error) {
						return alert(data.msg);
					}
					vm.getMessages();
				}
			});
		}
	}
});

Vue.component('leave-message', {
	template: '#leave-message-template',
	props : ['user'],
	data : function() {
		return {
			content : "",
			disabled : false,
			buttonTip : "留言"
		}
	},
	computed : {
		rows : function() {
			var row = this.content.split('\n').length;
			if (row > 5)
				return row;
			else
				return 5;
		}
	},
	methods : {
		submit : function() {
			if (this.content == "") {
				alert("请输入内容！");
				return;
			}
			this.disabled = true;
			this.buttonTip = "提交中...";
			(function(that){
				$.post("/api/leave-message", {
					content : that.content
				}, function(data, status) {
					if (status == "success") {
						if (data.error) {
							return alert(data.msg);
						}
						vm.getMessages(vm.page);
						that.content = "";
						that.disabled = false;
						that.buttonTip = "留言";
					}
				});
			})(this);
		}
	}
});

Vue.component('login-frame', {
	template: '#login-frame-template',
	props : [],
	data : function() {
		return {
			account : "",
			passwd : ""
		}
	},
	methods : {
		submit : function() {
			if (this.account == "") {
				return;
			}
			if (this.passwd == "") {
				return;
			}
			$.post("/api/login", {
				account : this.account,
				passwd : this.passwd
			}, function(data, status) {
				if (status == "success") {
					if (data.error)
						alert(data.msg);
					else {
						vm.getUserInfo();
					}
				}
			});
		}
	}
});

var vm = new Vue({
	el : "#app",
	data : {
		page : 1,
		// pagination : 10,
		pages : 1,
		user : {
			loaded : false
		},
		msgs : [],
	},
	computed : {
		// pages : function() {
		// 	return Math.ceil(this.msgs.length / this.pagination)
		// },
		// showMsgs : function() {
		// 	var start = (this.page-1)*this.pagination;
		// 	var end = this.page * this.pagination;
		// 	return this.msgs.slice(start, end);
		// }
	},
	watch : {
		page : function() {
			// this.page = Math.ceil(this.page);
			// if (isNaN(this.page) || this.page < 1)
			// 	this.page = 1;
			// else if (this.page > this.pages)
			// 	this.page = this.pages;
			this.getMessages(this.page);
		},
		// pagination : function(newv, oldv) {
		// 	var min = 1, max = 15;
		// 	this.pagination = Math.ceil(this.pagination);
		// 	if(isNaN(this.pagination) || this.pagination < min)
		// 		this.pagination = min;
		// 	else if (this.pagination > max)
		// 		this.pagination = max;
		// 	this.page = ((this.page-1)*oldv+1)/newv;
		// },
	},
	methods : {
		getUserInfo : function(){
			(function(that){
				$.get("/api/get-user-info", function(data, status) {
				if (status == "success") {
						data.loaded = true;
						that.user = data;
						that.getMessages();
					}
				});
			})(this)
		},
		getMessages : function(page){
			(function(that){
				$.get("/api/get-messages", {
					page : page || 1
				}, function(data, status) {
				if (status == "success") {
						that.msgs = data.items;
						that.pages = data.pages;
						// that.page = data.page;
						that.total = data.total;
					}
				});
			})(this)
		},
	}
})

vm.getUserInfo();
vm.getMessages();