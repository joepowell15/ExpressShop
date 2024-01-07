import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dbItem, selectedUiItem, uiItem } from '../Cards/Cards';

const getItems = async (page: number, pageSize: number, sort: string, search: string) => {
  const res = await fetch(`/api/Orders?page=${page}&sort=${sort}&search=${search}&pageSize=${pageSize}`);
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

export const useItems = (page: number, pageSize: number, sort: string, search: string) => {
  return useQuery<uiItem[]>({
    queryKey: ['items'],
    queryFn: () => getItems(page, pageSize, sort, search),
  });
};

const addNewOrUpdateItem = async (itemToMutate: dbItem) => {
  var actionUrl = "/api/updateOrder";

  if (!itemToMutate.id) actionUrl = "/api/NewOrder";

  var res = await fetch(actionUrl, { method: "POST", body: JSON.stringify(itemToMutate), headers: { "Content-Type": "application/json" } });

  if (!res.ok) {
    var messageHolder = await res.json();
    throw new Error(messageHolder.message);
  }

  var data = res.json();
  return data;
}

export const useItemAddOrUpdateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addNewOrUpdateItem,
    onError: (error) => {
      M.toast({ html: error.message, classes: "red yellow-text" });
    },
    onSuccess: (data, variables: dbItem) => {
      if (variables.id) {
        return queryClient.invalidateQueries({
          queryKey: ['items'],
        });
      }

      queryClient.setQueryData(['items'], (d: any) => {
        console.log(data, d);
        //return {...data,...d};
      });
    },
  })
};

const deleteItem = async (id: string) => {
  var res = await fetch(`/api/DeleteOrder?id=${id}`, { method: "DELETE" });
  var data = res.json();
  return data;
}

export const useDeleteItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteItem,
    onSuccess: (oldData, id: string) => {
      queryClient.setQueryData(['items'], (d: any) => {
        return d.filter((x: dbItem) => x.id != id);
      });
    }
  })
};

export default useItems;
