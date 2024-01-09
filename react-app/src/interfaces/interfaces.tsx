export interface DeletedDbItem {
   id: string;
   updateItemDeletedCallback: () => void;
}

export interface MutatedDbItem extends DbItem {
   updateItemAddedCallback: () => void;
}

export interface DbItem {
   id?: string;
   "Customer Name": string;
   "Order Quantity": number;
   "Unit Price": number;
   "Product Category": string;
}

export interface UiItem {
   id: string;
   itemName: string;
   quantity: number;
   unitPrice: number;
   category: string;
}

export interface SelectedUiItem {
   id?: string;
   itemName?: string;
   quantity?: number;
   unitPrice?: number;
   category?: string;
}

export interface CardProps {
   handleRemove: (id: string) => void;
   setEditModalValues: (id: string) => void;
   itemName: string;
   quantity: number;
   unitPrice: number;
   category: string;
   id: string;
}

export interface CardIconProps {
   category: string;
}

export interface ModalProps {
   trySaveModal: (id: string, itemName: string, quantity: number, unitPrice: number, category: string) => void;
   setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
   titleText?: string;
   itemName?: string;
   quantity?: number;
   unitPrice?: number;
   category?: string;
   id?: string;
}

export interface PagerProps {
   page: number;
   totalPages: number;
   setPage: React.Dispatch<React.SetStateAction<number>>;
}

export interface SearchBarProps {
   sort: string;
   pageSize: number;
   setPageSize: React.Dispatch<React.SetStateAction<number>>;
   debounceSearchValue: (searchText: string) => void;
   setSort: React.Dispatch<React.SetStateAction<string>>;
   setNewModalValues: () => void;
}

