Renderer.define("#root",[
	{
		component: 'checkgroup',
		id: 'chkgroupStates',
		width: "210px",
		height: "83px",
		data: GetStateDictionary()
	}, {
		component: 'datagrid',
		title: 'PERSONAL DETAILS',
		columns: [
			{text: 'Name', width: 100, dataIndex: 'name'},
			{text: 'Birth Date', width: 60, dataIndex: 'birthDate'},
			{text: 'Birth Year', width: 40, dataIndex: 'birthYear'},
			{text: 'Age', width: 40, dataIndex: 'age'},
			{text: 'Email Address', flex: 1, dataIndex: 'email'},
			{text: 'Phone Number', width: 200, dataIndex: 'phone'},
			{text: 'State', width: 40, dataIndex: 'state'}
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
