import React from 'react';
import { CardIconProps } from '../../interfaces/interfaces';

function CardIcon({ category }: CardIconProps): React.JSX.Element {
   switch (category) {
      case "(None)":
         return <i title="(None)" className="large material-icons">warning</i>;
      case "Furniture":
         return <i title="Furniture" className="large material-icons">chair</i>;
      case "Office Supplies":
         return <i title="Office Supplies" className="large material-icons">fax</i>;
      case "Technology":
         return <i title="Technology" className="large material-icons">computer</i>;
      default:
         return <></>;
   }
}

export default CardIcon;
