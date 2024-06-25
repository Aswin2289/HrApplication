import myImage from "../../profile/Creative Team.gif";

function AddEmployeePageImage() {
  return (
    <>
    <div className="flex flex-col">
    <h2 className="text-2xl font-bold mb-4">Add Employee</h2>
    <div className="flex">
      
      <img src={myImage} alt="Funny GIF"  />
    </div>
    </div>
    </>

  );
}

export default AddEmployeePageImage;
