import React from 'react';
import { useEffect, useState } from 'react';
import M from 'materialize-css';
import { useItemAddOrUpdateMutation } from '../api/api.items';

interface ModalProps {
   trySaveModal: (id: string, itemName: string, quantity: number, unitPrice: number, category: string) => void;
   setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
   titleText?: string;
   itemName?: string;
   quantity?: number;
   unitPrice?: number;
   category?: string;
   id?: string;
}

function Modal({ trySaveModal, setShowModal, itemName, quantity, unitPrice, category, id = "" }: ModalProps) {
   useEffect(() => {
      var elems = document.querySelectorAll('.modal');
      var instances = M.Modal.init(elems, { onCloseEnd: () => { setShowModal(false) } });
      instances[0].open();

      var elems = document.querySelectorAll('#Categories');
      M.FormSelect.init(elems, {});
   }, []);

   const [itemNameOut, setItemNameOut] = useState<string>(itemName || "");
   const [quantityOut, setQuantityOut] = useState<number>(quantity || 0);
   const [unitPriceOut, setUnitPriceOut] = useState<number>(unitPrice || 0);
   const [categoryOut, setCategoryOut] = useState<string>(category || "(None)");

   var titleText = "Edit";
   if (!id) {
      titleText = "Add New";
   }

   return <div id="EditOrderModal" className="modal">
      <form className="col s12">
         <div className="modal-content">
            <h4 id="ModalHeader">{titleText} Order</h4>
            <div className="row">
               <div className="row">
                  <div className="input-field col s12 m6">
                     <input id="Customer Name" type="text" maxLength={50} value={itemNameOut} onChange={e => setItemNameOut(e.target.value)} />
                     <label className='active' htmlFor="Customer Name">Item Name</label>
                     <span className="helper-text" data-error="Required" data-success=""></span>
                  </div>

                  <div className="input-field col s12 m6">
                     <input id="Order Quantity" type="number" min="1" max="10000" value={quantityOut} onChange={e => setQuantityOut(parseFloat(e.target.value))} />
                     <label className='active' htmlFor="Order Quantity">Quantity</label>
                     <span className="helper-text" data-error="Required" data-success=""></span>
                  </div>

                  <div className="input-field col s12 m6">
                     <i className="material-icons tiny prefix">attach_money</i>
                     <input id="Unit Price" type="number" value={unitPriceOut} onChange={e => setUnitPriceOut(parseFloat(e.target.value))} />
                     <label className='active' htmlFor="Unit Price">Price</label>
                  </div>

                  <div className="input-field col s12 m6">
                     <select id="Categories" value={categoryOut} onChange={e => setCategoryOut(e.target.value)}>
                        <option value="(None)">(None)</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Office Supplies">Office Supplies</option>
                        <option value="Technology">Technology</option>
                     </select>
                     <label htmlFor="Categories">Category</label>
                  </div>
               </div>
               <input id="id" type="hidden" value={id} />

            </div>
         </div>

         <div className="modal-footer">
            <button onClick={() => trySaveModal(id, itemNameOut, quantityOut, unitPriceOut, categoryOut)} type="button" className="btn btn-large waves-effect waves-green btn-flat">Save</button>
         </div>
      </form >
   </div >
}

export default Modal;
