import React, { useState } from "react";
import Bell from "../../components/ui/Bell";
import axios from "axios";

const CategoryForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [categoryName, setCategoryName] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [notifyAdmin, setNotifyAdmin] = useState(false);
  
  const bellColor = notifyAdmin ? "#C10104" : "#000000";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const data = {
      category: categoryName,
      cat_desc: additionalNotes,
    };

    try {
      const response = await axios.post(
        "https://rapid-govern-be-bg36gz65wa-uc.a.run.app/addCategory",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Category added successfully:", response.data);
        onClose(); // Close the popup after successful submission
      } else {
        console.error("Failed to add category:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg">
      <form onSubmit={handleSubmit} className="flex flex-col">
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
          <small className="text-normal mt-2 text-[#7F8A8C]">
            *Enter the full name of the new topic.
          </small>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="additionalNotes"
            className="text-black font-bold text-lg mb-3"
          >
            Additional Notes{" "}
            <span className="text-[#7F8A8C] font-normal">(Required)</span>
          </label>
          <textarea
            id="additionalNotes"
            value={additionalNotes}
            className="border-2 rounded-lg h-32 p-3 bg-[#f4f5f6]"
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="*Provide a detailed description of the types of prompts this topic should include or a definition of the category name."
            required
          ></textarea>
        </div>

        <div className="flex space-x-2  mt-8 items-center ">
          {/* <input
            type="checkbox"
            id="notifyAdmin"
            className="checkbox-custom"
            checked={notifyAdmin}
            onChange={() => setNotifyAdmin(!notifyAdmin)}
          /> */}
          <Bell color={bellColor} onBellClick={() => setNotifyAdmin(!notifyAdmin)}/>
          <p className="text-black">
          Notify admin on topic creation
          </p>
        </div>

        <button
          type="submit"
          className=" h-16 mt-10 bg-[#c10104ff] text-white text-xl font-bold rounded-lg text-center"
        >
          Submit
        </button>
      </form>
      <style jsx>{`
        .checkbox-custom {
          width: 24px; /* Custom width */
          height: 24px; /* Custom height */
        }
        textarea,
        input[type="text"] {
          color: black;
        }
        textarea::placeholder,
        input[type="text"]::placeholder {
          color: #7f8a8c;
        }
      `}</style>
    </div>
  );
};

export default CategoryForm;
