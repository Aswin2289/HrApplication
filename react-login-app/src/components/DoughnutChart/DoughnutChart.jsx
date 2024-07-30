import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function DoughnutChart({ activeCount, inactiveCount }) {
  const doughnutChartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (doughnutChartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      const ctx = doughnutChartRef.current.getContext("2d");
      chartInstanceRef.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["On Premises", "On Vacation"],
          datasets: [
            {
              label: "Employee Status",
              data: [activeCount, inactiveCount],
              backgroundColor: ["#36A2EB", "#FFCE56"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
        },
      });
    }
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [activeCount, inactiveCount]);

  return <canvas id="doughnutChart" width="200" height="200" ref={doughnutChartRef}></canvas>;
}

export default DoughnutChart;
