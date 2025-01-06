import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function TestPage() {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        const storedQuestions = JSON.parse(localStorage.getItem('testQuestions'));
        if (storedQuestions) {
            setQuestions(storedQuestions);
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Convert answers object to array to maintain order
        const answersArray = questions.map((_, index) => answers[index]);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/evaluate-test`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ answers: answersArray, questions }),
            });

            const results = await response.json();
            localStorage.setItem('testResults', JSON.stringify(results));
            navigate('/results');
        } catch (error) {
            console.error('Error evaluating test:', error);
            alert('Error evaluating test. Please try again.');
        }
    };

    return (
        <div className="test-container">
            <h2>Your Personalized Test</h2>
            <form onSubmit={handleSubmit}>
                {questions.map((question, index) => (
                    <div key={index} className="question">
                        <h3>Question {index + 1}</h3>
                        <p>{question.text}</p>
                        {question.options && (
                            <div className="options">
                                {question.options.map((option, optIndex) => (
                                    <div key={optIndex}>
                                        <input
                                            type="radio"
                                            id={`q${index}-${optIndex}`}
                                            name={`question-${index}`}
                                            value={option}
                                            onChange={(e) => setAnswers({
                                                ...answers,
                                                [index]: e.target.value
                                            })}
                                            required
                                        />
                                        <label htmlFor={`q${index}-${optIndex}`}>{option}</label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                <button type="submit">Submit Test</button>
            </form>
        </div>
    );
}

export default TestPage; 