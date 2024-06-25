import React from "react";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import AnimatedProgressProvider from './AnimatedProgressProvider';
import { easeQuadIn } from 'd3-ease';

export default function CircularProgressBar({ percentage, width, height }) {
    const data = parseFloat(percentage); // Convert percentage to a floating-point number
    return (
        <AnimatedProgressProvider
            valueStart={0}
            valueEnd={data} // Use the converted value
            duration={2}
            easingFunction={easeQuadIn}
        >
            {(value) => {
                const roundedValue = Math.round(value * 100); // Round the value
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
                            value={value * 100}
                            text={`${roundedValue}%`}
                            styles={{
                                root: {},
                                path: {
                                    stroke: color,
                                    strokeLinecap: 'round',
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
                                    textAnchor: 'middle',
                                    dominantBaseline: 'middle',
                                },
                                background: {
                                    fill: '#00000',
                                },
                            }}
                        />
                    </div>
                );
            }}
        </AnimatedProgressProvider>
    );
}
