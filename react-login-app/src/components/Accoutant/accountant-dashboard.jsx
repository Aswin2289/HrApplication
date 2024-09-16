import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import CircularProgressBar from "../Progressbar/CircularProgressBar";
import CardCounter from "../Progressbar/CardCounter";
import AnimatedProgressProvider from "../Progressbar/AnimatedProgressProvider";
import CircularProgress from "@mui/material/CircularProgress";
import useTotalEmployees from "../../hooks/useTotalEmployees";
import { useNavigate } from "react-router-dom";

function AccountantDashboard() {
  const { totalEmployees, isLoading, error } = useTotalEmployees();
  const [total, setTotal] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [vacationCount, setVacationCount] = useState(0);
  const [qidExpire, setQidExpire] = useState(0);
  const [passportExpire, setPassportExpire] = useState(0);
  const [licenseExpire, setLicenseExpire] = useState(0);
  const [statusRender, setStatusRender] = useState(0);
  const [istimaraExpire, setIstimaExpire] = useState(0);
  const [insuranceExpire, setInsuranceExpire] = useState(0);
  const [documentExpire, setDocumentExpire] = useState(0);
  const navigate = useNavigate();

  const barChartRef = useRef(null);
  const barChartInstance = useRef(null);

  useEffect(() => {
    if (totalEmployees && totalEmployees.body) {
      setTotal(totalEmployees.body.total || 0);
      setActiveCount(totalEmployees.body.activeCount || 0);
      setVacationCount(totalEmployees.body.vacationCount || 0);
      setQidExpire(totalEmployees.body.qidExpire || 0);
      setPassportExpire(totalEmployees.body.passportExpire || 0);
      setLicenseExpire(totalEmployees.body.licenseExpire || 0);
      setIstimaExpire(totalEmployees.body.istimaExpire || 0);
      setInsuranceExpire(totalEmployees.body.insuranceExpire || 0);
      setDocumentExpire(totalEmployees.body.documentExpire || 0);
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
    setStatusRender(6);
    navigate("/listVehicle", { state: { statusRender: 6 } });
  };
  const handleInsuranceExpire = () => {
    setStatusRender(7);
    navigate("/listVehicle", { state: { statusRender: 7 } });
  };
  const handleDocumentExpire = () => {
    setStatusRender(8);
    navigate("/listDocument", { state: { statusRender: 8 } });
  };
  const calculatePercentage = (total, value) => {
    if (total === 0) return 0;
    return (value / total) * 100;
  };
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-200 p-4 rounded-lg shadow-md flex justify-between items-center">
          <div
            onClick={handleTotalEmployee}
            className="cursor-pointer hover:rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            <h3 className="text-xl font-normal">Total Employee</h3>
            <CardCounter value={total} />
          </div>
        </div>
        <div className="bg-red-200 p-4 rounded-lg shadow-md flex justify-between items-center">
          <div
            onClick={handleActiveEmployee}
            className="cursor-pointer hover:rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            <h3 className="text-xl font-normal">On premises Employee</h3>
            <CardCounter value={activeCount} />
          </div>
          <div>
            {activeCount !== undefined && activeCount !== 0 && (
              <AnimatedProgressProvider
                valueStart={0}
                valueEnd={activeCount}
                duration={2}
                easingFunction={(t) => t}
              >
                {(value) => (
                  <CircularProgressBar
                    percentage={calculatePercentage(total, activeCount)}
                    width="50px"
                    height="50px"
                  />
                )}
              </AnimatedProgressProvider>
            )}
          </div>
        </div>
        <div className="bg-red-200 p-4 rounded-lg shadow-md flex justify-between items-center">
          <div
            onClick={handleVacationEmployee}
            className="cursor-pointer hover:rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            <h3 className="text-xl font-normal">On Vacation</h3>
            <CardCounter value={vacationCount} />
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
                  percentage={calculatePercentage(total, vacationCount)}
                  width="50px"
                  height="50px"
                />
              )}
            </AnimatedProgressProvider>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="bg-red-200 p-4 rounded-lg shadow-md flex items-center">
          {/* Card Counter on the Left */}
          <div className="flex-shrink-0 mr-4 ml-3">
            <CardCounter value={qidExpire} className="text-9xl" />{" "}
            {/* Adjust size as needed */}
          </div>

          {/* Text Content on the Right */}
          <div className="flex-1 ml-4">
            <div
              onClick={handleQidExpireeEmployee}
              className="cursor-pointer hover:rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              <h3 className="text-xl font-bold">{`QID Expire`}</h3>
              <span className="block text-sm mt-4">Number of persons</span>
            </div>
          </div>
        </div>

        <div className="bg-red-200 p-4 rounded-lg shadow-md flex items-center">
          {/* Card Counter on the Left */}
          <div className="flex-shrink-0 mr-4 ml-3">
            <CardCounter value={passportExpire} className="text-9xl" />{" "}
            {/* Adjust size as needed */}
          </div>

          {/* Text Content on the Right */}
          <div className="flex-1 ml-4">
            <div
              onClick={handlePassportExpireeEmployee}
              className="cursor-pointer hover:rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              <h3 className="text-xl font-bold">{`Passport Expire`}</h3>
              <span className="block text-sm mt-4">Number of persons</span>
            </div>
          </div>
        </div>

        <div className="bg-red-200 p-4 rounded-lg shadow-md flex items-center">
          {/* Card Counter on the Left */}
          <div className="flex-shrink-0 mr-4 ml-3">
            <CardCounter value={licenseExpire} className="text-9xl" />{" "}
            {/* Adjust size as needed */}
          </div>

          {/* Text Content on the Right */}
          <div className="flex-1 ml-4">
            <div
              onClick={handleLicenseExpireeEmployee}
              className="cursor-pointer hover:rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              <h3 className="text-xl font-bold">{`License Expire`}</h3>
              <span className="block text-sm mt-4">Number of persons</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* Third Row */}
        <div className="col-span-2 bg-gray-100 p-4 rounded-lg shadow-md flex flex-col justify-between items-center">
          <canvas ref={barChartRef} width="400" height="200"></canvas>
        </div>
        <div className="flex flex-col gap-3">
          <div className="bg-red-200 p-4 rounded-lg shadow-md flex items-center">
            {/* Card Counter on the Left */}
            <div className="flex-shrink-0 mr-4 ml-3">
              <CardCounter value={istimaraExpire} className="text-9xl" />{" "}
              {/* Adjust size as needed */}
            </div>

            {/* Text Content on the Right */}
            <div className="flex-1 ml-4">
              <div
                onClick={handleIstimaExpire}
                className="cursor-pointer hover:rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                <h3 className="text-xl font-bold">{`Istimara Expire`}</h3>
                <span className="block text-sm mt-4">Number of vehicles</span>
              </div>
            </div>
          </div>
          <div className="bg-red-200 p-4 rounded-lg shadow-md flex items-center">
            {/* Card Counter on the Left */}
            <div className="flex-shrink-0 mr-4 ml-3">
              <CardCounter value={insuranceExpire} className="text-9xl" />{" "}
              {/* Adjust size as needed */}
            </div>

            {/* Text Content on the Right */}
            <div className="flex-1 ml-4">
              <div
                onClick={handleInsuranceExpire}
                className="cursor-pointer hover:rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                <h3 className="text-xl font-bold">{`Insurance Expire`}</h3>
                <span className="block text-sm mt-4">Number of vehicles</span>
              </div>
            </div>
          </div>

          <div className="bg-red-200 p-4 rounded-lg shadow-md flex items-center">
            {/* Card Counter on the Left */}
            <div className="flex-shrink-0 mr-4 ml-3">
              <CardCounter value={documentExpire} className="text-9xl" />{" "}
              {/* Adjust size as needed */}
            </div>

            {/* Text Content on the Right */}
            <div className="flex-1 ml-4">
              <div
                onClick={handleDocumentExpire}
                className="cursor-pointer hover:rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                <h3 className="text-xl font-bold">{`Document Expire`}</h3>
                <span className="block text-sm mt-4">Number of documents</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AccountantDashboard;
