import './App.css';
import Cards from './components/Cards/Cards';
import NavBar from './components/NavBar/NavBar';

function App() {
  return (
    <div>
      <NavBar />
      <div className='container center-align'>
        <div className='section'>
          <div className='row'>
            <div style={{minheight : '1090px'}}></div>
            <Cards />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;
