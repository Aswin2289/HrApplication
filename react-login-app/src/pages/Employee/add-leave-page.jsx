import AddLeave from "../../components/Employee/add-leave";
import AddLeaveImage from "../../components/Employee/image/add-leave -image";
import LeaveDetails from "../../components/Employee/leave-details";
import Layout from "../../components/Layout";

function AddLeavePage() {
  return (
    <div>
      <Layout>
        {/* <div className="border-b border-gray-300 pb-20 mb-4"> */}
          <LeaveDetails />
          <p></p>
        {/* </div> */}
        <div className="flex ">
          <div className="flex justify-center items-center w-2/3">
            <AddLeaveImage />
          </div>
          <AddLeave />
        </div>
      </Layout>
    </div>
  );
}
export default AddLeavePage;
