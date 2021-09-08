import './stylesheets/App.css';
import React from 'react';
 import { SearchArea } from './components/searchArea'

function App() {

  return (
    <div>
      <div className="topnav">
        <div className="navTabs">
          <span className="navTab"><a href="https://github.com/toto4tots/food-search">code</a></span>
        </div>
      </div>
      <div className="App">
        <SearchArea />
      </div>
      
    </div>
  );
}

export default App;
