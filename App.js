import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentForm from './components/StudentForm';
import TestPage from './components/TestPage';
import ResultPage from './components/ResultPage';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <h1>Personalized Learning Assessment</h1>
                </header>
                <main>
                    <Routes>
                        <Route path="/" element={<StudentForm />} />
                        <Route path="/test" element={<TestPage />} />
                        <Route path="/results" element={<ResultPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App; 