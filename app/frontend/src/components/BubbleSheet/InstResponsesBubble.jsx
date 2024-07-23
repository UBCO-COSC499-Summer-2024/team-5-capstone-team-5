import React from "react";

let modifiedResponses = [];

function Bubble(props) {
  return (
    <div
      key={props.option}
      className={`w-8 h-8 flex items-center justify-center rounded-full border cursor-pointe
         ${props.color} text-white mx-1 my-0.5`}
      onClick={() => {
        props.onSelect(props.option);
      }}
    >
      <p>{String.fromCharCode(props.option + 65)}</p>
    </div>
  );
}

function CreateBubbles(props) {
  const responseItem = props.responseItem;
  const onSelect = (option) => {
    console.log(option);
  };
  if (typeof responseItem !== "undefined") {
    let bubbles = [];
    console.log(responseItem);
    for (let i = 0; i < responseItem.num_options; i++) {
      let color = "bg-gray-700";
      if (responseItem.correct_answer.includes(i)) {
        if (responseItem.response.includes(i)) {
          color = "bg-green-500";
        } else {
          color = "bg-yellow-600";
        }
      } else if (responseItem.response.includes(i)) {
        color = "bg-red-700";
      }
      bubbles.push(
        <Bubble
          key={i}
          option={i}
          letter={String.fromCharCode(i + 65)}
          onSelect={onSelect}
          color={color}
        />
      );
    }
    return (
      <div
        key={responseItem.question_num}
        className="bg-gray-900 flex space-x-2 flex-right p-[2px] px-[5px] w-auto mb-3"
      >
        <p className="w-[105px] mt-[5px]">
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
    console.log(responseData[0].userId);
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
