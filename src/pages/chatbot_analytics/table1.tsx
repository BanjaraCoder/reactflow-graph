import React, { useState, useEffect } from "react";
import Modal from "react-responsive-modal";
import CategoryForm from "./category_form";
import DeleteCategoryForm from "./DeleteCategoryForm";
import Category_list from "./category_list";
import Select from "react-select";
import Delete from "../../assets/delete.svg";
import add from "../../assets/add.svg";
import search from "../../assets/Navbar/search.svg";
import filter from "../../assets/filter.svg";
import grate from "../../assets/grate.svg"
import hicon from "../../assets/hicon.svg"

const Table = ({ options }: { options: any }) => {
  return (
    <div className="mt-4 overflow-auto h-64 w-full">
      <table className="min-w-full bg-white">
        <thead className="bg-[#ebefef] text-[#000d0f] rounded">
          <tr>
            <th className="h-12 text-left px-6  text-lg border-r border-gray-300 tracking-wider">
              Questions
            </th>
            <th className="h-12 text-left px-6 text-lg border-r border-gray-300 tracking-wider">
              Topic
            </th>
            <th className="h-12 text-left px-6 text-lg border-r border-gray-300 tracking-wider">
              Frequency
            </th>
          </tr>
        </thead>
        <tbody>
          {options.map((data: any, index: any) => (
            <tr
              key={index}
              className="border-b hover:bg-gray-100 odd:bg-[#B4C0C2]/5 even:bg-[#B4C0C2]/6"
            >
              <td className="px-6 py-4 border-r">{data.question}</td>
              <td className="px-6 py-4 border-r">{data.category}</td>
              <td className="px-6 py-4 border-r">{data.frequency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ParentComponent: React.FC = ({ handleDeleteCategory }) => {
  const [options, setOptions] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState({
    value: "All",
    label: "All",
  });
  const [isCategoryPopupOpen, setCategoryPopupOpen] = useState(false);
  const [isViewMorePopupOpen, setViewMorePopupOpen] = useState(false);
  const [isDeleteCategoryPopupOpen, setDeleteCategoryPopupOpen] =
    useState(false);

  const categoryOptions = categories.map((category) => ({
    value: category,
    label: category,
  }));

  const handleViewMoreClick = () => {
    console.log("View More clicked");
    setViewMorePopupOpen(true);
  };

  const handleAddCategoryClick = () => {
    console.log("Add Category clicked");
    setCategoryPopupOpen(true);
  };

  const handleCloseCategoryPopup = () => {
    console.log("Closing Add Category popup");
    setCategoryPopupOpen(false);
  };

  const handleCloseDeleteCategoryPopup = () => {
    console.log("Closing Delete Category popup");
    setDeleteCategoryPopupOpen(false);
  };

  const handleDeleteCategoryClick = () => {
    console.log("Delete Category clicked");
    setDeleteCategoryPopupOpen(true);
  };

  const handleCloseViewMorePopup = () => {
    console.log("Closing View More popup");
    setViewMorePopupOpen(false);
  };

  useEffect(() => {
    fetch(
      "https://rapid-govern-be-bg36gz65wa-uc.a.run.app/frequent_questions_with_categories",
      {
        method: "GET",
        headers: new Headers({
          "ngrok-skip-browser-warning": "69420",
          Accept: "application/json",
        }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
        setOptions(data.frequent_questions_with_categories);
        const uniqueCategories = Array.from(
          new Set(
            data.frequent_questions_with_categories.map(
              (item: any) => item.category
            )
          )
        );
        setCategories(["All", ...uniqueCategories]);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const filteredOptions =
    selectedCategory.value === "All"
      ? options
      : options.filter((item: any) => item.category === selectedCategory.value);

  const handleCategoryChange = (category) => {
    console.log(category.value);
    setSelectedCategory(category);
  };
  return (
    <div className="w-full">
      <div className="flex justify-between px-4">
        <div className="flex items-center space-x-4">
        <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search"
              className=" py-2 box-border pl-10 border rounded-lg focus:outline-none w-[15rem] h-[2.5rem] bg-[#B4C0C2]/10 border-[#7F8A8C]/20"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <img src={search} alt="" width={20} height={20} />
            </div>
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 border rounded-[4px] p-1 bg-white border-[#7F8A8C]/20">
              <img src={filter} alt="" width={15} height={15} />
            </button>
          </div>
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            options={categoryOptions}
            styles={{
              control: (provided) => ({
                ...provided,
                minWidth: "10rem",
              }),
            }}
          />
          <div className='border bg-gray-50 border-[#ccc] p-1 rounded-lg w-20 h-10 box-border flex items-center justify-center gap-3'>
            <div className='border black p-2 rounded-lg'>
              <img src={grate} alt="" />
            </div>
            <div className='border black p-2 rounded-lg'>
            <img src={hicon} alt="" />
            </div>
          </div>
        </div>
        <div className="flex space-x-5">
          <button
            className="flex items-center border-2 bg-gray-50 rounded-lg px-4 py-2"
            onClick={handleAddCategoryClick}
          >
            <span className="flex items-center gap-2">
              <img className="h-5 w-5" src={add} alt="" />
              Add Topic
            </span>
          </button>

          <button
            className="flex items-center border-2 bg-gray-50 rounded-lg px-4 py-2"
            onClick={handleDeleteCategoryClick}
          >
            <span className="flex items-center gap-2">
              <img className="h-5 w-5" src={Delete} alt="" />
              Delete Topic
            </span>
          </button>

          {/* View More Button */}
          <button
            className="flex items-center border-2 bg-gray-50 rounded-lg px-4 py-2 "
            onClick={handleViewMoreClick}
          >
            <span>View More</span>
          </button>
        </div>
      </div>
      <Table options={filteredOptions} />
      <Modal
        open={isCategoryPopupOpen}
        center
        onClose={handleCloseCategoryPopup}
      >
        <CategoryForm onClose={handleCloseCategoryPopup} />
      </Modal>
      <Modal
        open={isDeleteCategoryPopupOpen}
        onClose={handleCloseDeleteCategoryPopup}
        center
      >
        <DeleteCategoryForm
          onClose={handleCloseDeleteCategoryPopup}
          onFetchData={handleDeleteCategory}
        />
      </Modal>
      <Modal
        open={isViewMorePopupOpen}
        onClose={handleCloseViewMorePopup}
        center
      >
        <Category_list /> {/* Ensure this shows Category_list */}
      </Modal>
    </div>
  );
};

export default ParentComponent;
