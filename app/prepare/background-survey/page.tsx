"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import SurveyForm from "@/components/SurveyForm";
import surveyData from "@/test-data/questions";
import { getRandomSurveyData } from "@/lib/actions";
// async function getQAndA() {
//   "use server";
//   const surveyData = await getRandomSurveyData();
//   // 질문과 대답만 추출
//   const qAndA = surveyData.map((survey) => {
//     return {
//       question: survey.question.question,
//       options: survey.answer.map((answer) => {
//         return answer.answer;
//       }),
//     };
//   });
//   return qAndA;
// }
// console.log(getQAndA());
//survey validation은 나중에 추가
export default function Survey() {
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
  const router = useRouter();

  const handleNextClick = (minusOrPlus: boolean) => {
    if (minusOrPlus === false) {
      setCurrentPageNumber((prev) => (prev === 1 ? 1 : prev - 1));
    } else {
      //if it's the last page, set current step to 2 and route to '/prepare/self-assessment'
      if (currentPageNumber === 3) {
        router.push("/prepare/self-assessment");
      } else {
        setCurrentPageNumber((prev) => prev + 1);
      }
    }
  };

  //after page number change, scroll to top smoothly
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPageNumber]);

  return (
    <>
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">Background Survey</h1>
        <div className="border-t border-gray-300 pt-4">
          <p className="mb-6 text-sm">
            질문을 읽고 정확한 답변을 선택기 바랍니다. 설문에 대한 응답을
            기준으로 개인별 맞춤형 정보를 제공합니다.
          </p>

          <h2 className="text-xl font-bold mb-4">
            {" "}
            Part {currentPageNumber} of 4
          </h2>

          {surveyData[currentPageNumber - 1].map((page, index) => (
            <SurveyForm
              key={index}
              question={page.question}
              options={page.options}
            />
          ))}
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
        </div>
      </main>
    </>
  );
}
