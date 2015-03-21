function pageInit() {
	this.readyActions = [];
	this.ready = function() {
		for ( var i in this.readyActions) {
			this.readyActions[i]();
		}
	}

	return this;
}

var get = {
	obj : function(cl) {
		if (typeof cl === 'function') {
			if (typeof cl.name === 'undefined') {
				console.log('new object has been created')
				return new cl();
			} else {
				if (typeof get.instance[cl.name] === 'undefined') {
					get.instance[cl.name] = new cl();
					console.log('new '+cl.name+' created');
				}
				return get.instance[cl.name];
			}
		} else {
			console.log(cl, 'no object');
			return {};
		}
	},
	instance : {}
}

function Ajax() {
	this.url = null;
	this.data = null;
	this.success = function() {
	};
	this.data = function() {
	};

	return this;
}

function page() {
	this.ajax = function() {
		return new Ajax();
	};
	this.doAjax = function(ajax) {
		$.ajax({
			url : ajax.url,
			data : ajax.data,
			success: ajax.success
		});
	};

	$.ajaxSetup({
		type : "POST",
		dataType : 'json'
	});

	return this;
}

function mainPage() {

	this.getMessage = this.ajax();

	this.saveData = this.ajax();
	
	this.getMessage.url = '/ajaxData.php';
	this.getMessage.data = 1;
	this.getMessage.success = function(data) {
		get.obj(mainPage).getMessage.data = data;
		console.log(data);
	};

	this.saveData.success = function(data) {
		alert(data.message);
	};

	this.setupModal = function() {
		$('#launchModal').click(function() {
			$('#myModal').modal();
		});
		this.doAjax(this.getMessage);

		$('#myModal').on('show.bs.modal', function(event) {
			var button = $(event.relatedTarget) // Button that triggered the
			// modal
			var recipient = button.data('whatever') // Extract info from data-*
			// attributes
			var modal = $(this)
			modal.find('.modal-title').text(get.obj(mainPage).getMessage.data.title);
			modal.find('.modal-body').text(get.obj(mainPage).getMessage.data.message);
		})
	};

	return this;
}

mainPage.prototype = new page();
mainPage.prototype.constructor = mainPage;

