import React from 'react';
import PropTypes from 'prop-types';
import CountUp from 'react-countup';

const CardCounter = (props)=> {
  return (
    <CountUp
      start={0}
      end={props.value}
      duration={2}
      useGrouping={true}  
      separator=","
      style={{ fontSize: '28px',fontWeight: 'bold'  }} 
    />
  )
}


export default CardCounter


CardCounter.propTypes = {
  value: PropTypes.number.isRequired,
};