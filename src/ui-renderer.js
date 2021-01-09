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
	_ex_RequiredRoot: '[Renderer] Not able to build HTML: cant find root element with id: {0}',
	_ex_NoNameProperty: '[Renderer] Item has no name property. JSON: \n{0}',
	_ex_MissingProperty: '[Renderer] Item "{0}" has no required property "{1}"',
	_ex_GridHasInvalidData: '[Renderer] DataGrid name "{0}" has invalid data: Array is expected.',
	designItems: null,
	isDefined: false,

	defineAndBuild: function(rootId, items){
		const app = this.define(rootId, items);
		if (this.isDefined) {
			document.addEventListener("DOMContentLoaded", function() {
				this.build(ComponentBuilder());
			}.bind(this));
		}
		return app;
	},
	define: function(rootId, items){
		this.isDefined = false;
		this.rootId = rootId;
		this.designItems = items;
		if (!this.designItems) 
			return console.error(this._ex_MissingItems);
		if (!this.rootId)
			return console.error(this._ex_ExpectedRootId);
		const app = {}
		const self = this;
		this.isDefined = defineItems(items);
		return app;
		
		function defineItems(items) {
			const results = items.map( (item) => {
				if (!item.hasOwnProperty('name')) 
					return console.error(self._ex_NoNameProperty.format(JSON.stringify(item)));
				if (!item.hasOwnProperty('class')) 
					return console.error(self._ex_MissingProperty.format(item.name,'class'));
				app[item.name] = item;
				return (item.hasOwnProperty('items')) ? defineItems(item.items) : true;
			});
			const hasNotDefinedItem = results.some(r => r !== true);
			return !hasNotDefinedItem;
		}
	},
	build: function (builder) {
		if (!this.isDefined) 
			return console.error(this._ex_DefineUIFirst);
		const root = document.querySelector(this.rootId);
		if (!root) 
			return console.error(this._ex_RequiredRoot.format(this.rootId));
		const elemnts = this._renderItems(this.designItems,builder);
		elemnts.forEach(elem => elem && root.appendChild(elem));
	},
	_renderItems: function (items,builder) {
		const nodes = items.map(item => Renderer._renderItem(item,builder));
		const hasNull = nodes.some(n => n === null);
		return hasNull ? [] : nodes;
	},
	_renderItem: function(item,builder) {
		switch(item.class) {
			case "FlexPanel":
			case "Panel":
				const cssClass = item.class === "FlexPanel" ? "panel-flex" : "panel";
				return builder.buildPanel(item,cssClass,
					item.hasOwnProperty('items') ?
						this._renderItems(item.items,builder) :
						[]
				);
			case "DataGrid":
				const hasLoader = (item.loader instanceof Function);
				if (!hasLoader) 
					return console.error(this._ex_MissingProperty.format(item.name,'loader'));
				var data = item.loader();
				if (!data instanceof Array) 
					return console.error(this._ex_GridHasInvalidData.format(item.name));
				item.refresh = function (context) {
					const gridDivNode = document.getElementById(item.name);
					const tableNode = gridNode.children[0];
					gridDivNode.removeChild(tableNode);
					var data = item.loader(context);
					gridDivNode.appendChild(builder.buildDataTable(item,data))
				}
				return builder.buildDataGrid(item, data);
			case "CheckGroup":
				return builder.buildCheckGroup(item);
			case "DoubleRange":
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
		if (item.hasOwnProperty('cssClass')) htmlelem.classList.add(item.cssClass);
		if (item.hasOwnProperty('text')) htmlelem.innerHTML = item.text;
		if (item.hasOwnProperty('marginTop')) htmlelem.style.marginTop = item.marginTop;
		if (item.hasOwnProperty('marginBottom')) htmlelem.style.marginBottom = item.marginBottom;
		if (item.hasOwnProperty('marginLeft')) htmlelem.style.marginLeft = item.marginLeft;
		if (item.hasOwnProperty('marginRight')) htmlelem.style.marginRight = item.marginRight;
		if (item.hasOwnProperty('margin')) htmlelem.style.margin = item.margin;
	}
}

function ComponentBuilder() {
	const _newelem = HtmlBuilder.buildNewElement;
	const _ni = HtmlBuilder.buildNewInput;
	const _updateProperties = HtmlBuilder.updateNodeProperties;
	const _hasProperty = (obj, prop) => obj && obj.hasOwnProperty(prop);

	return {
		buildDataTable: function(item, dataRows) {
			const table = _newelem("table","datagrid-table");
			buildDataTableHeader(table);
			buildDataTableBody(table, dataRows);
			return table;

			function buildDataTableHeader(table){
				var header = table.createTHead();
				var htmltableHeaderRow = header.insertRow(0);   
				for (i=0;i<item.columns.length;i++) {
					th = document.createElement('th');
					th.innerHTML = item.columns[i].text;
					htmltableHeaderRow.appendChild(th);
				}
			}
			function buildDataTableBody(table, dataRows){
				const body = table.createTBody();
				const addGridRow = function(rowidx) {
					const htmltableRow = body.insertRow(i);
					const rowObj = {};
					for (colIdx=0; colIdx<item.columns.length; colIdx++) {
						prop = item.columns[colIdx].dataField;
						const value = dataRows[rowidx][prop];
						rowObj[prop] = value;
						td = document.createElement('td');
						td.innerHTML = value;
						htmltableRow.appendChild(td);
					}
					if (_hasProperty(item.listeners,'select'))
						htmltableRow.onclick = () => item.listeners.select(
							htmltableRow,rowObj);
				};
				for (var i=0;i<dataRows.length;i++) {
					addGridRow(i);
				};
			}
		},

		buildDataGrid: function(item, dataRows) {
			const grid = this.buildDataTable(item,dataRows);
			const children = (_hasProperty(item,'title')) ? 
				[_newelem("div","datagrid-title",item.title),grid] :
				[grid];
				var mainNode = _newelem("div","datagrid-div",children);
				_updateProperties(mainNode,item);
				return mainNode;
		},

		buildCheckGroup: function(item) {
			if (!_hasProperty(item,'data')) return null;
			const selected = new Set();
			item.selected = selected;
			const checkboxGroup = _newelem("div", "checkbox-group",
				item.data.map(
					pair =>  {
						const checkInput = _ni("checkbox",pair.key);
						checkInput.addEventListener('click', UpdateCheckboxes, false);
						if (_hasProperty(item.listeners,'change')){
							checkInput.addEventListener('click', 
								() => item.listeners.change(selected), 
								false); 
						};			
						return _newelem("label","",[checkInput,pair.value])
					}
				)
			);
			const children = (_hasProperty(item,"title")) ? 
				[_newelem("h1","title",item.title), checkboxGroup] :
				[checkboxGroup];
			div = _newelem("div", "checkbox-group-container", children);
			_updateProperties(div,item);
			return div;

			function UpdateCheckboxes(ev){
				const cb = ev.currentTarget;
				if (!cb) return;
				if(cb.checked) 
					selected.add(cb.name);
				else
					selected.delete(cb.name);
			}
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

			const children = _hasProperty(item,"title") ?
				[_newelem("h1","title",item.title),div1] : div1;
			const div2 = _newelem("div", "double-range-container", children);
			_updateProperties(div2,item);
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

		buildPanel: function (item, className, htmlElemnts) {
			const div = _newelem("div", className, htmlElemnts);
			_updateProperties(div,item);
			return div;
		}
	}	
}
