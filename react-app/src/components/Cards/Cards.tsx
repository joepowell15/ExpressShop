import { useState } from 'react';
import Modal from '../Modal/Modal';
import Card from '../Card/Card';
import M from 'materialize-css';
import { UseQueryResult } from '@tanstack/react-query';
import useItems, { useDeleteItemMutation } from '../useItems/api.items';

export interface selectedUiItem {
   id?: string;
   itemName?: string
   quantity?: number;
   unitPrice?: number;
   category?: string;
}

export interface uiItem {
   id: string;
   itemName: string
   quantity: number;
   unitPrice: number;
   category: string;
}

export interface dbItem {
   id: string;
   "Customer Name": string
   "Order Quantity": number;
   "Unit Price": number;
   "Product Category": string;
}

function Cards() {
   const [selectedItem, setSelectedItem] = useState<selectedUiItem>();
   const [page, setPage] = useState(1);
   const [showModal, setShowModal] = useState(false);

   const { isLoading, error, data: items = [] }: UseQueryResult<uiItem[], Error> = useItems();

   if (isLoading) return 'Loading...';
   if (error) console.log('An error occurred while fetching the user data ', error);

   function handleNextPageClick() {
      setPage(page + 1);
   }

   function setEditModalValues(id: string) {
      setSelectedItem(items.filter(x => x.id == id)[0]);
      setShowModal(true);
   }

   function handleRemove(id: string) {
      useDeleteItemMutation().mutate(id);
   }

   return <div className='container'>
      {showModal && <Modal setShowModal={setShowModal} {...selectedItem} />}
      {items.map((item) => (
         <Card key={item.id} handleRemove={handleRemove} setEditModalValues={setEditModalValues}  {...item} />))};

   </div>
}

export default Cards;
