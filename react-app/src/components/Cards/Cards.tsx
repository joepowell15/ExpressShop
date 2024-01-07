import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import Card from '../Card/Card';
import M from 'materialize-css';

export interface selectedUiItem {
   id?: string;
   itemName?: string
   quantity?: number;
   unitPrice?: number;
   category?: string;
}

interface uiItem {
   id: string;
   itemName: string
   quantity: number;
   unitPrice: number;
   category: string;
}

interface dbItem {
   id: string;
   "Customer Name": string
   "Order Quantity": number;
   "Unit Price": number;
   "Product Category": string;
}

function Cards() {
   const [items, setItems] = useState<uiItem[]>([]);
   const [selectedItem, setSelectedItem] = useState<selectedUiItem>();
   const [page, setPage] = useState(1);
   const [showModal, setShowModal] = useState(false);

   useEffect(() => {
      let ignore = false;
      fetch(`/api/Orders`, { method: "GET" })
         .then(function (response) {
            return response.json();
         })
         .then(function (dbItems: dbItem[]) {
            if (!ignore) {
               setItems(dbItems.map((dbItem: dbItem) => {
                  return {
                     id: dbItem.id,
                     itemName: dbItem["Customer Name"],
                     quantity: dbItem["Order Quantity"],
                     unitPrice: dbItem["Unit Price"],
                     category: dbItem["Product Category"]
                  }

               }));
            }
         }).catch((err) => {
            M.toast({
               html: err,
               classes: "red yellow-text darken-3",
            });
         });

      return () => {
         ignore = true;
      };
   }, []);

   function handleNextPageClick() {
      setPage(page + 1);
   }

   function setEditModalValues(id: string) {
      console.log(id);
      setSelectedItem(items.filter(x => x.id == id)[0]);
      setShowModal(true);
   }

   function handleRemove(id: string) {
      fetch(`api/DeleteOrder?id=${id}`, { method: "DELETE" })
         .then(function (response) {
            return response.json();
         })
         .then(function () {
            var itemRemovedList = items.filter((x) => x.id != id);
            setItems(itemRemovedList);
            M.toast({ html: "Delete Successful", classes: "green white-text" });
         }).catch((err) => {
            M.toast({
               html: err,
               classes: "red yellow-text darken-3",
            });
         });

   }

   return <div className='container'>
      {showModal && <Modal titleText="Edit" setShowModal={setShowModal} {...selectedItem} />}
      {items.map((item) => (
         <Card key={item.id} handleRemove={handleRemove} setEditModalValues={setEditModalValues}  {...item} />))};

   </div>
}

export default Cards;
