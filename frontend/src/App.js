import './stylesheets/App.css';
import React from 'react';
 import { SearchArea } from './components/searchArea'

function App() {

  return (
    <div>
      <div className="topnav">
        <div>No Peanuts</div>
        {/* <a>Public</a> */}
      </div>
      <div className="App">
        <SearchArea />
      </div>
      
    </div>
  );
}

export default App;
