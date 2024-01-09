import { PagerProps } from '../../interfaces/interfaces';

function Pager({ setPage, page, totalPages }: PagerProps) {

  return <div>
    <div className="center-align">
      <ul className="pagination">

        <li onClick={() => setPage(1)} ><a href="#!"><i className="material-icons">first_page</i></a></li>
        {page > 1 && <li onClick={() => setPage(page - 1)}><a href="#!"><i className="material-icons large">chevron_left</i></a></li>}
        {page <= 1 && <li v-else className={page <= 1 ? " disabled" : ""} ><a href="#!"><i className="material-icons">chevron_left</i></a></li>}

        <li className="active"><a href="#!">{page}</a></li>

        {page < totalPages && <li onClick={() => setPage(page + 1)} v-if="currentPage!=pages.length"><a href="#!"><i className="material-icons">chevron_right</i></a></li>}
        {page >= totalPages && <li className="disabled"><a href="#!"><i className="material-icons">chevron_right</i></a></li>}
        <li onClick={() => setPage(totalPages)}><a href="#!"><i className="material-icons">last_page</i></a></li>
      </ul>
    </div>
    <div className="center align">
      {page} of {totalPages || 1}
    </div>
  </div >
}

export default Pager;
