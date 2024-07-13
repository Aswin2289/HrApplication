import React, { useState, useEffect, useRef } from "react";
import Layout from "../Layout";
import Chart from "chart.js/auto";
import CircularProgressBar from "../Progressbar/CircularProgressBar";
import CardCounter from "../Progressbar/CardCounter";
import AnimatedProgressProvider from "../Progressbar/AnimatedProgressProvider";
import CircularProgress from "@mui/material/CircularProgress";
import useTotalEmployees from "../../hooks/useTotalEmployees";
import { useNavigate } from "react-router-dom";

function DashboardAdmin() {
  const { totalEmployees, isLoading, error } = useTotalEmployees();
  const [total, setTotal] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [vacationCount, setVacationCount] = useState(0);
  const [qidExpire, setQidExpire] = useState(0);
  const [passportExpire, setPassportExpire] = useState(0);
  const [licenseExpire, setLicenseExpire] = useState(0);
  const [istimaraExpire, setIstimaExpire] = useState(0);
  const [insuranceExpire, setInsuranceExpire] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [statusRender, setStatusRender] = useState(0);
  const navigate = useNavigate();

  const barChartRef = useRef(null);
  const barChartInstance = useRef(null);

  useEffect(() => {
    if (totalEmployees && totalEmployees.body) {
      setTotal(totalEmployees.body.total);
      setActiveCount(totalEmployees.body.activeCount);
      setVacationCount(totalEmployees.body.vacationCount);
      setQidExpire(totalEmployees.body.qidExpire);
      setPassportExpire(totalEmployees.body.passportExpire);
      setLicenseExpire(totalEmployees.body.licenseExpire);
      setIstimaExpire(totalEmployees.body.istimaExpire);
      setInsuranceExpire(totalEmployees.body.insuranceExpire);
    }
  }, [totalEmployees]);

  useEffect(() => {
    if (barChartRef.current) {
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }
      const ctx = barChartRef.current.getContext("2d");
      barChartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Total Employees", "On Premises", "On Vacation"],
          datasets: [
            {
              label: "Employee Counts",
              data: [total, activeCount, vacationCount],
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [total, activeCount, vacationCount, totalEmployees]);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  const handleTotalEmployee = () => {
    navigate("/listEmployee");
    console.log("Total Employee");
  };
  const handleActiveEmployee = () => {
    setStatusRender(1);
    navigate("/listEmployee", { state: { statusRender: 1 } });
  };
  const handleVacationEmployee = () => {
    setStatusRender(2);
    navigate("/listEmployee", { state: { statusRender: 2 } });
  };
  const handleQidExpireeEmployee = () => {
    setStatusRender(3);
    navigate("/listEmployee", { state: { statusRender: 3 } });
  };
  const handlePassportExpireeEmployee = () => {
    setStatusRender(4);
    navigate("/listEmployee", { state: { statusRender: 4 } });
  };
  const handleLicenseExpireeEmployee = () => {
    setStatusRender(5);
    navigate("/listEmployee", { state: { statusRender: 5 } });
  };
  const handleIstimaExpire = () => {
    setStatusRender(5);
    navigate("/listVehicle", { state: { statusRender: 6 } });
  };

  return (
    <Layout>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-red-200 p-4 rounded-lg shadow-md flex justify-between items-center">
          <div
            onClick={handleTotalEmployee}
            className="cursor-pointer hover:rounded-lgcursor-pointer rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            <h3 className="text-xl font-normal">Total Employee</h3>
            <CardCounter value={total} />
          </div>
        </div>
        <div className="bg-red-200 p-4 rounded-lg shadow-md flex justify-between items-center">
          <div
            onClick={handleActiveEmployee}
            className="cursor-pointer hover:p-4 rounded-lgcursor-pointer p-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            <h3 className="text-xl font-normal">Active Employee</h3>
            <CardCounter value={activeCount} />
          </div>
          <div>
            <AnimatedProgressProvider
              valueStart={0}
              valueEnd={activeCount}
              duration={2}
              easingFunction={(t) => t}
            >
              {(value) => (
                <CircularProgressBar
                  percentage={activeCount}
                  width="50px"
                  height="50px"
                />
              )}
            </AnimatedProgressProvider>
          </div>
        </div>
        <div className="bg-red-200 p-4 rounded-lg shadow-md flex justify-between items-center">
          <div
            onClick={handleVacationEmployee}
            className="cursor-pointer hover:p-4 rounded-lgcursor-pointer p-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            <h3 className="text-xl font-normal">On Vacation</h3>
            <CardCounter value={vacationCount} className="fontSize=4xl" />
          </div>
          <div>
            <AnimatedProgressProvider
              valueStart={0}
              valueEnd={vacationCount}
              duration={2}
              easingFunction={(t) => t}
            >
              {(value) => (
                <CircularProgressBar
                  percentage={vacationCount}
                  width="50px"
                  height="50px"
                />
              )}
            </AnimatedProgressProvider>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8 mt-6 justify-center items-center">
        <div className="mt-8">
          <canvas
            id="employeeChart"
            width="200"
            height="100"
            ref={barChartRef}
          ></canvas>
        </div>

        <div className=" p-1 flex flex-col justify-end pl-48">
          <div className="bg-red-200 p-4 rounded-lg shadow-md flex mb-6">
            <div
              onClick={handleQidExpireeEmployee}
              className="cursor-pointer hover:p-4 rounded-lgcursor-pointer p-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              <h3 className="text-xl font-bold">QID Expire</h3>
              <CardCounter value={qidExpire} />
              <span> Number of persons</span>
            </div>
          </div>
          <div className="bg-red-200 p-4 rounded-lg shadow-md flex mb-6">
            <div
              onClick={handlePassportExpireeEmployee}
              className="cursor-pointer hover:p-4 rounded-lgcursor-pointer p-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              <h3 className="text-xl font-bold">Passport Expire</h3>
              <CardCounter value={passportExpire} />
              <span> Number of persons</span>
            </div>
          </div>
          <div className="bg-red-200 p-4 rounded-lg shadow-md flex mb-6">
            <div
              onClick={handleLicenseExpireeEmployee}
              className="cursor-pointer hover:p-4 rounded-lgcursor-pointer p-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              <h3 className="text-xl font-bold">License Expire</h3>
              <CardCounter value={licenseExpire} />
              <span> Number of persons</span>
            </div>
          </div>
          <div className="flex flex-row p-1 gap-3">
            <div className="bg-red-200 p-2 rounded-lg shadow-md flex mb-6">
              <div
                onClick={handleIstimaExpire}
                className="cursor-pointer hover:p-4 rounded-lg p-4  transition duration-300 ease-in-out transform hover:scale-105"
              >
                <h3 className="text-xl font-bold">Istimara Expire</h3>
                <CardCounter value={istimaraExpire} />
                <span> Number of vehicles</span>
              </div>
            </div>
            <div className="bg-red-200 p-2 rounded-lg shadow-md flex mb-6">
              <div
                onClick={handleIstimaExpire}
                className="cursor-pointer hover:p-4 rounded-lg  p-4 r transition duration-300 ease-in-out transform hover:scale-105"
              >
                <h3 className="text-lg font-bold">Insurance Expire</h3>
                <CardCounter value={insuranceExpire} />
                <span> Number of vehicles</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default DashboardAdmin;
