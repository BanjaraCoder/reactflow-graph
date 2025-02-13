import upgradeImage from "../../../assets/upgrade_premium.svg";
import Exclamation from "../../../assets/exclamation.svg";

export default function Upgrade() {
  return (
    <div
      className="w-full m-auto h-14 bg-no-repeat flex items-center pb-2"
      style={{
        backgroundImage: `url(${upgradeImage})`,
        backgroundSize: "100%",
      }}
    >
      <div className="flex items-center ml-4">
        <img src={Exclamation} alt="" />
        <span className="ml-3 text-white">
          Upgrade to premium, and get more details features!{" "}
          <span className="font-bold ml-1"> Upgrade Now</span>
        </span>
      </div>
    </div>
  );
} 