import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { UiItem } from '../../interfaces/interfaces';
import { DbItem } from '../../interfaces/interfaces';
import { trackPromise } from 'react-promise-tracker';
import { DeletedDbItem } from '../../interfaces/interfaces';
import { MutatedDbItem } from '../../interfaces/interfaces';

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
  return data.map((dbItem: DbItem) => {
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
  return useQuery<UiItem[]>({
    queryKey: ['items', page, search, sort],
    queryFn: () => getItems(page, pageSize, sort, search),
    placeholderData: keepPreviousData,
  });
};

const addNewOrUpdateItem = async (itemToMutate: MutatedDbItem) => {
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

export const useItemAddOrUpdateMutation = (page: number, sort: string, search: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addNewOrUpdateItem,
    onError: (error) => {
      M.toast({ html: error.message, classes: "red yellow-text" });
    },
    onSuccess: (data: MutatedDbItem[], variables: MutatedDbItem) => {
      variables.updateItemAddedCallback();
      var elem = document.querySelector('.modal');
      if (elem) {
        var instance = M.Modal.getInstance(elem);
        instance.close();
      }

      if (variables.id) {
        M.toast({ html: "Item Updated Successfully", classes: "green white-text" });
        return queryClient.invalidateQueries({
          queryKey: ['items', page, search, sort],
        });
      }

      queryClient.setQueryData(['items', page, search, sort], (d: MutatedDbItem[]) => {
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

const deleteItem = async (deletedItem: DeletedDbItem) => {
  var res = await trackPromise(fetch(`/api/DeleteOrder?id=${deletedItem.id}`, { method: "DELETE" }));

  if (!res.ok) {
    var messageHolder = await res.json();
    throw new Error(messageHolder.message);
  }

  var data = res.json();
  return data;
}

export const useDeleteItemMutation = (page: number, sort: string, search: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteItem,
    onError: (error) => {
      M.toast({ html: error.message, classes: "red yellow-text" });
    },
    onSuccess: (oldData, variables: DeletedDbItem) => {
      variables.updateItemDeletedCallback();
      M.toast({ html: "Item Deleted Successfully", classes: "green white-text" });


      queryClient.setQueryData(['items', page, search, sort], (d: any) => {
        return d.filter((x: DbItem) => x.id != variables.id);
      });
    }
  })
};

export default useItems;
