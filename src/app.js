const app = Cheesecake.defineAndBuild("#root",[
	{
		class: 'Panel',
		name: 'gridTitlePanel',
		text: 'PERSONAL DETAILS',
		cssClass: 'title-div',
		marginBottom: '3px',
	}, {
		class: 'FlexPanel',
		name: 'mainPanel',
		items: [
			{
				class: 'Panel',
				name: 'searchPanel',
				marginRight: '10px',
				items: [
					{		
						class: 'DoubleRange',
						name: 'rangeAge',
						width: "220px",
						title: 'Age filter',
						marginBottom: '15px',
						rangemin: 0,
						rangemax: 100,
						step: 5,
						minvalue: 0,
						maxvalue: 100,
						listeners: {
							change: function(value1,value2){
								app.gridPersons.refresh({
									age: {
										min: app.rangeAge.minvalue, 
										max: app.rangeAge.maxvalue
									},
									states: app.chkgroupStates.selected 
								});
							}
						}
					}, {
						class: 'CheckGroup',
						name: 'chkgroupStates',
						width: "220px",
						title: 'State filter',
						data: GetStateDictionary(),
						listeners: {
							change: function(selected){
								app.gridPersons.refresh({
									age: {
										min: app.rangeAge.minvalue, 
										max: app.rangeAge.maxvalue
									},
									states: app.chkgroupStates.selected 
								});
							}
						}
					}
				]
			}, {
				class: 'DataGrid',
				name: 'gridPersons',
				columns: [
					{text: 'Name', dataField: 'name'},
					{text: 'Birth Date', dataField: 'birthDate'},
					{text: 'Birth Year', dataField: 'birthYear'},
					{text: 'Age', dataField: 'age'},
					{text: 'Email Address', dataField: 'email'},
					{text: 'Phone Number', dataField: 'phone'},
					{text: 'State', dataField: 'state'}
				],
				loader: (context) => GetTableData(context),
				listeners: {
					select: function (sender, dataObj) {
						console.log('HTMLTableRow rowIndex:', sender.rowIndex);
						console.log(sender);  // tr element
						alert(
							'Person: '+dataObj.name+'\n'+
							'Email:  '+dataObj.email+'\n'+
							'Phone:  '+dataObj.phone
						);
					}
				}
			}
		]
	}
]);
