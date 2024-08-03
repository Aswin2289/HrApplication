import Addemployee from "../components/addemployee";
import Layout from "../components/Layout";
import AddEemployeePageImage from "./addemployeepageimage/addemployeepageimage";

function AddEmployeePage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-8">
          <div className="flex-shrink-0 mt-6 lg:mt-0 lg:w-2/4">
            <AddEemployeePageImage />
          </div>
          <div className="flex-1 ">
            <Addemployee />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AddEmployeePage;
