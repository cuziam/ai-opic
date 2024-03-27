"use client";
import Link from "next/link";
import {
  fetchSurveyData,
  storeSurveyData,
  getRandomSurveyData,
  createUserInfo,
  getUserInfo,
  storeSurveyRecords,
  getSurveyRecords,
  fetchTestRecords,
} from "../lib/OpicDbHandler";
import { useState, useEffect } from "react";

export default function Home() {
  return (
    <div className="flex flex-col">
      <h1>Home</h1>
      <Link href="login" className="text-red-600">
        Test
      </Link>
      <button
        onClick={async () => {
          const surveyData = await fetchSurveyData();
          await storeSurveyData(surveyData);
        }}
      >
        Generate Survey
      </button>
      <button
        onClick={() => {
          getRandomSurveyData();
        }}
      >
        getRandomSurveys
      </button>
      <button
        onClick={() => {
          createUserInfo();
        }}
      >
        createUserInfo
      </button>{" "}
      <button
        onClick={async () => {
          const userinfo = await getUserInfo("test");
          console.log(userinfo);
        }}
      >
        getUserInfo
      </button>
      <button
        onClick={async () => {
          // dummy survey records
          const userId = "test";
          const dummyQandA = [
            { question: "영어 학습 목적은 무엇입니까?", option: "학교/학업" },
            {
              question: "영어 학습 목적은 무엇입니까?",
              option: "취미",
            },
          ];
          await storeSurveyRecords(userId, dummyQandA);
        }}
      >
        storeSurveyRecords
      </button>
      <button
        onClick={async () => {
          const surveyRecords = await getSurveyRecords("test");
          console.log(surveyRecords);
        }}
      >
        getSurveyRecords
      </button>
      <button
        onClick={async () => {
          const surveyRecords = await getSurveyRecords("test");
          const testRecords = await fetchTestRecords(surveyRecords);
          console.log(testRecords);
        }}
      >
        fetchTestRecords
      </button>
    </div>
  );
}
