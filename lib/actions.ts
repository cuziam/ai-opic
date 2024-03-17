//Opic 문항을 만들기 위한 테스트 데이타와 생성 함수
"use server";
import Database from "better-sqlite3";
import {
  SurveysRepository,
  UserInfosRepository,
  TestRecordsRepository,
  SurveysAnswersRepository,
  SurveyRecordsRepository,
} from "@/lib/mydb";
import { Survey, SurveyAnswer, SurveyRecord } from "@/lib/db-types";
import OpenAI from "openai";
//testdb
const db = new Database("./db/test.db", { verbose: console.log });
const openai = new OpenAI({
  apiKey: `${process.env.OPENAI_API_KEY}`,
});

interface OpenAiSurveyRecord {
  question: string;
  answer: string[];
}
interface OpenAiChatRecord {
  role: "system" | "user" | "assistant";
  content: string;
}

//repository 사용
const MyDb = {
  surveys: new SurveysRepository(db),
  userInfos: new UserInfosRepository(db),
  testRecords: new TestRecordsRepository(db),
  surveyRecords: new SurveyRecordsRepository(db),
  surveysAnswers: new SurveysAnswersRepository(db),
};

//db사용

export async function fetchSurveyData() {
  const initialChatRecord: OpenAiChatRecord = {
    role: "system",
    content: `
    You are a questioner and assistant for the OPIC(Oral Proficiency Interview By Computer for English)test taker.
    You have to respond in JSON format.

    You will generate survey questions for the OPIC test taker.
    the survey is written in Korean and consists of 5 questions in multiple-choice format.
    the number of choices is from 4 to 8.
    the question and answer are written in Korean.
    the json format of the survey is as follows:
    
    survey:{
      question: 'Your question here(type is string)',
      answer: 'Your answer here (type is array of string)'
    }
    `,
  };
  try {
    console.log("getSurveys...");
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [initialChatRecord],
      response_format: {
        type: "json_object",
      },
    });
    const response = completion.choices[0].message.content;
    const { survey } = JSON.parse(response as string);
    console.log("survey:", survey);
    return survey;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
export async function storeSurveyData(surveyData: OpenAiSurveyRecord[]) {
  try {
    surveyData.forEach((survey) => {
      MyDb.surveys.create({ question: survey.question });
      const { id } = MyDb.surveys.readByQuestion(survey.question) as Survey;
      survey.answer.forEach((answer) => {
        MyDb.surveysAnswers.create({
          answer: answer,
          surveys_id: id as number,
        });
      });
    });
    console.log("Survey data is stored");
  } catch (e) {
    console.log(e);
    throw e;
  }
}

//중복을 허용하지 않고 DB에서 랜덤하게 10개의 질문과 그에 대한 답변을 가져오기
export async function getRandomSurveyData() {
  const surveys = MyDb.surveys.readAll();
  const randomSurveys = [] as { question: Survey; answer: SurveyAnswer[] }[];

  for (let i = 0; i < 10; i++) {
    //랜덤하게 질문을 읽기
    const randomIndex = Math.floor(Math.random() * surveys.length);
    const survey = surveys[randomIndex] as Survey;
    //질문에 대한 답변들을 DB에서 읽기
    const surveyAnswers = MyDb.surveysAnswers.readAllBySurveyId(
      survey.id as number
    ) as SurveyAnswer[];
    //질문과 답변들을 배열에 넣기
    randomSurveys.push({ question: survey, answer: surveyAnswers });
  }
  console.log("randomSurveys:", JSON.stringify(randomSurveys, null, 2));
  //랜덤하게 가져온 질문과 답변들을 반환
  return randomSurveys;
}

export async function deleteAllSurveys() {
  MyDb.surveys.deleteAll();
  MyDb.surveysAnswers.deleteAll();
  MyDb.surveyRecords.deleteAll();
  console.log("All surveys and answers are deleted");
}

export async function createUserInfo() {
  MyDb.userInfos.create({
    id: "test",
  });
}
export async function getUserInfo(id: string) {
  return MyDb.userInfos.read(id);
}

export async function storeSurveyRecords(
  userInfoId: string,
  surveyRecords: { questionId: number; answerId: number }[]
) {
  surveyRecords.forEach((record) => {
    MyDb.surveyRecords.create({
      user_infos_id: userInfoId,
      surveys_answers_surveys_id: record.questionId,
      surveys_answers_id: record.answerId,
    });
  });
}

export async function getSurveyRecords(userInfoId: string) {
  const surveyRecords = MyDb.surveyRecords.readAllByUserInfoId(userInfoId);
  return surveyRecords.map((record) => {
    const { question } = MyDb.surveys.read(record.surveys_answers_surveys_id);
    const { answer } = MyDb.surveysAnswers.read(record.surveys_answers_id);
    return { question, answer };
  });
}

export async function fetchTestRecords(
  surveyRecords: { question: string; answer: string }[]
) {
  const surveyRecordsString = JSON.stringify(surveyRecords, null, 2);
  const initialChatRecord: OpenAiChatRecord = {
    role: "system",
    content: `
    You are a questioner and assistant for the OPIC(Oral Proficiency Interview By Computer for English)test taker.
    You have to respond in JSON format.

    You will generate questions for the OPIC test taker.
    the questions are written in English and consists of 12 questions.
    the questions are based on the survey which I give you.
    if test taker's level is from 4 to 6, you have to generate more 3 free questions on topics that are not in the survey. 

    the json format of the questions is as follows:
    questions: [](type is array of string)

    here is the survey:
    ${surveyRecordsString}
    `,
  };

  try {
    console.log("getTestRecords...");
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [initialChatRecord],
      response_format: {
        type: "json_object",
      },
    });
    const response = completion.choices[0].message.content;
    const { questions } = JSON.parse(response as string);
    console.log("questions:", questions);
    return questions;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
