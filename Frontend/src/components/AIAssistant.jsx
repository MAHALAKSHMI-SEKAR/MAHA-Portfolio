
import React, { useState } from 'react';
import './AIAssistant.css';
export default function AIAssistant() {
    const [status, setStatus] = useState(false);
    const [message, setmessage] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);
    async function handlemsg(){
        if (inputMessage.trim() === '') return;
        setmessage([...message, inputMessage]);
        setInputMessage('');
        setLoading(true);

        try {
            const response = await fetch('https://maha-portfolio-a7x7.onrender.com/api/ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: inputMessage }),
            });
            if (!response.ok) {
                throw new Error('Failed to get AI response');
            }

            const reply = await response.text();
            setmessage((previous) => [...previous, reply]);

        } catch (error) {
            console.error('AI assistant error:', error);
            setmessage((previous) => [
                ...previous,
                'Sorry, I could not connect to the AI. Please try again.'
            ]);
        } finally {
            setLoading(false);
        }
    }
  return (
    <>
      <div className="ai-assistant">
        {status && (
          <div className="ai-chat-window">
            <div className="ai-header">
              <h3>🤖 Maha AI Assistant</h3>
              <button
                onClick={() => setStatus(false)}
                aria-label="Close chat"
              >
                x
              </button>
            </div>

            <div className="ai-body">
              <p className="ai-welcome">
                Hi! 👋 Welcome to my portfolio.
                How can I help you?
              </p>
            </div>
            {message.map((msg,index)=>(
                <p key={index} className="ai-message">
                    {msg}
                </p>
            ))}
            <div className="ai-input-area">
                <input
                    type="text"
                    placeholder="Type your message ..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                />
                <button onClick={handlemsg} disabled={loading}>
                    {loading ? '...' : '➤'}
                </button>
            </div>
          </div>
        )}

        <button
          className="ai-floating-button"
          onClick={() => setStatus(!status)}
          aria-label={status ? 'Close AI assistant' : 'Open AI assistant'}
          aria-expanded={status}
        >
          💬
        </button>
      </div>
    </>
  );
}