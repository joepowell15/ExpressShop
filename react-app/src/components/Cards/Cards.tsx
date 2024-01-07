import { useEffect, useState } from 'react';
import Modal from '../Modal/Modal';
import Card from '../Card/Card';
import debounce, { DebouncedFunction } from 'debounce';
import { UseQueryResult } from '@tanstack/react-query';
import useItems, { useDeleteItemMutation } from '../useItems/api.items';
import SearchBar from '../SearchBar/SearchBar';

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
   const [page, setPage] = useState(1);
   const [search, setSearch] = useState('');
   const [sort, setSort] = useState('AToZ');
   const [pageSize, setPageSize] = useState(10);
   const [showModal, setShowModal] = useState(false);
   const useDeleteMutation = useDeleteItemMutation();
   const dbFn = debounce((searchText) => { setSearch(searchText) }, 500);
   const { isLoading, error, data: items = [], refetch: refetchItems }: UseQueryResult<uiItem[], Error> = useItems(page, pageSize, sort, search);

   useEffect(() => {
      refetchItems();
   }, [search,sort,pageSize]);

   if (isLoading) return 'Loading...';
   if (error) console.log('An error occurred while fetching the user data ', error);

   function handleNextPageClick() {
      setPage(page + 1);
   }

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

   return <div>
      {showModal && <Modal setShowModal={setShowModal} {...selectedItem} />}
      <SearchBar setNewModalValues={setNewModalValues} setSort={setSort} debounceSearchValue={debounceSearchValue} setPageSize={setPageSize} sort={sort} pageSize={pageSize} />
      {
         items.map((item) => (
            <Card key={item.id} handleRemove={handleRemove} setEditModalValues={setEditModalValues}  {...item} />))
      }
   </div>
}

export default Cards;
