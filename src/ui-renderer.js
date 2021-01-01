var Renderer = {
	_ex_MissingItems: '[Renderer] Exception. No UI Design Items provided.',
	_ex_BuilderFailure: '[Renderer] Exception. Not able to create ComponentBuilder',
	_ex_DefineUIFirst: '[Renderer] Define page UI design first',
	_ex_RequiredRoot: '[Renderer] Not able to build HTML: cant find root element with id:',

	designItems: null,
	componentBuilder: null,
	isDefined: false,

	defineAndBuild: function(rootId, items){
		this.define(rootId, items);
		if (this.isDefined) {
			self = this;
			document.addEventListener("DOMContentLoaded", function(event) {
				self.build();
			});
		}
	},
	define: function(rootId, items){
		this.rootId = rootId;
		this.designItems = items;
		this.componentBuilder = ComponentBuilder();
		(!this.designItems) && console.log(this._ex_MissingItems);
		(!this.componentBuilder) && (console.log(this._ex_BuilderFailure));
		this.isDefined = (this.rootId) && (this.designItems) && 
			(this.componentBuilder);
	},
	build: function () {
		(!this.isDefined) && (console.log(this._ex_DefineUIFirst));
		if (!this.designItems) return;
		const root = document.querySelector(this.rootId);
		(!root) && console.log(this._ex_RequiredRoot+` ${this.rootId}`);
		if (!root) return;
		const elemnts = this._renderItems(this.designItems);
		elemnts.forEach(elem => root.appendChild(elem));
	},
	_renderItems: (items) => items.map(item => Renderer._renderItem(item)),
	_renderItem: function(item) {
		const builder = this.componentBuilder;
		switch(item.component) {
			case "flexpanel":
				return item.hasOwnProperty('items') && 
					builder.buildPanel(item,this._renderItems(item.items));
			case "datagrid":
				return builder.buildDataGrid(item);
			case "checkgroup":
				return builder.buildCheckGroup(item);
			case "doublerange":
				return builder.buildDoubleRange(item);
			default:
				return null;
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

	const _hasProperty = (obj, prop) =>
		obj && obj.hasOwnProperty(prop);
	const _updateId = (htmlelem, item) =>
		item && item.hasOwnProperty("id") && (htmlelem.id = item.id);
	const _updateWidth = (htmlelem, item) =>
		item && item.hasOwnProperty('width') && (htmlelem.style.width = item.width); 
	const _updateHeight = (htmlelem, item) =>
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
					if (_hasProperty(item.listeners,'select'))
						htmltableRow.onclick = () => item.listeners.select(
							htmltableRow,rowObj);
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
				childElems = (item && item.hasOwnProperty("title")) ?
					[_nn("h1","title",item.title),checkboxGroup] : [checkboxGroup];
				return _nn("div", "checkbox-group-container", childElems)
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
			const caption = _nn("p","",["Range:",span]);
			const childElems = (item && item.hasOwnProperty("title")) ?
				[_nn("h1","title",item.title),input1,input2,caption] : 
				[input1,input2,caption];
			const div = _nn("div","doublerange",childElems);
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
