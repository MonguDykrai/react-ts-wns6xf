import React, { Component } from 'react';
import { render } from 'react-dom';
import CatInterval from './CatInterval';
import data from './list_new';
console.log(data);
import './style.css';

function App() {
  return (
    <div style={{ height: '100vh' }}>
      <CatInterval id="historyInterval" data={data} showSlider format="H:mm" />
    </div>
  );
}

render(<App />, document.getElementById('root'));
