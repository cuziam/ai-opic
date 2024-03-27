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

//설문 데이터 생성
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

//설문데이터 저장
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

//설문 데이터를 랜덤하게 가져오기
export async function getRandomSurveyData() {
  const surveysLength = MyDb.surveys.length() as number;
  const randomSurveys = [] as { question: string; options: string[] }[];

  //질문 수가 10개가 되지 않는다면 나머지만 가져온다.
  if (surveysLength < 10) {
    for (let surveyId = 1; surveyId <= surveysLength; surveyId++) {
      const { question, id } = MyDb.surveys.read(surveyId) as Survey;
      const options = MyDb.surveysAnswers
        .readAllBySurveyId(id)
        .map((answer) => {
          return answer.answer;
        });
      randomSurveys.push({ question, options });
    }
    return randomSurveys;
  }

  //default: 중복을 허용하지 않고 랜덤하게 10개의 질문을 가져온다.
  const randomNumbers = new Set<number>();
  while (randomNumbers.size < 10) {
    randomNumbers.add(Math.floor(Math.random() * surveysLength) + 1);
  }
  randomNumbers.forEach((surveyId) => {
    const { question } = MyDb.surveys.read(surveyId) as Survey;
    const options = MyDb.surveysAnswers
      .readAllBySurveyId(surveyId)
      .map((answer) => {
        return answer.answer;
      });
    randomSurveys.push({ question, options });
  });
  return randomSurveys;
}

//모든 설문 데이터 삭제
export async function deleteAllSurveys() {
  MyDb.surveys.deleteAll();
  MyDb.surveysAnswers.deleteAll();
  MyDb.surveyRecords.deleteAll();
  console.log("All surveys and answers are deleted");
}

//일단 유저 정보 생성과 인증은 생략하고 기능테스트를 위해 id를 test로 고정
//유저 정보 생성
export async function createUserInfo() {
  MyDb.userInfos.create({
    id: "test",
  });
}

//유저 정보 가져오기
export async function getUserInfo(id: string) {
  return MyDb.userInfos.read(id);
}

//설문 기록 저장
export async function storeSurveyRecords(
  userInfoId: string,
  surveyRecords: { question: string; option: string }[]
) {
  surveyRecords.forEach((record) => {
    const { id } = MyDb.surveys.readByQuestion(record.question) as Survey;
    const { id: answerId } = MyDb.surveysAnswers.readByAnswer(
      record.option
    ) as SurveyAnswer;
    MyDb.surveyRecords.create({
      user_infos_id: userInfoId,
      surveys_answers_id: answerId as number,
      surveys_answers_surveys_id: id as number,
    });
  });
  console.log("Survey records are stored");
}

//설문 기록 가져오기
export async function getSurveyRecords(userInfoId: string) {
  const surveyRecords = MyDb.surveyRecords.readAllByUserInfoId(userInfoId);
  return surveyRecords.map((record) => {
    const { question } = MyDb.surveys.read(record.surveys_answers_surveys_id);
    const { answer } = MyDb.surveysAnswers.read(record.surveys_answers_id);
    return { question, answer };
  });
}

//테스트 문항 생성
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
