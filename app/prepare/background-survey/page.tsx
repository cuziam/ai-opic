"use client";
import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import SurveyForm from "@/components/SurveyForm";

interface SurveyData {
  question: string;
  options: string[];
}
interface SurveyRecord {
  question: string;
  option: string;
}

//survey validation은 나중에 추가
export default function Survey({ surveyData }: { surveyData: SurveyData[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const handleNextClick = async (isNext: boolean) => {
    if (isNext) {
      await submitSurveyRecords();
      router.push("/prepare/self-assessment");
    } else {
      router.push("/policy-agreement");
    }
  };

  const submitSurveyRecords = async () => {
    const surveyRecords = [] as SurveyRecord[];
    const form = formRef.current;
    if (form) {
      const formData = new FormData(form);
      for (const [question, option] of formData.entries()) {
        surveyRecords.push({ question, option } as SurveyRecord);
      }
    }

    try {
      await fetch("/prepare/background-survey/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: "test", surveyRecords }),
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">Background Survey</h1>
        <div className="border-t border-gray-300 pt-4">
          <p className="mb-6 text-sm">
            질문을 읽고 정확한 답변을 선택기 바랍니다. 설문에 대한 응답을
            기준으로 개인별 맞춤형 정보를 제공합니다.
          </p>
          <form ref={formRef}>
            {
              //get the survey data of the current page
              surveyData.map((survey, index) => (
                <SurveyForm
                  key={index}
                  question={survey.question}
                  options={survey.options}
                />
              ))
            }
          </form>

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
