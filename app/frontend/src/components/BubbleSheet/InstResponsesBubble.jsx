import React from "react";

function Bubble(props) {
  return (
    <div
      key={props.option}
      className={`w-8 h-8 flex items-center justify-center rounded-full border cursor-pointer
        bg-green-500 text-white mx-1 my-0.5`}
      onClick={() => {
        props.onSelect(props.option);
      }}
    >
      <p>{props.option}</p>
    </div>
  );
}

function CreateBubbles(props) {
  const responseItem = props.responseItem;
  console.log(responseItem);
  const onSelect = (option) => {
    console.log(option);
  };

  if (typeof responseItem !== "undefined") {
    let options = [];
    for (let i = 0; i < responseItem.num_options; i++) {
      options.push(String.fromCharCode(i + 65));
    }
    const bubbles = options.map((option) => {
      <Bubble option={option} onSelect={onSelect} />;
    });
    //const responseItem = props.responseItem;
    return (
      <div key = {responseItem.question_num} className="bg-red-700 flex space-x-2 flex-right p-[2px] px-[5px] w-auto mb-3">
        <p className = "w-[105px] mt-[5px]">Question: {String(responseItem.question_num)}</p>
        {options.map((option) => {
          return <Bubble option={option} onSelect={onSelect} key = {option}/>;
        })}
      </div>
    );
  } else {
  }
}

function InstResponseBubbles(props) {
  const responseData = props.responseData;
  if (typeof props.responseData !== "undefined") {
    console.log(responseData[0].userId)
    return (
      <div key = {responseData[0].userId} className="bg-yellow-600 overflow-y-scroll absolute right-5 p-[5px] pr-[8px] m-5 h-[85%]">
        {responseData.map((responseItem) => {
          return <CreateBubbles responseItem={responseItem} key = {responseItem.question_num}/>;
        })}
      </div>
    );
  } else {
  }
}

export default InstResponseBubbles;
