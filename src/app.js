Renderer.defineAndBuild("#root",[
	{
		component: 'flexpanel',
		items: [
			{
				component: 'doublerange',
				id: 'rangeAge',
				width: "220px",
				title: 'Age filter',
				rangemin: 0,
				rangemax: 100,
				step: 5,
				minvalue: 35,
				maxvalue: 60	
			}, {
				component: 'checkgroup',
				id: 'chkgroupStates',
				width: "220px",
				height: "83px",
				title: 'State filter',
				data: GetStateDictionary()
			}
		]
	}, {
		component: 'datagrid',
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
		data: GetTableData(),
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
]);
