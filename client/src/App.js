import './App.css';
import HomePage from './components/HomePage';
import { Routes, Route } from 'react-router-dom'
import EditorPage from './components/EditorPage';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/editor/:roomId' element={<EditorPage />} />
      </Routes>
    </>
  );
}

export default App;
