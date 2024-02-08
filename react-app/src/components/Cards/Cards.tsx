import { useEffect, useState } from 'react';
import Modal from '../Modal/Modal';
import Card from '../Card/Card';
import debounce from 'debounce';
import { UseQueryResult } from '@tanstack/react-query';
import useItems, { useDeleteItemMutation, useItemAddOrUpdateMutation, useTotalPages } from '../api/api.items';
import SearchBar from '../SearchBar/SearchBar';
import Pager from '../Pager/Pager';
import { UiItem } from '../../interfaces/interfaces';
import { SelectedUiItem } from '../../interfaces/interfaces';
import M from 'materialize-css';

function Cards() {
   const [selectedItem, setSelectedItem] = useState<SelectedUiItem>();
   const [itemAdded, setItemAdded] = useState(false);
   const [itemDeleted, setItemDeleted] = useState(false);
   const [page, setPage] = useState(1);
   const [search, setSearch] = useState('');
   const [sort, setSort] = useState('AToZ');
   const [pageSize, setPageSize] = useState(10);
   const [showModal, setShowModal] = useState(false);
   const useDeleteMutation = useDeleteItemMutation(page, sort, search);
   const useAddOrUpdateItemMutation = useItemAddOrUpdateMutation(page, sort, search);
   const { isLoading: isLoadingItems, data: items = [], refetch: refetchItems }: UseQueryResult<UiItem[], Error> = useItems(page, pageSize, sort, search);
   const { data: totalPages = 1, refetch: refetchTotalPages }: UseQueryResult<number, Error> = useTotalPages(page, pageSize, search);
   const debounceSearchValues = debounce((searchText) => { setSearch(searchText) }, 500);

   useEffect(() => {
      if (page == 1) {
         refetchItems();
      }
      else {
         setPage(1);
      }
   }, [pageSize]);

   useEffect(() => {
      refetchItems();
   }, [itemAdded, itemDeleted]);

   useEffect(() => {
      refetchTotalPages();
   }, [itemAdded, search, pageSize]);

   if (isLoadingItems) return;

   function setNewModalValues() {
      setSelectedItem({});
      setShowModal(true);
   }

   function setEditModalValues(id: string) {
      setSelectedItem(items.filter(x => x.id == id)[0]);
      setShowModal(true);
   }

   function handleRemove(id: string) {
      const updateItemDeletedCallback = () => {
         setItemDeleted(!itemDeleted);
      }
      useDeleteMutation.mutate({ id, updateItemDeletedCallback });
   }

   function trySaveModal(id: string, itemName: string, quantity: number, unitPrice: number, category: string) {
      if (!validateFormValues(itemName, quantity, unitPrice, category)) {
         return;
      }

      const updateItemAddedCallback = () => {
         setItemAdded(!itemAdded);
      }
      useAddOrUpdateItemMutation.mutate({ updateItemAddedCallback: updateItemAddedCallback, id, "Customer Name": itemName, "Order Quantity": quantity, "Unit Price": unitPrice, "Product Category": category });
   }

   function validateFormValues(itemName: string, quantity: number, unitPrice: number, category: string) {
      if (!itemName) {
         M.toast({ html: "Item Name is required", classes: "red yellow-text" });
         return false;
      }

      if (!quantity || quantity > 10000 || quantity < 1) {
         M.toast({ html: "Quantity must be less than 10000 and greater than 1", classes: "red yellow-text" });
         return false;
      }

      if (!unitPrice || unitPrice > 10000 || unitPrice < 1) {
         M.toast({ html: "Price must be less than 10000 and greater than 1", classes: "red yellow-text" });
         return false;
      }

      return true;
   }

   return <div>
      {showModal && <Modal setShowModal={setShowModal} {...selectedItem} trySaveModal={trySaveModal} />}
      <SearchBar setNewModalValues={setNewModalValues} setSort={setSort} debounceSearchValue={debounceSearchValues} setPageSize={setPageSize} sort={sort} pageSize={pageSize} />
      {
         items.map((item) => (
            <Card key={item.id} handleRemove={handleRemove} setEditModalValues={setEditModalValues}  {...item} />))
      }
      <Pager totalPages={totalPages} page={page} setPage={setPage} />
   </div>
}

export default Cards;

