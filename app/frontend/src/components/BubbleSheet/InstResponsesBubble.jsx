import React, {useState} from "react";

let modifiedResponses = [];
//(exam_id, question_num, user_id, response, modifying = false)

function Bubble(props) {
  const isCorrect = props.isCorrect;
  const [isSelected, setIsSelected] = useState(props.isSelected);
  const onSelect = (option) => {
    console.log(option);
    setIsSelected(!isSelected);
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
  //const [modified, setModified] = useState(false);
  const responseItem = props.responseItem;
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
        />
      );
    }
    //setModified(true);
    let modified = false;
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
  const responseData = props.responseData;
  if (typeof props.responseData !== "undefined") {
    console.log(responseData);
    return (
      <>
        <div
          key={responseData[0].userId}
          className="bg-gray-900 overflow-y-scroll absolute right-5 p-[5px] pr-[8px] m-5 h-[85%]"
        >
          {responseData.map((responseItem) => {
            return (
              <CreateBubbles
                responseItem={responseItem}
                key={responseItem.question_num}
              />
            );
          })}
        </div>
        <button
          onClick={() => {
            console.log(modifiedResponses);
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
