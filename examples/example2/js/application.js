// our application constructor
function application () {
	this.dataHolder = {};
	this.dataHolder.test = "ovo je test";
	this.dataHolder.userId = "";
	this.dataHolder.userName = "";
}

application.prototype.displayCurrentUser = function(selector) {
	var curapp = this;
	BX24.callMethod(
        'user.current',
        {},
        function(result){
			curapp.dataHolder.userName = result.data().NAME;
			curapp.dataHolder.userId = result.data().ID;
			$(selector).html(result.data().NAME + ' ' + result.data().LAST_NAME + '!');
			console.log(curapp.dataHolder);

			BX24.callMethod("calendar.section.get",
				{
					type: 'user',
					ownerId: curapp.dataHolder.userId
				},
				function(result){
					var data = result.data();
					for (i in data) {
						if (data[i].NAME === 'BiplaneERP') {
							return;
						} else {
							BX24.callMethod("calendar.section.add", {
								type: 'user',
								ownerId: curapp.dataHolder.userId,
								name: 'BiplaneERP ',
								description: 'Description for section 1',
								color: '#9cbeee',
								text_color: '#283000',
								export: [{ALLOW: true}],
								access: {
									'D114': 17,
									'G2': 13,
									'U2':15
								}
							});
						}
					} // end i for
				}
			);
	    }
    );
}

application.prototype.showProjects = function (selection) {
	BX24.callMethod(
		'sonet_group.get',
		{
		'ORDER': {
			'NAME': 'ASC'
			}
		},
		function (result){
			var data = result.data();
			for (i in data) {
				$(selection).append($('<option>', {
					value: data[i].ID,
					text: data[i].NAME
				}));
			}
		}
	);
}

// create our application
app = new application();
