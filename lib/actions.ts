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
import OpenAI from "openai";

const db = new Database("./db/test.db", { verbose: console.log });
const openai = new OpenAI({
  apiKey: `${process.env.OPENAI_API_KEY}`,
});

interface OpenAiSurveyRecord {
  question: string;
  answer: string[];
}
type OpenAiSurveyRecords = OpenAiSurveyRecord[];

interface TestRecord {
  id: number;
  question: string;
  answer: string;
  feedback: string;
}
type TestRecords = TestRecord[];

//server에서만 사용할 인터페이스
interface ChatRecord {
  role: "system" | "user" | "assistant";
  content: string;
}
type ChatRecords = ChatRecord[];

//repository 사용
const MyDb = {
  surveys: new SurveysRepository(db),
  userInfos: new UserInfosRepository(db),
  testRecords: new TestRecordsRepository(db),
  surveyRecords: new SurveyRecordsRepository(db),
  surveysAnswers: new SurveysAnswersRepository(db),
};

//db사용
export async function getSurveys() {
  const initialChatRecord: ChatRecord = {
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

    survey.forEach((record: OpenAiSurveyRecord) => {
      //질문과 답을 db에 저장
      //1. 질문을 저장
      MyDb.surveys.create({ question: record.question });
      //2. 질문의 id를 읽고 답들을 저장
      const { id } = MyDb.surveys.readIdByQuestion(record.question) as {
        id: number;
      };
      record.answer.forEach((answer: string) => {
        MyDb.surveysAnswers.create({ answer, surveys_id: id });
      });
    });

    //확인
    console.log("surveys:", MyDb.surveys.readAll());
    console.log("surveysAnswers:", MyDb.surveysAnswers.readAll());
  } catch (e) {
    console.log(e);
  }

  //db에 저장
}

interface Survey {
  id: number;
  question: string;
}

interface SurveyAnswer {
  id: number;
  answer: string;
  surveys_id: number;
}
//DB에서 랜덤하게 10개의 질문과 그에 대한 답변을 가져오기
export async function getRandomSurveys() {
  const surveys = MyDb.surveys.readAll();
  const randomSurveys: OpenAiSurveyRecords = [];

  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * surveys.length);
    const survey = surveys[randomIndex] as Survey;
    //질문에 대한 답변들을 DB에서 읽기
    const surveyAnswers = MyDb.surveysAnswers.readBySurveyId(
      survey.id
    ) as SurveyAnswer[];
    const answer: string[] = [];
    //답변들을 배열로 만들기
    surveyAnswers.forEach((surveyAnswer) => {
      answer.push(surveyAnswer.answer);
    });
    randomSurveys.push({ question: survey.question, answer });
  }
  console.log("randomSurveys:", randomSurveys);
  return randomSurveys;
}

export async function saveSurveyRecords() {}
