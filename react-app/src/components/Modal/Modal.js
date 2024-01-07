import { React, useEffect } from 'react';
import M from 'materialize-css';

function Modal({ setShowModal, titleText, itemName, quantity, unitPrice, category }) {

   useEffect(() => {
      var elems = document.querySelectorAll('.modal');
      var instances = M.Modal.init(elems, { onCloseEnd: () => { setShowModal(false) } });
      instances[0].open();

      var elems = document.querySelectorAll('#Categories');
      var instances = M.FormSelect.init(elems, {});
   }, []);

   return <div id="EditOrderModal" className="modal">
      <form action="/api/updateFormOrder" method='post' className="col s12">
         <div className="modal-content">
            <h4 id="ModalHeader">{titleText} Order</h4>
            <div className="row">
               <div className="row">
                  <div className="input-field col s12 m6">
                     <input id="Customer Name" type="text" maxLength="50" value={itemName} />
                     <label className='active' htmlFor={itemName}>Item Name</label>
                     <span className="helper-text" data-error="Required" data-success=""></span>
                  </div>

                  <div className="input-field col s12 m6">
                     <input id="Order Quantity" type="number" min="1" max="10000" value={quantity} />
                     <label className='active' htmlFor={quantity}>Quantity</label>
                     <span className="helper-text" data-error="Required" data-success=""></span>
                  </div>

                  <div className="input-field col s12 m6">
                     <i className="material-icons tiny prefix">attach_money</i>
                     <input id="Unit Price" type="number"  value={unitPrice} />
                     <label className='active' htmlFor={unitPrice}>Price</label>
                  </div>

                  <div className="input-field col s12 m6">
                     <select id="Product Category" value={category}>
                        <option value="(None)">(None)</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Office Supplies">Office Supplies</option>
                        <option value="Technology">Technology</option>
                     </select>
                     <label htmlFor={category}>Category</label>
                  </div>
               </div>
               <input id="OrderId" type="hidden" />
               <input id="id" type="hidden" />

            </div>
         </div>

         <div className="modal-footer">
            <button type="submit" className="btn btn-large waves-effect waves-green btn-flat">Save</button>
         </div>
      </form>
   </div >
}

export default Modal;
