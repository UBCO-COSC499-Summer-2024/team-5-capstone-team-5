import React, { useState, useEffect } from 'react';

const Bubble = (props) => {
    const [response, setResponse] = useState(props.question.response);
    const [answers, setAnswers] = useState(props.question.correct_answer);
    const [compared, setCompared] = useState(Array(props.question.num_options).fill(''));

    useEffect(() => {
        const updatedCompared = Array(props.question.num_options).fill('');

        for (let i = 0; i < props.question.num_options; i++) {
            const responseIndex = response.indexOf(i + 1); // responses are assumed to be 1-indexed
            const answerIndex = answers.indexOf(i + 1); // answers are assumed to be 1-indexed
            
            if (responseIndex !== -1 && answerIndex !== -1) {
                updatedCompared[i] = 'green';
            } else if (responseIndex !== -1 && answerIndex === -1) {
                updatedCompared[i] = 'red';
            } else if (responseIndex === -1 && answerIndex !== -1) {
                updatedCompared[i] = 'yellow';
            }
        }

        setCompared(updatedCompared);
    }, [response, answers, props.question.num_options]);

    return (
        <div>
            {compared.map((color, index) => (
                <div
                    key={index}
                    className={`${color === 'green' ? "bg-green-700" : color === 'red' ? "bg-red-700" : color === 'yellow' ? "bg-yellow-500" : ""} w-6 h-6 rounded-full border-white border-[0.5px] inline-block mx-1`}
                >
                    <div className="text-center text-sm">{String.fromCharCode(65 + index)}</div>
                </div>
            ))}
        </div>
    );
};

export default Bubble;