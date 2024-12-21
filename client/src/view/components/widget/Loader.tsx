import { ScaleLoader } from "react-spinners";

function Loader() {
  return (
    <div className="min-h-[500px] flex justify-center items-center">
      <ScaleLoader color="#0e8bff" />
    </div>
  );
}

export default Loader;
