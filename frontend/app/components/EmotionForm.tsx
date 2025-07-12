// components/EmotionForm.tsx
import { useState } from 'react';
import styles from '../styles/Home.module.css';

type EmotionResult = {
  emotion: string;
  confidence: number;
};

export default function EmotionForm() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmotionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeEmotion = async () => {
    if (!text.trim()) {
      setError('Please enter some text');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('Analysis failed');
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Failed to analyze emotion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Emotion Reflection Tool</h1>
      <div className="form-group">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="How are you feeling today?"
          rows={4}
        />
      </div>
      <button onClick={analyzeEmotion} disabled={loading}>
        {loading ? 'Analyzing...' : 'Submit'}
      </button>
      
      {error && <div className="error">{error}</div>}
      
      {result && (
        <div className="result-card">
          <h3>Analysis Result</h3>
          <p>Emotion: <strong>{result.emotion}</strong></p>
          <p>Confidence: {(result.confidence * 100).toFixed(1)}%</p>
        </div>
      )}
    </div>
  );
}