


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
								description: 'Work calendar for Biplane',
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

application.prototype.sendToCalendar = function (button, dataContainer, table) {
	BX24.callMethod(
		'user.current',
		{},
		function(result){
			var userID = result.data().ID;
			$(button).click(function(){
				BX24.callMethod("calendar.section.get",
					{
						type: 'user',
						ownerId: userID
					},
					function(result){
						var data = result.data();
						var sectionID = "0";
						for (i in data) {
							if (data[i].NAME === 'BiplaneERP') {
								sectionID = data[i].ID;
								if (dataContainer.check === '1') {
									BX24.callMethod("calendar.event.add",
										{
											type: 'user',
											ownerId: userID,
											name: dataContainer.projectName,
											description: dataContainer.description,
											location: dataContainer.taskName,
											from: dataContainer.dateFrom,
											to: dataContainer.dateTo,
											skipTime: 'N',
											section: sectionID,
											color: '#9cbe1c',
											text_color: '#283033',
											accessibility: 'free',
											importance: 'normal',
											private_event: 'N',
										}
									);

									$(table).append(
										'<tr>' +
										'<td class="col-sm-1"></td>' +
										'<td class="col-sm-1">' + dataContainer.projectName + '</td>' +
										'<td class="col-sm-1">' + dataContainer.taskName + '</td>' +
										'<td class="col-sm-1">' + dataContainer.dateTo.substring(11,16) + '</td>' +
										'<td class="col-sm-8">' + dataContainer.description + '</td>' +
										'</td>'
									);
								}
							} else {
								return
							}
						} // end i for
					}
				);

			});

		}
	);
}

application.prototype.getWorkList = function (selector, dataContainer, date ) {
	BX24.callMethod(
		'user.current',
		{},
		function(result){
			var userID = result.data().ID;

			BX24.callMethod("calendar.section.get",
				{
					type: 'user',
					ownerId: userID
				},
				function(result){
					var data = result.data();
					var sectionID = "0";
					for (i in data) {
						if (data[i].NAME === 'BiplaneERP') {
							sectionID = data[i].ID;

							BX24.callMethod("calendar.event.get",
								{
									type: 'user',
									ownerId: userID,
									from: date,
									to: date,
									section: [sectionID]
								}, function( result ){
									var result = result.data();
									var counter = 1;

									if (result.length > 0) {
										for (f in result) {
											var mysqlFriendlyDateTO = result[f].DATE_TO;

											var hoursTo = parseInt(mysqlFriendlyDateTO.substring(11,13));
											var minutesTo = parseInt(mysqlFriendlyDateTO.substring(14,16));

											var spentTime = hoursTo + ":" + minutesTo;

											$(selector).append(
												'<tr>' +
												'<td class="col-sm-1">' + counter + '</td>' +
												'<td class="col-sm-1">' + result[f].NAME + '</td>' +
												'<td class="col-sm-1">' + result[f].LOCATION + '</td>' +
												'<td class="col-sm-1">' + spentTime + '</td>' +
												'<td class="col-sm-8">' + result[f].DESCRIPTION + '</td>' +
												'</td>'
											);

											counter++;
										}
									} else {
										$(selector).append('<tr><td colspan="5">Вы ничего не сделали сегодня!</td></tr>');
									}





								});

						} else {
							return
						}
					} // end i for
				}
			);
		}
	);
}

// create our application
app = new application();
