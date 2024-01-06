const app = document.getElementById('app');

function CardIcon({ category }) {
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
      return "";
  }
}


function Card({ setShowModal, itemName, quantity, unitPrice, category }) {
  return <div style={{ padding: '10px', width: '300px' }} className="col grey lighten-4 s12 m12">
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
      <button className="btn blue waves-effect waves-light" onClick={() => setShowModal(true)} >
        <i className="material-icons left">edit</i>
        Edit
      </button>
    </div>
    <div className="right" style={{ marginTop: '10px' }}>
      <button className="btn red waves-effect waves-light">
        <i className="material-icons waves-effect waves-light left">delete</i>
        remove
      </button>
    </div>
  </div>;
}

function Modal({ itemName, quantity, unitPrice, category }) {
  return <div id="EditOrderModal" className="modal">
    <div className="modal-content">
      <h4 id="ModalHeader">Add New Order</h4>
      <div className="row">
        <form className="col s12">
          <div className="row">
            <div className="input-field col s12 m6">
              <input id="CustomerName" type="text" maxLength="50" value={itemName} />
              <label htmlFor={itemName}>Item Name</label>
              <span className="helper-text" data-error="Required" data-success=""></span>
            </div>

            <div className="input-field col s12 m6">
              <input id="OrderQuantity" type="number" min="1" max="10000" value={quantity} />
              <label htmlFor={quantity}>Quantity</label>
              <span className="helper-text" data-error="Required" data-success=""></span>
            </div>

            <div className="input-field col s12 m6">
              <i className="material-icons tiny prefix">attach_money</i>
              <input id="UnitPrice" type="number" min=".01" max="10000" value={unitPrice} />
              <label htmlFor={unitPrice}>Price</label>
              <span className="helper-text" data-error="Required" data-success=""></span>
            </div>

            <div className="input-field col s12 m6">
              <select id="Cateogories" value={category}>
                <option value="(None)">(None)</option>
                <option value="Furniture">Furniture</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Technology">Technology</option>
              </select>
              <label htmlFor={category}>Category</label>
            </div>
          </div>
          <input id="OrderId" type="hidden" />
          <input id="ID" type="hidden" />
        </form>

      </div>
      <div className="modal-footer">
        <button className="waves-effect waves-green btn-flat"><span id="AddUpdateText"></span></button>
      </div>
    </div >
  </div >
}

function CardHolder() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    //data fetch
    setItems([{ itemName: "test123", quantity: 5, unitPrice: 2.50, category: "Office Supplies" }]);
  });

  function handleNextPageClick() {
    setPage(page + 1);
  }

  return <>
  <Modal/>
  {items.map((item, idx) => (
    <Card key={idx} setShowModal={setShowModal} itemName={item.itemName} quantity={item.quantity} unitPrice={item.unitPrice} category={item.category} />
    ))};
  </>
}

const root = ReactDOM.createRoot(app);
root.render(
  <div>
    <CardHolder />
  </div>
);
