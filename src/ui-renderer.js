var Renderer = {};
Renderer.create = function(item) {
	if (!item || !item.hasOwnProperty('component')) return null;
	const componentBuilder = ComponentBuilder();
	switch(item.component) {
	case "datagrid":
		return componentBuilder.buildDataGrid(item);
	case "checkgroup":
		return componentBuilder.buildCheckgroup(item);
	default:
		return null;
	}
};

Renderer.define= function(rootId, items){
	this.rootId = rootId;
	this.items = items;
}

function _nn(tagName, className, child) {
	var newNode = document.createElement(tagName);
	if (className) {
		newNode.classList.add(className);
	}
	if (child && typeof child === "object" && child instanceof Array) {
		child.forEach(item => {
			if (item && typeof item === "string") 
				newNode.appendChild(document.createTextNode(item));
			if (item && typeof item === "object" && item instanceof HTMLElement) 
				newNode.appendChild(item);
		});
	}
	if (child && typeof child === "string") {
		newNode.innerHTML = child;
	}
	if (child && typeof child === "object" && child instanceof HTMLElement) {
		newNode.appendChild(child);
	}
	return newNode;
}

function ComponentBuilder() {
		
	return {
		buildDataGrid: function(item) {
			const table = _nn("table","datagrid-table");
			buildDataTableHeader(table);
			buildDataTableBody(table);
			const grid = _nn("div","datagrid-div",[
				_nn("div","datagrid-title",item.title),
				table
			]);
			return grid;

			function buildDataTableHeader(table){
				var header = table.createTHead();
				var htmltableHeaderRow = header.insertRow(0);   
				for (i=0;i<item.columns.length;i++) {
					th = document.createElement('th');
					th.innerHTML = item.columns[i].text;
					htmltableHeaderRow.appendChild(th);
				}
			}
			function buildDataTableBody(table){
				const body = table.createTBody();
				const addGridRow = function(rowidx) {
					const htmltableRow = body.insertRow(i);
					const rowObj = {};
					for (colIdx=0; colIdx<item.columns.length; colIdx++) {
						prop = item.columns[colIdx].dataIndex;
						const value = item.data[rowidx][prop];
						rowObj[prop] = value;
						td = document.createElement('td');
						td.innerHTML = value;
						htmltableRow.appendChild(td);
					}
					htmltableRow.onclick = function() {
						return item.listeners.select(htmltableRow,rowObj)
					};  
				};
				for (var i=0;i<item.data.length;i++) {
					addGridRow(i);
				};
			}
		},
		buildCheckgroup: function(item) {
			if (item && item.hasOwnProperty('data')) {
				const checkgroup = _nn("div", "checkbox-group",
				buildLabel(item.data)
				);
				if (item && item.hasOwnProperty('id')) {
					checkgroup.id = item.id;
				};
				if (item && item.hasOwnProperty('width'))
					checkgroup.style.width = item.width; 
				if (item && item.hasOwnProperty('height'))
					checkgroup.style.height = item.height; 
				return  _nn("div","filter-div",[checkgroup]);
			}

			function buildLabel(pairs) { 
				return pairs.map(pair => {
					const input = _nn("input");
					input.name = pair.key;
					input.type = "checkbox";
					return _nn("label","",[input,pair.value]);
				});
			};
				
		} 
	}	
}

document.addEventListener("DOMContentLoaded", function(event) {
	const root = document.querySelector(Renderer.rootId);
	Renderer.items.forEach(item => {
		const elem = Renderer.create(item);
		if (elem) {
			root.appendChild(elem);
			if (item.component === "multiselect")
				new SlimSelect({ select: elem.firstChild });
		}
	});
});
