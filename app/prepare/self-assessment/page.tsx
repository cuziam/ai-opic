"use client";
import React, { useState, useContext } from "react";
import PrepareContext from "../context";
export default function SelfAssessment() {
  const [selectedLevel, setSelectedLevel] = useState<number>(0);
  const { handleCurrentStep } = useContext(PrepareContext);
  const levels: string[] = [
    "나는 10단어 이하의 단어로 말할 수 있다.",
    "나는 기본적인 물건, 색깔, 요일, 음식, 의류, 숫자 등을 말할 수 있습니다. 나는 항상 완벽한 문장을 구사하지는 못하고 간단한 질문도 하기 어렵습니다.",
    "나는 나 자신, 직장, 친숙한 사람과 장소 일상에 대한 기본적인 정보를 간단한 문장으로 전달할 수 있습니다. 간단한 질문을 할 수 있습니다.",
    "나는 나 자신, 일상, 일/학교, 취미에 대해 간단한 대화를 할 수 있습니다. 나는 이런 친숙한 주제와 일상에 대해 일련의 간단한 문장들을 쉽게 만들어 낼 수 있습니다. 내가 필요한 것을 얻기 위한 질문도 할 수 있습니다.",
    "나는 친숙한 주제와 가정, 일/학교, 개인 및 사회적 관심사에 대해 대화할 수 있습니다. 나는 일어난 일과 일어나고 있는 일, 일어날 일에 대해 문장을 연결하여 말할 수 있습니다. 필요한 경우 설명도 할 수 있습니다. 일상 생활에서 예기치 못한 상황이 발생하더라도 임기응변으로 대처할 수 있습니다.",
    "나는 일.학교, 개인적인 관심사., 시사 문제에 대한 어떤 대화나 토론에도 자신 있게 참여할 수 있습니다. 나는 대부분의 주제에 관해 높은 수준의 정확성과 폭넓은 어휘로 상세히 설명할 수 있습니다.",
  ];

  const handleChange = (event) => {
    setSelectedLevel(event.target.value);
  };
  const handleNextClick = (minusOrPlus: boolean) => {
    if (minusOrPlus === false) {
      handleCurrentStep(1);
    } else {
      //만약 form이 체크되어 있지 않다면, alert을 띄우고 다음 단계로 넘어가지 않는다.
      if (selectedLevel === 0) {
        alert("반드시 하나를 체크해주세요");
        return;
      }
      handleCurrentStep(3);
    }
  };

  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">Self Assessment</h1>
      <div className="border-t border-gray-300 pt-4">
        <p className="mb-6 text-sm">
          본 Self Assessment에 대한 응답을 기초로 개인별 문항이 출제됩니다.
          <br />
          설명을 잘 읽고 본인의 English 말하기 능력과 비슷한 수준을 선택하시기
          바랍니다.
        </p>
        <div className="space-y-4">
          <form className="flex flex-col">
            {levels.map((level, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name="level"
                  value={index + 1}
                  onChange={handleChange}
                />
                <span className="ml-2">{level}</span>
              </label>
            ))}
            <p>선택된 값: {selectedLevel}</p>
          </form>
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <button
          className="bg-orange-500 hover:bg-orange-700 text-white px-6 py-2 rounded"
          onClick={() => handleNextClick(false)}
        >
          Back
        </button>
        <button
          className="bg-orange-500 hover:bg-orange-700 text-white px-6 py-2 rounded"
          onClick={() => handleNextClick(true)}
        >
          Next
        </button>
      </div>
    </main>
  );
}
