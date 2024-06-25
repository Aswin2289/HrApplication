import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function BarChart({ employeeCount, activeCount, inactiveCount }) {
  const barChartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (barChartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      const ctx = barChartRef.current.getContext("2d");
      chartInstanceRef.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Total Employees", "On Premises", "On Vacation"],
          datasets: [
            {
              label: "Employee Counts",
              data: [employeeCount, activeCount, inactiveCount],
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
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [employeeCount, activeCount, inactiveCount]);

  return <canvas id="employeeChart" width="200" height="100" ref={barChartRef}></canvas>;
}

export default BarChart;

