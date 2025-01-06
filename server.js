const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/generate-test', async (req, res) => {
    try {
        const { subject, level, interests } = req.body;
        console.log('Request body:', req.body);

        if (!subject || !level) {
            return res.status(400).json({
                error: 'Missing required fields: subject and level are required'
            });
        }

        // Generate questions using ChatGPT
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful AI that generates educational test questions. Generate questions in JSON format."
                },
                {
                    role: "user",
                    content: `Generate 3 multiple-choice questions about ${subject} at ${level} level, incorporating ${interests || ''} where relevant. 
                    Each question should have 4 options and one correct answer. Return the response in JSON format with the following structure:
                    {
                        "questions": [
                            {
                                "text": "question text",
                                "options": ["option1", "option2", "option3", "option4"],
                                "correctAnswer": "correct option"
                            }
                        ]
                    }`
                }
            ],
            temperature: 0.7,
        });

        console.log('OpenAI Response:', completion.choices[0].message.content);

        // Parse the response and send it to the client
        const generatedQuestions = JSON.parse(completion.choices[0].message.content);
        res.json(generatedQuestions);

    } catch (error) {
        console.error('Detailed error:', {
            message: error.message,
            stack: error.stack,
            response: error.response?.data
        });

        res.status(500).json({
            error: 'Failed to generate test. Please try again later.',
            details: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                type: error.type,
                code: error.code
            } : undefined
        });
    }
});

app.post('/api/evaluate-test', async (req, res) => {
    try {
        const { answers, questions } = req.body;
        console.log('Received answers:', answers);
        console.log('Received questions:', questions);

        // Calculate score
        let correctAnswers = 0;
        const detailedResults = questions.map((question, index) => {
            const isCorrect = answers[index] === question.correctAnswer;
            if (isCorrect) correctAnswers++;
            return {
                question: question.text,
                yourAnswer: answers[index] || 'No answer provided',
                correctAnswer: question.correctAnswer,
                isCorrect: isCorrect
            };
        });

        const score = Math.round((correctAnswers / questions.length) * 100);

        // Generate feedback using ChatGPT
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful AI that provides educational feedback."
                },
                {
                    role: "user",
                    content: `The student scored ${score}% on their test. Based on their detailed results: ${JSON.stringify(detailedResults)}, 
                    provide brief feedback and recommendations for improvement. Return the response in JSON format with 'feedback' and 'recommendations' fields.`
                }
            ],
            temperature: 0.7,
        });

        const aiFeedback = JSON.parse(completion.choices[0].message.content);

        const evaluation = {
            score: score,
            feedback: aiFeedback.feedback,
            recommendations: aiFeedback.recommendations,
            detailedResults: detailedResults
        };

        return res.json(evaluation);

    } catch (error) {
        console.error('Error in evaluate-test:', error);
        res.status(500).json({ error: 'Error evaluating test' });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 