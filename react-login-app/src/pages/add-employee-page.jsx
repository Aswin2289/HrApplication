import Addemployee from "../components/addemployee";
import Layout from "../components/Layout";
import AddEemployeePageImage from "./addemployeepageimage/addemployeepageimage";
function AddEmployeePage() {
  return (
    <div>
      <Layout>

        <div className="flex justify-between">
          <AddEemployeePageImage />
          <Addemployee />
        </div>
      </Layout>
    </div>
  );
}
export default AddEmployeePage;
