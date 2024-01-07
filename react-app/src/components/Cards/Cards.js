import { useState, useEffect, React } from 'react';
import Modal from '../Modal/Modal';
import Card from '../Card/Card';
import M from 'materialize-css';

function Cards() {
   const [items, setItems] = useState([]);
   const [selectedItem, setSelectedItem] = useState({});
   const [page, setPage] = useState(1);
   const [showModal, setShowModal] = useState(false);

   useEffect(() => {
      let ignore = false;
      fetch(`/api/Orders`, { method: "GET" })
         .then(function (response) {
            return response.json();
         })
         .then(function (dbItems) {
            if (!ignore) {
               setItems(dbItems.map((dbItem) => {
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

   function setEditModalValues(id) {
      console.log(id);
      setSelectedItem(items.filter(x => x.id == id)[0]);
      setShowModal(true);
   }

   function handleRemove(id) {
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
         <Card id={item.id} key={item.id} handleRemove={handleRemove} setEditModalValues={setEditModalValues}  {...item} />))};

   </div>
}

export default Cards;
