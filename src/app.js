Renderer.defineAndBuild("#root",[
	{
		class: 'flexpanel',
		name: 'searchPanel',
		items: [
			{
				class: 'doublerange',
				name: 'rangeAge',
				width: "220px",
				title: 'Age filter',
				rangemin: 0,
				rangemax: 100,
				step: 5,
				minvalue: 35,
				maxvalue: 60,
				listeners: {
					change: function(value1,value2){
						console.log(value1,value2);
					}
				}
			}, {
				class: 'checkgroup',
				name: 'chkgroupStates',
				width: "220px",
				height: "83px",
				title: 'State filter',
				data: GetStateDictionary()
			}
		]
	}, {
		class: 'datagrid',
		name: 'gridPersons',
		title: 'PERSONAL DETAILS',
		columns: [
			{text: 'Name', dataField: 'name'},
			{text: 'Birth Date', dataField: 'birthDate'},
			{text: 'Birth Year', dataField: 'birthYear'},
			{text: 'Age', dataField: 'age'},
			{text: 'Email Address', dataField: 'email'},
			{text: 'Phone Number', dataField: 'phone'},
			{text: 'State', dataField: 'state'}
		],
		listeners: {
			loaddata:  (context) => GetTableData(context),
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
]);
