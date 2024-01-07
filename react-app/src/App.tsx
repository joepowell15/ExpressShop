import React from 'react';
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
            <div style={style}></div>
            <Cards />
          </div>
        </div>
      </div>
    </div>
  )
}

const style = {
  minHeight: '1090px',
};

export default App;
