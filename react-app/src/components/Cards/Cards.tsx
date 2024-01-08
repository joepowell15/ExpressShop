import { useEffect, useState } from 'react';
import Modal from '../Modal/Modal';
import Card from '../Card/Card';
import debounce, { DebouncedFunction } from 'debounce';
import { UseQueryResult } from '@tanstack/react-query';
import useItems, { useDeleteItemMutation, useItemAddOrUpdateMutation, useTotalPages } from '../api/api.items';
import SearchBar from '../SearchBar/SearchBar';
import Pager from '../Pager/Pager';

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
   id?: string;
   "Customer Name": string
   "Order Quantity": number;
   "Unit Price": number;
   "Product Category": string;
}

function Cards() {
   const [selectedItem, setSelectedItem] = useState<selectedUiItem>();
   const [itemAdded, setItemAdded] = useState(false);
   const [page, setPage] = useState(1);
   const [search, setSearch] = useState('');
   const [sort, setSort] = useState('AToZ');
   const [pageSize, setPageSize] = useState(10);
   const [showModal, setShowModal] = useState(false);
   const useDeleteMutation = useDeleteItemMutation();
   const useAddOrUpdateItemMutation = useItemAddOrUpdateMutation();
   const { isLoading: isLoadingItems, error: errorItems, data: items = [], refetch: refetchItems }: UseQueryResult<uiItem[], Error> = useItems(page, pageSize, sort, search);
   const { isLoading: isLoadingTotalPages, error: errorTotalPages, data: totalPages = 1, refetch: refetchTotalPages }: UseQueryResult<number, Error> = useTotalPages(page, pageSize, search);
   const dbFn = debounce((searchText) => { setSearch(searchText) }, 500);

   useEffect(() => {
      refetchItems();
   }, [search, sort, pageSize, page, itemAdded]);

   useEffect(() => {
      refetchTotalPages();
   }, [itemAdded, search,pageSize]);

   if (isLoadingItems) return;
   if (errorItems) console.log('An error occurred while fetching the user data ', errorItems);

   function setNewModalValues() {
      setSelectedItem({});
      setShowModal(true);
   }

   function setEditModalValues(id: string) {
      setSelectedItem(items.filter(x => x.id == id)[0]);
      setShowModal(true);
   }

   function handleRemove(id: string) {
      useDeleteMutation.mutate(id);
   }

   function debounceSearchValue(searchText: string) {
      if (searchText.length && searchText.length < 3) return;

      dbFn(searchText);
   }

   function trySaveModal(id: string, itemName: string, quanity: number, unitPrice: number, category: string) {
      const updateItemAdded = () => {
         setItemAdded(!itemAdded);
      }
      useAddOrUpdateItemMutation.mutate({ updateItemAdded, id, "Customer Name": itemName, "Order Quantity": quanity, "Unit Price": unitPrice, "Product Category": category });
   }

   return <div>
      {showModal && <Modal setShowModal={setShowModal} {...selectedItem} trySaveModal={trySaveModal} />}
      <SearchBar setNewModalValues={setNewModalValues} setSort={setSort} debounceSearchValue={debounceSearchValue} setPageSize={setPageSize} sort={sort} pageSize={pageSize} />
      {
         items.map((item) => (
            <Card key={item.id} handleRemove={handleRemove} setEditModalValues={setEditModalValues}  {...item} />))
      }
      <Pager totalPages={totalPages} page={page} setPage={setPage} />
   </div>
}

export default Cards;
