import documentVector from "../../assets/document.svg"
import enterArrowVector from "../../assets/enterArrow.svg"

const FrequentPdfPage = ({pdfName, page}) => {
  
  return (
    <div className=" w-full flex flex-col mb-8">
      <div className="flex items-center space-x-2 mb-2">
        <img src={enterArrowVector} alt="" className="h-4 w-4" />
        <p className="w-full  overflow-hidden text-ellipsis whitespace-nowrap" title={pdfName}>{pdfName}</p>
      </div>
      <div className=" border border-[#ccc] h-12 rounded-lg box-border px-2 flex space-x-2 items-center">
        <img src={documentVector} alt="" className="w-5 h-5" />
        <span className="text-lg text-[#7F8A8C]">Page:</span>
        <span className="text-lg">{page}</span>
      </div>
    </div>
  );
};

export default FrequentPdfPage;
