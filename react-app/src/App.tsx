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
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <NavBar />
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
}

export default App;
