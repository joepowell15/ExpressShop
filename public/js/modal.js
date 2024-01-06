function Modal() {
    return <div id="EditOrderModal" className="modal">
      <div className="modal-content">
        <h4 id="ModalHeader">Add New Order</h4>
        <div className="row">
          <form className="col s12">
            <div className="row">
              <div className="input-field col s12 m6">
                <input id="CustomerName" type="text" maxLength="50" />
                <label htmlFor="CustomerName">Item Name</label>
                <span className="helper-text" data-error="Required" data-success=""></span>
              </div>
  
              <div className="input-field col s12 m6">
                <input id="OrderQuantity" type="number" min="1" max="10000" onblur="ValidateOrderQuantity()" />
                <label htmlFor="OrderQuantity">Quantity</label>
                <span className="helper-text" data-error="Required" data-success=""></span>
              </div>
  
              <div className="input-field col s12 m6">
                <i className="material-icons tiny prefix">attach_money</i>
                <input id="UnitPrice" type="number" min=".01" max="10000" onblur="ValidateUnitPrice()" />
                <label htmlFor="UnitPrice">Price</label>
                <span className="helper-text" data-error="Required" data-success=""></span>
              </div>
  
              <div className="input-field col s12 m6">
                <select id="Cateogories">
                  <option value="(None)">(None)</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Technology">Technology</option>
                </select>
                <label htmlFor="Cateogories">Category</label>
              </div>
            </div>
            <input id="OrderId" type="hidden" />
            <input id="ID" type="hidden" />
          </form>
  
        </div>
        <div className="modal-footer">
          <button className="waves-effect waves-green btn-flat"><span id="AddUpdateText"></span></button>
        </div>
      </div >
    </div >
  }