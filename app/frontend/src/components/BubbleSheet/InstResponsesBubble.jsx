import React, {useState} from "react";

let responses = [];
let responseData = [];
//(exam_id, question_num, user_id, response, modifying = false)

function ArraysContainSameElements(arr1, arr2) {
  arr1.sort();
  arr2.sort();
  if(arr1.length === arr2.length) {
    for(let i = 0; i < arr1.length; i++) {
      if(arr1[i] !== arr2[i]) {
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
    console.log(option);
    setIsSelected(!isSelected);
    if (responses[props.index].response.includes(option)) {
      responses[props.index].response = responses[props.index].response.filter((item) => {return (item !== option);});
    } else {
      responses[props.index].response.push(option);
    }
    if( ArraysContainSameElements(responses[props.index].response, responseData[props.index].response)) {
      console.log("Arrays are equal");
      props.setModified(false);
    } else {
      console.log("Arrays are not equal");
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
      let isCorrect = responseItem.correct_answer.includes(i)
      bubbles.push(
        <Bubble
          key={i}
          option={i}
          letter={String.fromCharCode(i + 65)}
          isSelected = {isSelected}
          isCorrect = {isCorrect}
          modified = {modified}
          setModified = {setModified}
          responses = {props.responseItem.response}
          index = {props.index}
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
  responseData = props.responseData;
  if (typeof props.responseData !== "undefined") {
    console.log(responseData);
    let index = 0;
    responses = [];
    return (
      <>
        <div
          key={responseData[0].userId}
          className="bg-gray-900 overflow-y-scroll absolute right-5 p-[5px] pr-[8px] m-5 h-[85%]"
        >
          {responseData.map((responseItem) => {
            responses.push({
              index: index,
              question: responseItem.question_id,
              response: responseItem.response,
            });
            index++;
            return (
              <CreateBubbles
                responseItem={responseItem}
                index = {index - 1}
                key={responseItem.question_id}
              />
            );
          })}
        </div>
        <button
          onClick={() => {
            console.log(responses);
          }}
        >
          <p>Save!</p>
        </button>
      </>
    );
  } else {
  }
}

export default InstResponseBubbles;
