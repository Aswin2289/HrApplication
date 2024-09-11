import React from "react";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import AnimatedProgressProvider from './AnimatedProgressProvider';
import { easeQuadIn } from 'd3-ease';

export default function CircularProgressBar({ percentage, width, height }) {
    const data = parseFloat(percentage) || 0; // Ensure valid percentage
    
    return (
        <AnimatedProgressProvider
            valueStart={0}
            valueEnd={data} // Use the correct percentage
            duration={2} // 2 seconds for animation
            easingFunction={easeQuadIn}
        >
            {(value) => {
                value=data;
                const roundedValue = Math.round(value); // Round for display

                let color;
                if (roundedValue < 50) {
                    color = 'red';
                } else if (roundedValue < 75) {
                    color = 'orange';
                } else {
                    color = 'green';
                }

                return (
                    <div style={{ width: width, height: height }}>
                        <CircularProgressbar
                            value={roundedValue} // Set the value directly as percentage
                            text={`${roundedValue}%`} // Display the percentage text
                            styles={{
                                path: {
                                    stroke: color,
                                    strokeLinecap: 'round',
                                    transition: 'stroke-dashoffset 0.5s ease 0s',
                                },
                                trail: {
                                    stroke: '#d6d6d6',
                                    strokeLinecap: 'round',
                                    transform: 'rotate(0.25turn)',
                                    transformOrigin: 'center center',
                                },
                                text: {
                                    fill: color,
                                    fontSize: '20px',
                                },
                            }}
                        />
                    </div>
                );
            }}
        </AnimatedProgressProvider>
    );
}
