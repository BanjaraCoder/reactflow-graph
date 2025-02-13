import { useState, useEffect } from "react";
import Upgrade from "../../components/ui/upgrade/upgrade";
import Questions from "./questions";
import BarChart from "./barchart_questions";
import UnansweredQuestions from "./unanswered_questions";
import Table from "./table1";
import TopUserQuestions from "./pop-up_top_questions";
import Category_list from "./category_list";
import CategoryForm from "./category_form";
import DeleteCategoryForm from "./DeleteCategoryForm";
import { search } from "../../assets";
import filterGovern from "../../assets/filter_govern.svg";
import categoryGovern from "../../assets/category_govern.svg";
import filter_line from "../../assets/filter_line.svg";
import Category_list1 from "./pop_unanswered.tsx";
import NewQuestion from "./new_question";
import Modal from "react-responsive-modal";
import Popup from "./Popup.tsx";
import "./popup.css";

interface StatusProps {
  name: string;
  color: string;
  status: string;
}

export default function Assess() {
  const [unansweredCount, setUnansweredCount] = useState<number>(0);
  const [categories, setCategories] = useState([]);
  const [options, setOptions] = useState(0);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isCategoryPopupOpen, setCategoryPopupOpen] = useState(false);
  const [isViewMorePopupOpen, setViewMorePopupOpen] = useState(false);
  const [isUnansweredPopupOpen, setUnansweredPopupOpen] = useState(false);
  const [isDeleteCategoryPopupOpen, setDeleteCategoryPopupOpen] =
    useState(false);
  const [isNewQuestionPopupOpen, setNewQuestionPopupOpen] = useState(false); // State for New Question popup
  const [isTopQuestionPopupOpen, setTopQuestionPopupOpen] = useState(false); // State for Top Questions popup
  const [isUnansweredQuestionsPopupOpen, setUnansweredQuestionsPopupOpen] =
    useState(false); // State for Unanswered Questions popup

  const handleThreeDotsClick = () => {
    console.log("Three dots clicked");
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    console.log("Closing popup");
    setPopupOpen(false);
  };

  const handleViewMoreClick = () => {
    console.log("View More clicked");
    setViewMorePopupOpen(true);
  };

  const handleCloseViewMorePopup = () => {
    console.log("Closing View More popup");
    setViewMorePopupOpen(false);
  };

  const handleAddCategoryClick = () => {
    console.log("Add Category clicked");
    setCategoryPopupOpen(true);
  };

  const handleCloseCategoryPopup = () => {
    console.log("Closing Add Category popup");
    setCategoryPopupOpen(false);
  };

  const handleDeleteCategoryClick = () => {
    console.log("Delete Category clicked");
    setDeleteCategoryPopupOpen(true);
  };

  const handleCloseDeleteCategoryPopup = () => {
    console.log("Closing Delete Category popup");
    setDeleteCategoryPopupOpen(false);
  };

  const handleRobotClick = () => {
    console.log("Robot clicked");
    setUnansweredPopupOpen(true);
  };

  const handleCloseUnansweredPopup = () => {
    console.log("Closing Unanswered popup");
    setUnansweredPopupOpen(false);
  };

  const handleNewQuestionViewMoreClick = () => {
    console.log("View More for New Questions clicked");
    setNewQuestionPopupOpen(true);
  };

  const handleCloseNewQuestionPopup = () => {
    console.log("Closing New Question popup");
    setNewQuestionPopupOpen(false);
  };

  const handleTopQuestionViewMoreClick = () => {
    console.log("View More for Top Questions clicked");
    setTopQuestionPopupOpen(true);
  };

  const handleCloseTopQuestionPopup = () => {
    console.log("Closing Top Question popup");
    setTopQuestionPopupOpen(false);
  };

  const handleUnansweredQuestionsViewMoreClick = () => {
    console.log("View More for Unanswered Questions clicked");
    setUnansweredQuestionsPopupOpen(true);
  };

  const handleCloseUnansweredQuestionsPopup = () => {
    console.log("Closing Unanswered Questions popup");
    setUnansweredQuestionsPopupOpen(false);
  };

  useEffect(() => {
    fetch(
      "https://rapid-govern-be-bg36gz65wa-uc.a.run.app/unanswered_questions_count",
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
        setUnansweredCount(data.unanswered_questions_count);
      })
      .catch((err) =>
        console.error("Error fetching unanswered questions count:", err)
      );
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://rapid-govern-be-bg36gz65wa-uc.a.run.app/getCurrentCategories",
        {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "69420",
            Accept: "application/json",
          },
        }
      );
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteCategory = (categoryName: string) => {
    setCategories(
      categories.filter((category) => category.category !== categoryName)
    );
  };

  const promptData = [
    {
      name: "Top Questions",
      number: "20",
      isHighlighted: false,
      onViewMoreClick: handleTopQuestionViewMoreClick, // Pass the handler for Top Questions
    },
    {
      name: "New Questions",
      number: "20",
      isHighlighted: false,
      onViewMoreClick: handleNewQuestionViewMoreClick, // Pass the handler for New Questions
    },
    {
      name: "Unanswered Questions",
      number: unansweredCount.toString(),
      isHighlighted: false,
      onViewMoreClick: handleUnansweredQuestionsViewMoreClick, // Pass the handler for Unanswered Questions
    },
  ];
  return (
    <div>
      <div className="w-full flex flex-col px-4">
        <Upgrade />
        <div className="flex flex-1 space-x-5 py-4">
          <div className="w-[30%] box-border flex flex-col items-center justify-center">
            <div className="flex flex-col w-full space-y-3">
              {promptData.map((info, index) => (
                <Questions
                  name={info.name}
                  number={info.number}
                  isHighlighted={info.isHighlighted}
                  onViewMoreClick={info.onViewMoreClick} // Pass the handler from the prompt data
                />
              ))}
            </div>
          </div>
          <div className="w-[60%] border border-[#ccc] rounded-lg ">
            <BarChart />
          </div>
          <div className="w-[30%]">
            <UnansweredQuestions onRobotClick={handleRobotClick} />
          </div>
        </div>
        <div className="border rounded-xl mt-5 bg-white w-full py-4">
          <Table options={categories} handleDeleteCategory={handleDeleteCategory}/>
        </div>
      </div>
      <Popup isOpen={isPopupOpen} onClose={handleClosePopup}>
        <TopUserQuestions />
      </Popup>

      {/* Popup for Category Form */}
      <Modal
        open={isCategoryPopupOpen}
        center
        onClose={handleCloseCategoryPopup}
      >
        <CategoryForm onClose={handleCloseCategoryPopup} />
      </Modal>

      {/* Popup for View More */}
      <Modal
        open={isViewMorePopupOpen}
        onClose={handleCloseViewMorePopup}
        center
      >
        <Category_list /> {/* Ensure this shows Category_list */}
      </Modal>

      {/* Popup for Unanswered Questions */}
      <Popup
        isOpen={isUnansweredPopupOpen}
        onClose={handleCloseUnansweredPopup}
      >
        <Category_list1 />
      </Popup>

      {/* Popup for Delete Category */}
      <Modal
        open={isDeleteCategoryPopupOpen}
        onClose={handleCloseDeleteCategoryPopup}
        center
      >
        <DeleteCategoryForm
          onClose={handleCloseDeleteCategoryPopup}
          onDelete={handleDeleteCategory}
        />
      </Modal>

      {/* Popup for New Questions */}
      <Popup
        isOpen={isNewQuestionPopupOpen}
        onClose={handleCloseNewQuestionPopup}
      >
        <NewQuestion />
      </Popup>

      {/* Popup for Top Questions */}
      <Popup
        isOpen={isTopQuestionPopupOpen}
        onClose={handleCloseTopQuestionPopup}
      >
        <TopUserQuestions />
      </Popup>

      {/* Popup for Unanswered Questions */}
      <Popup
        isOpen={isUnansweredQuestionsPopupOpen}
        onClose={handleCloseUnansweredQuestionsPopup}
      >
        <Category_list1 />
      </Popup>
    </div>
  );
  return (
    <div className="">
      <div className="w-full border-2 border-black">
        <Upgrade />

        <div className="flex flex-col md:flex-row justify-between p-4 space-y-2 md:space-y-0 md:space-x-2">
          <div className="flex flex-col w-full space-y-2">
            {promptData.map((info, index) => (
              <div key={index} className="flex items-center">
                <Questions
                  name={info.name}
                  number={info.number}
                  isHighlighted={info.isHighlighted}
                  onViewMoreClick={info.onViewMoreClick} // Pass the handler from the prompt data
                />
              </div>
            ))}
          </div>

          <div className="flex-1 mx-4">
            <div className="border rounded-lg p-7 bg-white">
              <BarChart />
            </div>
          </div>

          <div className="flex flex-col w-full md:w-1/4 space-y-6 items-end">
            <UnansweredQuestions onRobotClick={handleRobotClick} />
          </div>
        </div>

        <div className="border rounded-xl mt-5 p-4 bg-white shadow">
          <div className="flex items-center p-2 rounded-md  w-fit ml-[79rem] space-x-10">
            {/* Search Input */}
            <button
              className="flex items-center border-2 bg-gray-50 rounded-lg px-4 py-2 ml-auto"
              onClick={handleAddCategoryClick}
            >
              <span> + Add Topic</span>
            </button>

            <button
              className="flex items-center border-2 bg-gray-50 rounded-lg px-4 py-2 ml-auto"
              onClick={handleDeleteCategoryClick}
            >
              <span> - Delete Topic</span>
            </button>

            {/* View More Button */}
            <button
              className="flex items-center border-2 bg-gray-50 rounded-lg px-4 py-2 ml-auto"
              onClick={handleViewMoreClick}
            >
              <span>View More</span>
            </button>
          </div>
          <Table options={categories} />
        </div>
      </div>
      {/* Existing Popup */}
      <Popup isOpen={isPopupOpen} onClose={handleClosePopup}>
        <TopUserQuestions />
      </Popup>

      {/* Popup for Category Form */}
      <Modal
        open={isCategoryPopupOpen}
        center
        onClose={handleCloseCategoryPopup}
      >
        <CategoryForm onClose={handleCloseCategoryPopup} />
      </Modal>

      {/* Popup for View More */}
      <Modal
        open={isViewMorePopupOpen}
        onClose={handleCloseViewMorePopup}
        center
      >
        <Category_list /> {/* Ensure this shows Category_list */}
      </Modal>

      {/* Popup for Unanswered Questions */}
      <Popup
        isOpen={isUnansweredPopupOpen}
        onClose={handleCloseUnansweredPopup}
      >
        <Category_list1 />
      </Popup>

      {/* Popup for Delete Category */}
      <Popup
        isOpen={isDeleteCategoryPopupOpen}
        onClose={handleCloseDeleteCategoryPopup}
      >
        <DeleteCategoryForm
          onClose={handleCloseDeleteCategoryPopup}
          onDelete={handleDeleteCategory}
        />
      </Popup>

      {/* Popup for New Questions */}
      <Popup
        isOpen={isNewQuestionPopupOpen}
        onClose={handleCloseNewQuestionPopup}
      >
        <NewQuestion />
      </Popup>

      {/* Popup for Top Questions */}
      <Popup
        isOpen={isTopQuestionPopupOpen}
        onClose={handleCloseTopQuestionPopup}
      >
        <TopUserQuestions />
      </Popup>

      {/* Popup for Unanswered Questions */}
      <Popup
        isOpen={isUnansweredQuestionsPopupOpen}
        onClose={handleCloseUnansweredQuestionsPopup}
      >
        <Category_list1 />
      </Popup>
    </div>
  );
}
