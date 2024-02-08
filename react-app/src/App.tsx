import { useEffect } from 'react';
import './App.css';
import Cards from './components/Cards/Cards';
import LoadingIndicator from './components/LoadingIndicator/LoadingIndicator';
import NavBar from './components/NavBar/NavBar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    document.querySelector("#PreLoadSpinner")?.remove();
    document.querySelector("ul #Index")?.classList.add("active");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <NavBar />
        <a title='View Source' href="https://github.com/joepowell15/ExpressShop/tree/master/react-app" target="_blank" rel="noopener">
          <div className="valign-wrapper header-area">
            <h2 style={{ width: '100%' }} className="center-align">React Item Management</h2>
          </div>
        </a>

        <div className="valign-wrapper header-area">
          <p style={{ width: '100%' }} className="center-align">
            On this page you can create, update, delete, search, and filter the items below. All changes are saved to a database.
          </p>
        </div>

        <div className='container center-align'>
          <div className='section'>
            <div className='row'>
              <div style={style}>
                <LoadingIndicator />
                <Cards />
              </div>
            </div>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  )
}

const style = {
  minHeight: '1090px',
  backgroundColor: "white",
  borderRadius: '20px',
}

export default App;
