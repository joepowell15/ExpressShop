import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dbItem, uiItem } from '../Cards/Cards';
import { trackPromise } from 'react-promise-tracker';

interface mutatedDbItem extends dbItem {
  updateItemAdded: () => void;
}

const getTotalPages = async (page: number, pageSize: number, search: string) => {
  const res = await fetch(`/api/OrderCount?search=${search}`);
  var data = await res.json();

  return Math.ceil(data.orderCount / pageSize);
};

export const useTotalPages = (page: number, pageSize: number, search: string) => {
  return useQuery<number>({
    queryKey: ['totalPages'],
    queryFn: () => getTotalPages(page, pageSize, search),
  });
};

const getItems = async (page: number, pageSize: number, sort: string, search: string) => {
  const res = await trackPromise(fetch(`/api/Orders?page=${page}&sort=${sort}&search=${search}&pageSize=${pageSize}`));
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

const addNewOrUpdateItem = async (itemToMutate: mutatedDbItem) => {
  var actionUrl = "/api/updateOrder";

  if (!itemToMutate.id) actionUrl = "/api/NewOrder";

  var res = await trackPromise(fetch(actionUrl, { method: "POST", body: JSON.stringify(itemToMutate), headers: { "Content-Type": "application/json" } }));

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
    onSuccess: (data: mutatedDbItem[], variables: mutatedDbItem) => {
      variables.updateItemAdded();
      var elem = document.querySelector('.modal');
      if (elem) {
        var instance = M.Modal.getInstance(elem);
        instance.close();
      }

      if (variables.id) {
        M.toast({ html: "Item Updated Successfully", classes: "green white-text" });
        return queryClient.invalidateQueries({
          queryKey: ['items'],
        });
      }

      queryClient.setQueryData(['items'], (d: mutatedDbItem[]) => {
        M.toast({ html: "Item Added Successfully", classes: "green white-text" });

        var newData = data.map(x => {
          return {
            id: x.id,
            itemName: x["Customer Name"],
            quantity: x["Order Quantity"],
            unitPrice: x["Unit Price"],
            category: x["Product Category"]
          };
        });
        return [...d, ...newData];
      });
    },
  })
};

const deleteItem = async (id: string) => {
  var res = await trackPromise(fetch(`/api/DeleteOrder?id=${id}`, { method: "DELETE" }));

  if (!res.ok) {
    var messageHolder = await res.json();
    throw new Error(messageHolder.message);
  }

  var data = res.json();
  return data;
}

export const useDeleteItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteItem,
    onError: (error) => {
      M.toast({ html: error.message, classes: "red yellow-text" });
    },
    onSuccess: (oldData, id: string) => {
      M.toast({ html: "Item Deleted Successfully", classes: "green white-text" });

      queryClient.setQueryData(['items'], (d: any) => {
        return d.filter((x: dbItem) => x.id != id);
      });
    }
  })
};

export default useItems;
