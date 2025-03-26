import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './components/Homepage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Homepage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
