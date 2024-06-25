import addLeaveImage from "../../../profile/created.gif"; // Import the add leave image
import Lottie from 'lottie-react';
import addLeaveAnimation from '../../../profile/Animation - 1717847396796.json';
function AddLeaveImage() {
  return (
    <div className="w-2/3 h-2/3">
      <Lottie animationData={addLeaveAnimation} loop={true} />
    </div>
  );
}
export default AddLeaveImage;
