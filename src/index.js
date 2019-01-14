import Viewer from './Viewer.js';
import schemaParser from './schemaParser.js';
import template from './template.js';

class DBViewer extends HTMLElement {
  constructor() {
    super();
    const shadowDom = this.attachShadow({
      mode: 'open'
    });

    shadowDom.innerHTML = template;
    this.veiwer = new Viewer(shadowDom);
    this.veiwer.setTableDblClickCallback(this.onTableDblClick.bind(this));
    this.veiwer.setTableClickCallback(this.onTableClick.bind(this));
    this.veiwer.setTableContextMenuCallback(this.onTableContextMenu.bind(this));
    this.veiwer.setTableMoveCallback(this.onTableMove.bind(this));
  }

  onTableClick(tableData, event) {
    // event.detail = tableData;
    this.dispatchEvent(event);
  }

  onTableDblClick(tableData, event) {
    this.dispatchEvent(new CustomEvent('tableDblClick', {detail: tableData}));
  }

  onTableContextMenu(tableData, event) {
    this.dispatchEvent(new CustomEvent('contextMenu', {detail: tableData}));
  }

  onTableMove(tableData, event) {
    event.$data = tableData;
    this.dispatchEvent(new CustomEvent('tableMove', {detail: tableData}));
  }

  getTablePos(tableName) {
    return this.veiwer.getTablePos(tableName);
  }

  get scrollLeft() {
    return this.veiwer.getPan().x;
  }

  get scrollTop() {
    return this.veiwer.getPan().y;
  }

  set scrollLeft(value) {
    this.veiwer.setPanX(value);
  }

  set scrollTop(value) {
    this.veiwer.setPanY(value);
  }

  getZoom() {
    return this.veiwer.getZoom();
  }

  zoomIn() {
    this.veiwer.zoomIn();
  }

  zoomOut() {
    this.veiwer.zoomOut();
  }

  set src(src) {
    this.setAttribute('src', src);
  }

  static get observedAttributes() {
    return ['src'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this._src = newValue;
    fetch(this._src).then((response) => response.json()).
    then((response) => {
      const tables = schemaParser(response);
      this.veiwer.load(tables);
    });
  }

  set schema(schema) {
    const tables = schemaParser(schema);
    this.veiwer.load(tables);
  }
}

customElements.define('db-viewer', DBViewer);
