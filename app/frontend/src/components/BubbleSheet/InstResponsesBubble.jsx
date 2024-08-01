import React, { useState } from "react";

let responses = [];
let responseData = [];
let student;
let exam;

const saveResponses = async (onClose) => {
  let responsesToDatabase = [];
  for (let i = 0; i < responses.length; i++) {
    if (
      !ArraysContainSameElements(
        responses[i].response,
        responseData[i].response
      )
    ) {
      responsesToDatabase.push({
        questionNum: responses[i].question,
        responseArray: responses[i].response,
      });
    }
  }
  try {
    const response = await fetch(`HTTP://localhost/API/responses/edit/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token if needed
      },
      body: JSON.stringify({
        exam_id: exam,
        student_id: student,
        modifiedResponses: responsesToDatabase,
      }),
    });
    if (response.ok) {
      console.log("updated resposnes successfully");
      onClose();
    }
  } catch (error) {
    console.error("Error updating resposnes", error);
  }
};

function ArraysContainSameElements(arr1, arr2) {
  arr1.sort();
  arr2.sort();
  if (arr1.length === arr2.length) {
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}

function Bubble(props) {
  const isCorrect = props.isCorrect;
  const [isSelected, setIsSelected] = useState(props.isSelected);
  const onSelect = (option) => {
    setIsSelected(!isSelected);
    if (responses[props.index].response.includes(option)) {
      responses[props.index].response = responses[props.index].response.filter(
        (item) => {
          return item !== option;
        }
      );
    } else {
      responses[props.index].response.push(option);
    }
    if (
      ArraysContainSameElements(
        responses[props.index].response,
        responseData[props.index].response
      )
    ) {
      props.setModified(false || responseData[props.index.was_modified]);
    } else {
      props.setModified(true);
    }
  };
  let color = "bg-gray-700";
  if (isCorrect) {
    if (isSelected) {
      color = "bg-green-500";
    } else {
      color = "bg-yellow-600";
    }
  } else if (isSelected) {
    color = "bg-red-700";
  }
  return (
    <div
      key={props.option}
      className={`w-8 h-8 flex items-center justify-center rounded-full border cursor-pointer
         ${color} text-white mx-1 my-0.5`}
      onClick={() => {
        onSelect(props.option);
      }}
    >
      <p>{String.fromCharCode(props.option + 65)}</p>
    </div>
  );
}

function CreateBubbles(props) {
  const questionIndex = props.index;
  const responseItem = props.responseItem;
  const [modified, setModified] = useState(responseItem.was_modified);
  if (typeof props.responseItem !== "undefined") {
    let bubbles = [];
    for (let i = 0; i < responseItem.num_options; i++) {
      let isSelected = responseItem.response.includes(i);
      let isCorrect = responseItem.correct_answer.includes(i);
      bubbles.push(
        <Bubble
          key={i}
          option={i}
          letter={String.fromCharCode(i + 65)}
          isSelected={isSelected}
          isCorrect={isCorrect}
          modified={modified}
          setModified={setModified}
          responses={props.responseItem.response}
          index={props.index}
        />
      );
    }
    let textColor = modified ? "text-yellow-600" : "text-white";
    return (
      <div
        key={responseItem.question_num}
        className="bg-gray-900 flex space-x-2 flex-right p-[2px] px-[5px] w-auto mb-3"
      >
        <p className={`w-[105px] mt-[5px] ${textColor}`}>
          Question: {String(responseItem.question_num)}
        </p>
        {bubbles}
      </div>
    );
  } else {
  }
}

function InstResponseBubbles(props) {
  student = props.student;
  exam = props.exam;
  responseData = props.responseData;
  if (typeof props.responseData !== "undefined") {
    let index = 0;
    responses = [];
    return (
      <>
        <div
          key={responseData[0].userId}
          className="bg-gray-900 overflow-y-scroll absolute right-5 top-14 p-[5px] pr-[8px] m-10 h-[75%] rounded-lg"
        >
          {responseData.map((responseItem) => {
            let response = [];
            for (let i = 0; i < responseItem.response.length; i++) {
              response.push(responseItem.response[i]);
            }
            responses.push({
              index: index,
              question: responseItem.question_num,
              response: response,
            });
            index++;
            return (
              <CreateBubbles
                responseItem={responseItem}
                index={index - 1}
                key={responseItem.question_id}
              />
            );
          })}
        </div>
        <div className="flex justify-end mx-48">
          <button
            className="bg-gray-900 p-2 rounded-lg"
            onClick={() => {
              saveResponses(props.onClose);
            }}
          >
            <p>Save!</p>
          </button>
        </div>
      </>
    );
  } else {
  }
}

export default InstResponseBubbles;
