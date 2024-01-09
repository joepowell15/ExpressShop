import { useEffect } from 'react';
import { SearchBarProps } from '../../interfaces/interfaces';

function SearchBar({ sort, pageSize, setPageSize, debounceSearchValue, setSort, setNewModalValues }: SearchBarProps) {
  useEffect(() => {
    var elems = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(elems, {constrainWidth:false});
    M.updateTextFields();
  }, []);

  return <div className="col s12" style={{ marginTop: '10px' }}>
    <div className="input-field col s6" style={{ marginTop: '10px' }}>
      <i className="material-icons prefix">search</i>
      <label htmlFor="search">Search Orders</label>
      <input type="text" id="search" maxLength={30} onChange={(e) => debounceSearchValue(e.target.value)} />
    </div>

    <div className="col s6 right-align">
      <a onClick={() => setNewModalValues()} className="btn waves-effect waves-light green action-btn"><span><i className="left material-icons">add</i>Add</span></a>

      <a className="btn dropdown-trigger action-btn" data-target='PageSizeDropDown'><i className="left material-icons">list</i>Page Size</a>
      <ul id='PageSizeDropDown' className='dropdown-content'>
        <li onClick={() => setPageSize(10)} className={pageSize == 10 ? "active" : ""}><a href="#!">10</a></li>
        <li onClick={() => setPageSize(30)} className={pageSize == 30 ? "active" : ""}><a href="#!">30</a></li>
        <li onClick={() => setPageSize(60)} className={pageSize == 60 ? "active" : ""}><a href="#!">60</a></li>
      </ul>

      <a className="btn dropdown-trigger action-btn" data-target='dropdown1'><i className="left material-icons">sort</i>Sort</a>
      <ul id='dropdown1' className='dropdown-content'>
        <li onClick={() => setSort('AscendingPrice')} className={sort == "AscendingPrice" ? "active" : ""}><a id="AscendingPrice"><i className="material-icons">arrow_downward</i>Price Low To High</a></li>
        <li onClick={() => setSort('DescendingPrice')} className={sort == "DescendingPrice" ? "active" : ""}><a id="DescendingPrice"><i className="material-icons">arrow_upward</i>Price High To Low</a></li>
        <li onClick={() => setSort('AToZ')} className={sort == "AToZ" ? "active" : ""}><a id="AToZ" href="#!"><i className="material-icons">sort_by_alpha</i>A {'->'} Z</a></li>
        <li onClick={() => setSort('ZToA')} className={sort == "ZToA" ? "active" : ""}><a id="ZToA" href="#!"><i className="material-icons">sort_by_alpha</i>Z {'->'} A</a></li>
      </ul>
    </div>
  </div>
}

export default SearchBar;
