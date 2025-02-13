import React, { useState } from 'react';
import axios from 'axios';

const AddTopicForm: React.FC<{ onClose: () => void; onFetchData: (data: any) => void }> = ({ onClose, onFetchData }) => {
  const [topicName, setTopicName] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post('https://rapid-govern-be-bg36gz65wa-uc.a.run.app/get_category_questions_by_date', {
        category: topicName,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      onFetchData(response.data);
      onClose();
    } catch (error) {
      console.error('Error fetching category questions:', error);
    }
  };

  return (
    <div className="popup">
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="topicName">Topic Name</label>
          <input
            type="text"
            id="topicName"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            placeholder="Enter Topic Name"
            required
          />
        </div>

        <button type="submit" className="submit-button">Fetch Data</button>
      </form>

      <style jsx>{`
        .popup {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          width: 400px;
          margin: auto;
          position: relative;
        }
        .form {
          display: flex;
          flex-direction: column;
        }
        .form-group {
          margin-bottom: 15px;
        }
        .form-group label {
          display: block;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .form-group input {
          width: 100%;
          padding: 8px;
          border-radius: 5px;
          border: 1px solid #ccc;
        }
        .submit-button {
          background-color: #007bff;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }
        .submit-button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default AddTopicForm;
