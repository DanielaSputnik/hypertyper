import React from 'react'

const Snowflakes = ({ totalSnowflakes = 15 }) => {
    const createArray = length => [...Array(length)];
    return (
        <ul className="snowflakes">
            {createArray(totalSnowflakes).map((i, index) => (
                <li id={i}
                    key={index}
                    ></li>
                )
            )}
        </ul>
    )
}

export default Snowflakes
