import { BeatLoader } from "react-spinners";
import "./Loading.css";

function Loading({ boolloader }) {
  return (
    <div className="space_loader">
      <BeatLoader
        size={15}
        margin={15}
        color={"#A744FF"}
        loading={boolloader}
        speedMultiplier={2}
      />
    </div>
  );
}

export default Loading;
