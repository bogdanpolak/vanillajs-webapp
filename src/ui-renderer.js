var Renderer = {
	define: function(rootId, items){
		this.rootId = rootId;
		this.items = items;
	},
	buildUI: function(item) {
		const componentBuilder = ComponentBuilder();
		return renderItems(Renderer.items);

		function renderItems(items) {
			var elems = items.map(item => renderItem(item));
			return elems;
		}
		function renderItem(item) {
			if (!item || !item.hasOwnProperty('component')) return null;
			switch(item.component) {
			case "flexpanel":
				if (!item.hasOwnProperty('items')) return null;
				var elems = renderItems(item.items);
				return componentBuilder.buildPanel(item,elems);
			case "datagrid":
				return componentBuilder.buildDataGrid(item);
			case "checkgroup":
				return componentBuilder.buildCheckGroup(item);
			case "doublerange":
				return componentBuilder.buildDoubleRange(item);
			default:
				return null;
			}
		}

	}
};

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

function _in(type, name, value) {
	const input = document.createElement("input");
	input.setAttribute("type", type);
	input.setAttribute("name", name);
	input.setAttribute("value", value);
	return input;
}

function ComponentBuilder() {

	_updateId = (htmlelem, item) =>
		item && item.hasOwnProperty("id") && (htmlelem.id = item.id);
	_updateWidth = (htmlelem, item) =>
		item && item.hasOwnProperty('width') && (htmlelem.style.width = item.width); 
	_updateHeight = (htmlelem, item) =>
		item && item.hasOwnProperty('height') && (htmlelem.style.height = item.height);

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

		buildCheckGroup: function(item) {
			if (item && item.hasOwnProperty('data')) {
				const checkboxGroup = _nn("div", "checkbox-group",
					item.data.map(
						pair =>  _nn("label","",[
							_in("checkbox",pair.key),
							pair.value
						])
					)
				);
				_updateId(checkboxGroup,item);
				_updateWidth(checkboxGroup,item);
				_updateHeight(checkboxGroup,item);
				return checkboxGroup;
			}
		}, 

		buildDoubleRange: function (item) {
			const input1 = _in("range","rangeStart",item.minvalue);
			input1.setAttribute("min",item.rangemin);
			input1.setAttribute("max",item.rangemax);
			input1.setAttribute("step",item.step);
			const input2 = _in("range","rangeEnd",item.maxvalue);
			input2.setAttribute("min",item.rangemin);
			input2.setAttribute("max",item.rangemax);
			input2.setAttribute("step",item.step);
			const span = _nn("span","range2-display","");
			const div = _nn("div","doublerange",[
				input1,
				input2,
				_nn("p","",["Range:",span])	
			]);
			updateRangeCaption(item.minvalue,item.maxvalue);
			_updateId(div,item);
			_updateWidth(div,item);
			_updateHeight(div,item);
			const updateSlider1 = () => {
				v1 = parseInt(input1.value);
				v2 = parseInt(input2.value);
				if (item.minvalue === v1) return;
				item.minvalue = v1;
				if (v1 > v2) {
					input2.value = v1;
					item.maxvalue = v1;
					v2 = v1;
				}
				updateRangeCaption(v1,v2);
			};
			const updateSlider2 = () => {
				v1 = parseInt(input1.value);
				v2 = parseInt(input2.value);
				if (item.maxvalue === v2) return;
				item.maxvalue = v2;
				if (v2 < v1) {
					input1.value = v2;
					item.minvalue = v2;
					v1 = v2;
				}
				updateRangeCaption(v1,v2);
			};
			input1.oninput = updateSlider1; 
			input2.oninput = updateSlider2;
			input1.onchange = updateSlider1; 
			input2.onchange = updateSlider2;
			return div;

			function updateRangeCaption(value1,value2) {
				if ((value1 == item.rangemin) && (value2 == item.rangemax))
					span.innerHTML=" all items";
				else if ((value1 > item.rangemin) && (value2 == item.rangemax))
					span.innerHTML=` items >= ${value1}`;
				else if ((value1 == item.rangemin) && (value2 < item.rangemax))
					span.innerHTML=` items <= ${value2}`;
				else 
					span.innerHTML=` ${value1} .. ${value2}`;
			};

		},

		buildPanel: function (item, htmlElemnts) {
			const div = _nn("div", "panel-flex", htmlElemnts);
			return div;
		}
	}	
}

document.addEventListener("DOMContentLoaded", function(event) {
	const root = document.querySelector(Renderer.rootId);
	const elemnts = Renderer.buildUI();
	elemnts.forEach(elem => root.appendChild(elem));
});
