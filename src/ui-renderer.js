if (!String.prototype.format) {
	String.prototype.format = function() {
		var args = arguments;
		return this.replace(/{(\d+)}/g, function(match, number) { 
			return typeof args[number] != 'undefined'
				? args[number]
				: match;
			});
	};
}  

var Renderer = {
	_ex_MissingItems: '[Renderer] Exception. No UI Design Items provided.',
	_ex_DefineUIFirst: '[Renderer] Define page UI design first',
	_ex_RequiredRoot: '[Renderer] Not able to build HTML: cant find root element with id:',
	_ex_NoNameProperty: '[Renderer] Item has no name property. JSON: \n{0}',
	_ex_MissingProperty: '[Renderer] Item name "{0}" has no required property "{1}"',
	designItems: null,
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
		(!this.designItems) && console.error(this._ex_MissingItems);
		this.isDefined = (this.rootId) && (this.designItems);
	},
	build: function (builder) {
		if (!builder) 
			builder = ComponentBuilder();
		(!this.isDefined) && (console.error(this._ex_DefineUIFirst));
		if (!this.designItems) return;
		const root = document.querySelector(this.rootId);
		(!root) && console.error(this._ex_RequiredRoot+` ${this.rootId}`);
		if (!root) return;
		const elemnts = this._renderItems(this.designItems,builder);
		elemnts.forEach(elem => elem && root.appendChild(elem));
	},
	_renderItems: function (items,builder) {
		const nodes = items.map(item => Renderer._renderItem(item,builder));
		const hasNull = nodes.some(n => n === null);
		return hasNull ? [] : nodes;
	},
	_renderItem: function(item,builder) {
		const hasClass = item.hasOwnProperty('class');
		const hasName = item.hasOwnProperty('name');
		if (!hasName) {
			const str = JSON.stringify(item);
			console.error(this._ex_NoNameProperty.format(str));
		}
		(!hasClass) && (console.error(this._ex_MissingProperty.format(item.name,'class')));
		switch(item.class) {
			case "flexpanel":
				return builder.buildPanel(item,
					item.hasOwnProperty('items') ?
						this._renderItems(item.items,builder) :
						[]
				);
			case "datagrid":
				if (!item.hasOwnProperty('data'))
					console.error(this._ex_MissingProperty.format(item.name,'data'));
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

HtmlBuilder = {
	buildNewElement: function (tagName, className, child) {
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
	},
	buildNewInput: function (type, name, value) {
		const input = document.createElement("input");
		input.setAttribute("type", type);
		input.setAttribute("name", name);
		input.setAttribute("value", value);
		return input;
	},
	updateNodeProperties: function (htmlelem, item) {
		if (!item) return;
		if (item.hasOwnProperty("name")) htmlelem.id = item.name;
		if (item.hasOwnProperty('width')) htmlelem.style.width = item.width; 
		if (item.hasOwnProperty('height')) htmlelem.style.height = item.height;
	}
}

function ComponentBuilder() {
	const _newelem = HtmlBuilder.buildNewElement;
	const _ni = HtmlBuilder.buildNewInput;
	const _updateProperties = HtmlBuilder.updateNodeProperties;
	const _hasProperty = (obj, prop) => obj && obj.hasOwnProperty(prop);

	return {
		buildDataGrid: function(item) {
			if (!item.hasOwnProperty('data')) return;
			const table = _newelem("table","datagrid-table");
			buildDataTableHeader(table);
			buildDataTableBody(table);
			_updateProperties
			const grid = _newelem("div","datagrid-div",[
				_newelem("div","datagrid-title",item.title),
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
				const dataset = item.data;
				const body = table.createTBody();
				const addGridRow = function(rowidx) {
					const htmltableRow = body.insertRow(i);
					const rowObj = {};
					for (colIdx=0; colIdx<item.columns.length; colIdx++) {
						prop = item.columns[colIdx].dataField;
						const value = dataset[rowidx][prop];
						rowObj[prop] = value;
						td = document.createElement('td');
						td.innerHTML = value;
						htmltableRow.appendChild(td);
					}
					if (_hasProperty(item.listeners,'select'))
						htmltableRow.onclick = () => item.listeners.select(
							htmltableRow,rowObj);
				};
				for (var i=0;i<dataset.length;i++) {
					addGridRow(i);
				};
			}
		},

		buildCheckGroup: function(item) {
			if (!_hasProperty(item,'data')) return null;
			const checkboxGroup = _newelem("div", "checkbox-group",
				item.data.map(
					pair =>  _newelem("label","",[
						_ni("checkbox",pair.key),
						pair.value
					])
				)
			);
			_updateProperties(checkboxGroup,item);
			const children = (_hasProperty(item,"title")) ? 
				[_newelem("h1","title",item.title), checkboxGroup] :
				[checkboxGroup];
			div = _newelem("div", "checkbox-group-container", children);
			return div;
		}, 

		buildDoubleRange: function (item) {
			const input1 = _ni("range","rangeStart",item.minvalue);
			input1.setAttribute("min",item.rangemin);
			input1.setAttribute("max",item.rangemax);
			input1.setAttribute("step",item.step);
			input1.addEventListener('input', updateSlider1, false); 
			input1.addEventListener('change', updateSlider1, false); 
			if (_hasProperty(item.listeners,'change')){
				input1.addEventListener('change', item.listeners.change, false); 
			}

			const input2 = _ni("range","rangeEnd",item.maxvalue);
			input2.setAttribute("min",item.rangemin);
			input2.setAttribute("max",item.rangemax);
			input2.setAttribute("step",item.step);
			input2.addEventListener('input', updateSlider2, false); 
			input2.addEventListener('change', updateSlider2, false); 
			if (_hasProperty(item.listeners,'change')){
				input2.addEventListener('change', 
					() => item.listeners.change(item.minvalue,item.maxvalue), 
					false); 
			}

			const span = _newelem("span","range2-display","");
			const caption = _newelem("p","",["Range:",span]);
			updateRangeCaption(item.minvalue,item.maxvalue);

			const div1 = _newelem("div","double-range",[input1,input2,caption]);
			_updateProperties(div1,item);

			const children = _hasProperty(item,"title") ?
				[_newelem("h1","title",item.title),div1] : div1;
			const div2 = _newelem("div", "double-range-container", children);
			return div2;

			function updateSlider1 (){
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
			function updateSlider2 (){
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
			const div = _newelem("div", "panel-flex", htmlElemnts);
			_updateProperties(div,item);
			return div;
		}
	}	
}
