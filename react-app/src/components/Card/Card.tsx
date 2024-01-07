import React from 'react';
import CardIcon from '../CardIcon/CardIcon';

interface CardProps {
   handleRemove: (id: string) => void;
   setEditModalValues: (id: string) => void;
   itemName: string;
   quantity: number;
   unitPrice: number;
   category: string;
   id: string;
}

function Card({ handleRemove, setEditModalValues, itemName, quantity, unitPrice, category, id }: CardProps) {
   return <div className='list-complete-item row'>
      <div style={{ padding: '10px', width: '300px' }} className="col grey lighten-4 s12 m12">
         <div className="center-align">
            <CardIcon category={category} />
         </div>
         <div className="center-align">
            <div className="truncate" style={{ fontSize: '20px' }}>
               {itemName}
            </div>
            <br />

            <span style={{ fontSize: '20px' }}>
               Stock:{quantity}
            </span>
            <br />
            <span>
               Price: ${unitPrice}
            </span>
         </div>
         <div className="left" style={{ marginTop: '10px' }}>
            <button className="btn blue waves-effect waves-light" onClick={() => setEditModalValues(id)} >
               <i className="material-icons left">edit</i>
               Edit
            </button>
         </div>
         <div className="right" style={{ marginTop: '10px' }}>
            <button className="btn red waves-effect waves-light" onClick={() => handleRemove(id)}>
               <i className="material-icons waves-effect waves-light left">delete</i>
               remove
            </button>
         </div>
      </div>
   </div>
}

export default Card;
