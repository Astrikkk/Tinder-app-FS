import React from 'react';
import Navbar from './components/Navbar';
import Content from './components/Content';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
      <Navbar />
      <Content />
    </div>
    </div>
  );
};

export default App;
