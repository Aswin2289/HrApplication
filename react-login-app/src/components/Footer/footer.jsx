// src/components/Footer.jsx

import React from "react";

function Footer() {

  const handleOnclic = () => {
    // Implement your logic to handle the click event on the Qatar German Gasket Factory logo
    // For example, you can open a new tab or window to the company's website
    window.open("https://www.netforce.qa/", "_blank");
  };
  return (
    // <footer className="bg-gray-700 p-0 mt-auto">
    <footer className="bg-red-300 bg-opacity-25 rounded-lg p-0 mt-auto bottom-0 left-0 w-full">
      <p className="text-center text-gray-600 mt-2 font-thin text-xs">
        &copy; {new Date().getFullYear()} All rights Reserved | Qatar German
        Gasket Factory
      </p>
      <div className="flex items-center justify-center mb-2">
        <span className="text-red-500 text-xs"> Powerd By: &nbsp;</span>
        <svg
          id="Layer_1"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 146.89 135.12"
          width="30"
          height="34"
          className="cursor-pointer mr-2"
          onClick={handleOnclic}
        >
          <g className="cls-1">
            <g>
              <g>
                <line
                  className="stroke-current stroke-[4.85] fill-current text-gray-800"
                  x1="33.09"
                  y1="27.42"
                  x2="111.67"
                  y2="106.28"
                />
                <line
                  className="stroke-current stroke-[4.85] stroke-linecap-round fill-current text-gray-800"
                  x1="30.28"
                  y1="43.05"
                  x2="30.28"
                  y2="105.3"
                />
                <line
                  className="stroke-current stroke-[4.85] stroke-linecap-round fill-current text-gray-800"
                  x1="43.28"
                  y1="80.38"
                  x2="43.28"
                  y2="108.4"
                />
                <line
                  className="stroke-current stroke-[4.85] stroke-linecap-round fill-current text-gray-800"
                  x1="55.97"
                  y1="70"
                  x2="55.97"
                  y2="104.19"
                />
                <line
                  className="stroke-current stroke-[4.85] stroke-linecap-round fill-current text-gray-800"
                  x1="89.78"
                  y1="30.92"
                  x2="89.78"
                  y2="65.12"
                />
                <line
                  className="stroke-current stroke-[4.85] stroke-linecap-round fill-current text-gray-800"
                  x1="102.42"
                  y1="26.34"
                  x2="102.42"
                  y2="53.16"
                />
                <line
                  className="stroke-current stroke-[4.85] stroke-linecap-round fill-current text-gray-800"
                  x1="115.38"
                  y1="30.92"
                  x2="115.38"
                  y2="90.89"
                />
                <line
                  className="stroke-current stroke-[4.85] stroke-linecap-round fill-current text-gray-800"
                  x1="97.18"
                  y1="109.96"
                  x2="30.28"
                  y2="43.05"
                />
                <line
                  className="stroke-current stroke-[4.85] stroke-linecap-round fill-current text-gray-800"
                  x1="115.38"
                  y1="90.89"
                  x2="49.92"
                  y2="25.43"
                />
                <circle
                  className="stroke-current stroke-[4.04] fill-current text-gray-800"
                  cx="30.28"
                  cy="24.88"
                  r="4.38"
                />
                <circle
                  className="stroke-current stroke-[4.04] fill-current text-gray-800"
                  cx="89.78"
                  cy="24.88"
                  r="4.38"
                />
                <circle
                  className="stroke-current stroke-[4.04] fill-current text-gray-800"
                  cx="115.38"
                  cy="24.88"
                  r="4.38"
                />
                <circle
                  className="stroke-current stroke-[4.04] fill-current text-gray-800"
                  cx="102.42"
                  cy="59.39"
                  r="4.38"
                />
                <circle
                  className="stroke-current stroke-[4.04] fill-current text-gray-800"
                  cx="43.28"
                  cy="75.26"
                  r="4.38"
                />
                <circle
                  className="stroke-current stroke-[4.04] fill-current text-gray-800"
                  cx="30.28"
                  cy="110.32"
                  r="4.38"
                />
                <circle
                  className="stroke-current stroke-[4.04] fill-current text-gray-800"
                  cx="55.97"
                  cy="110.27"
                  r="4.38"
                />
                <circle
                  className="stroke-current stroke-[4.04] fill-current text-gray-800"
                  cx="115.38"
                  cy="109.98"
                  r="4.38"
                />
              </g>
            </g>
          </g>
        </svg>
        <div className="text-gray-500 font-thin cursor-pointer text-xs" onClick={handleOnclic}>NetForce Technologies</div>
      </div>
    </footer>
  );
}

export default Footer;
