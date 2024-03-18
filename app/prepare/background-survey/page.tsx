"use client";
import React, { useState, useEffect, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import SurveyForm from "@/components/SurveyForm";

interface SurveyData {
  question: string;
  options: string[];
}

//survey validation은 나중에 추가
export default function Survey({ surveyData }: { surveyData: SurveyData[] }) {
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
  const router = useRouter();
  const maxPageNumber = 3;
  const getSurveyDataOfPages = useCallback(
    (surveyData: SurveyData[], maxPageNumber: number) => {
      const pages = [];
      //maxPageNumber만큼 균등하게 나눠서 페이지를 만든다
      for (let i = 0; i < maxPageNumber; i++) {
        pages.push(surveyData.slice(i * 4, (i + 1) * 4));
      }
      return pages;
    },
    []
  );

  const handleNextClick = (minusOrPlus: boolean, maxPageNumber: number) => {
    if (minusOrPlus === false) {
      setCurrentPageNumber((prev) => (prev === 1 ? 1 : prev - 1));
    } else {
      //if it's the last page, set current step to 2 and route to '/prepare/self-assessment'
      if (currentPageNumber === maxPageNumber) {
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
            Part {currentPageNumber} of {maxPageNumber}
          </h2>
          {
            //get the survey data of the current page
            getSurveyDataOfPages(surveyData, maxPageNumber)[
              currentPageNumber - 1
            ].map((survey, index) => (
              <SurveyForm
                key={index}
                question={survey.question}
                options={survey.options}
              />
            ))
          }
          <div className="flex justify-between mt-8">
            <button
              className="bg-orange-500 hover:bg-orange-700 text-white px-6 py-2 rounded"
              onClick={() => handleNextClick(false, maxPageNumber)}
            >
              Back
            </button>
            <button
              className="bg-orange-500 hover:bg-orange-700 text-white px-6 py-2 rounded"
              onClick={() => handleNextClick(true, maxPageNumber)}
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
