import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ResultPage() {
    const navigate = useNavigate();
    const [results, setResults] = useState(null);

    useEffect(() => {
        const storedResults = JSON.parse(localStorage.getItem('testResults'));
        if (storedResults) {
            setResults(storedResults);
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handleRetake = () => {
        localStorage.removeItem('testQuestions');
        localStorage.removeItem('testResults');
        navigate('/');
    };

    if (!results) return <div>Loading results...</div>;

    // Ensure all required properties exist
    const score = results.score || 0;
    const feedback = results.feedback || 'No feedback available';
    const recommendations = results.recommendations || 'No recommendations available';
    const detailedResults = results.detailedResults || [];

    return (
        <div className="form-container">
            <h2>Test Results</h2>
            <div className="results">
                <h3 className="score">Score: {score}%</h3>
                <div className="feedback">
                    <h4>Feedback:</h4>
                    <p>{feedback}</p>
                </div>
                <div className="recommendations">
                    <h4>Recommendations:</h4>
                    <p>{recommendations}</p>
                </div>
                {detailedResults.length > 0 && (
                    <div className="detailed-results">
                        <h4>Detailed Results:</h4>
                        {detailedResults.map((result, index) => (
                            <div key={index} className={`question-result ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                                <p><strong>Question {index + 1}:</strong> {result.question}</p>
                                <p>Your Answer: {result.yourAnswer}</p>
                                <p>Correct Answer: {result.correctAnswer}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <button onClick={handleRetake}>Take Another Test</button>
        </div>
    );
}

export default ResultPage; 