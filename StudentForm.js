import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function StudentForm() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        level: '',
        interests: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/generate-test`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate test');
            }

            const data = await response.json();
            localStorage.setItem('testQuestions', JSON.stringify(data.questions));
            navigate('/test');
        } catch (error) {
            console.error('Error generating test:', error);
            alert(`Error: ${error.message || 'Failed to generate test. Please try again.'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Student Information</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="subject">Subject:</label>
                    <input
                        type="text"
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Enter your subject (e.g., Mathematics, Physics, History)"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="level">Level of Understanding:</label>
                    <select
                        id="level"
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        required
                    >
                        <option value="">Select your level</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="interests">Specific Interests or Topics:</label>
                    <textarea
                        id="interests"
                        value={formData.interests}
                        onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                        placeholder="Enter your specific interests or topics you'd like to focus on..."
                        required
                    />
                </div>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Generating Test...' : 'Generate Test'}
                </button>
            </form>
        </div>
    );
}

export default StudentForm; 