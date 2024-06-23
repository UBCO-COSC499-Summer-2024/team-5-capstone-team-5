import React from 'react';

const Bubble = (props) => {
    
    return (
        <div className="w-6 h-6 rounded-full border-white border-[0.5px] inline-block mx-1">
            <div className="text-center text-sm">{String.fromCharCode(65+props.question)}</div>
        </div>
    );
};

export default Bubble;