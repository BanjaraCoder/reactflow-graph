import React, { useState } from 'react';
import axios from 'axios';

const DeleteCategoryForm: React.FC<{ onClose: () => void; onFetchData: (data: any) => void }> = ({ onClose, onFetchData }) => {
  const [categoryName, setCategoryName] = useState('');

  const handleDelete = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post('https://rapid-govern-be-bg36gz65wa-uc.a.run.app/deleteCategory', {
        category: categoryName,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      onFetchData(response.data);
      onClose();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg">
      <form onSubmit={handleDelete} className="flex flex-col">
        <div className="flex flex-col mb-8">
          <label
            htmlFor="categoryName"
            className="text-black mb-3 font-bold text-lg"
          >
            Topic Name
          </label>
          <input
            type="text"
            id="categoryName"
            className=" border-2 border-black rounded-lg h-12 w-full p-3 bg-[#f4f5f6]"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter Topic Name"
            required
          />
        </div>
        <button
          type="submit"
          className=" h-16 mt-10 mx-12 bg-[#c10104ff] text-white text-xl font-bold rounded-lg text-center"
        >
          Submit
        </button>
      </form>
      <style jsx>{`
        textarea,
        input[type="text"] {
          color: black;
        }
        textarea,
        input[type="text"]::placeholder {
          color: #7f8a8c;
        }
      `}</style>
    </div>
  );
};

export default DeleteCategoryForm;
