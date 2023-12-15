import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import ShowProperty from './screens/showProperty';
import ViewProperties from './screens/viewProperties';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<ViewProperties />} />
          <Route path="/showProperty/:propertyID" element={<ShowProperty />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
