import React from 'react';
import Home from './home';
import ReactDOM from 'react-dom';

function App() {
  return (
      <div>
          <Home />
      </div>
  )
}

ReactDOM.render(<App />, document.getElementById('main'));