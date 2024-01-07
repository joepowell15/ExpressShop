import { useQuery, useMutation } from '@tanstack/react-query';
import { dbItem, selectedUiItem, uiItem } from '../Cards/Cards';

const getItems = async () => {
  const res = await fetch(`/api/Orders`);
  var data = await res.json();
  return data.map((dbItem: dbItem) => {
    return {
      id: dbItem.id,
      itemName: dbItem["Customer Name"],
      quantity: dbItem["Order Quantity"],
      unitPrice: dbItem["Unit Price"],
      category: dbItem["Product Category"]
    };
  });
};

export const useItems = () => {
  return useQuery<uiItem[]>({
    queryKey: ['items'],
    queryFn: () => getItems(),
  });
};

const addNewOrUpdateItem = async (itemToMutate: dbItem) => {
  var actionUrl = "/api/updateOrder";

  if (!itemToMutate.id) actionUrl = "/api/NewOrder";

  var res = await fetch(actionUrl, { method: "POST", body: JSON.stringify(itemToMutate), headers: { "Content-Type": "application/json" } });
  var data = res.json();
  return data;
}

export const useItemAddOrUpdateMutation = () => {
  return useMutation({
    mutationFn: addNewOrUpdateItem,
  })
};

const deleteItem = async (id: string) => {
  var res = await fetch(`/api/DeleteOrder?${id}`, { method: "DELETE" });
  var data = res.json();
  return data;
}

export const useDeleteItemMutation = () => {
  return useMutation({
    mutationFn: deleteItem,
  })
};

export default useItems;
