//Opic 문항을 만들기 위한 테스트 데이타와 생성 함수
"use server";
import MyDb from "./mydb";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: `${process.env.OPENAI_API_KEY}`,
});

interface SurveyRecord {
  question: string;
  answer: string;
}
type SurveyRecords = SurveyRecord[];

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

interface UserInfo {
  id: string;
  surveyRecords: SurveyRecords;
  testRecords: TestRecords;
}
//dummy surveyRecords(DB에서 불러오기)
const surveyRecords: SurveyRecords = [
  {
    question: "현재 귀하는 어느 분야에 종사하고 계십니까?",
    answer: "일 경험 없음",
  },
  {
    question: "현재 당신은 학생입니까?",
    answer: "아니오",
  },
  {
    question: "현재 어떤 강의를 듣고 있습니까?",
    answer: "어학 수업",
  },
  {
    question: "현재 귀하는 어디에 살고 계십니까?",
    answer: "개인 주택이나 아파트에 홀로 거주",
  },
  {
    question: "귀하는 여가활동으로 주로 무엇을 하십니까(두 개 이상 선택)",
    answer: "독서, 영화 감상, 해변 가기",
  },
  {
    question: "귀하의 취미나 관심사는 무엇입니까?(두 개 이상 선택)",
    answer: " 춤추기, 악기 연주하기, 혼자 노래 부르기, 그림 그리기",
  },
  {
    question: "귀하는 어떤 운동을 즐기십니까?(한 개 이상 선택)",
    answer: "걷기, 수영, 요가, 테니스, 축구",
  },
  {
    question:
      "귀하는 어떤 휴가나 출장을 다녀온 경험이 있습니까?(한 개 이상 선택)",
    answer: "해외 여행, 국내 여행, 출장",
  },
  {
    question:
      "귀하의 영어 실력을 1~6단계로 평가해주세요. 1단계는 최하위, 6단계는 최상위입니다.",
    answer: "5단계",
  },
];

//db사용
//만약 입력값이 없다면, 랜덤한 id를 생성하여 db에 저장
function generateUserInfo() {
  const id = "sample";
  MyDb.userInfos.create({ id });
}

export async function getSurveys() {
  const initialChatRecord: ChatRecord = {
    role: "system",
    content: `
    You are a questioner and assistant for the OPIC(Oral Proficiency Interview By Computer for English)test taker.
    You have to respond in JSON format.

    You will generate survey questions for the OPIC test taker.
    the survey is written in Korean and consists of 10 questions in multiple-choice format.
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
      model: "gpt-3.5-turbo",
      messages: [initialChatRecord],
      response_format: {
        type: "json_object",
      },
    });
    const response = completion.choices[0].message.content;
    const { survey } = JSON.parse(response);
    console.log("survey:", survey);
    survey.forEach((record: SurveyRecord) => {
      //db에 저장
      record.answer = JSON.stringify(record.answer); //배열을 문자열로 변환
      MyDb.surveyRecords.create(record);
    });

    //확인용
    console.log(MyDb.surveyRecords.readAll());
  } catch (e) {
    console.log(e);
  }

  //db에 저장
}

async function getSurveyss(history: ChatRecords) {
  //initial System message
  const initialMessage: ChatRecord = {
    role: "system",
    content: `
    You are a questioner and assistant for the OPIC(Oral Proficiency Interview By Computer for English)test taker.
    You have to respond in JSON format.

    You will generate survey questions for the OPIC test taker.
    the survey is written in Korean and consists of 10 questions in multiple-choice(at least, from 4 choices to 8choices) format.
    the json format of the survey is as follows:
    
    survey:{
      question: 'Your question here(type is string)',
      answer: 'Your answer here (type is array of string)'
    }

    second, you will receive the user's response to the survey.
    you will generate 12 questions based on the information given and more 3 questions out of the information.
    of course, the questions are written in English(for OPIC).
    the json format of questions is as follows:
    {
      id: 'Your question id here(type is number)',
      question: 'Your question here(type is string)',
    }

    third, you will receive the user's response to each question.
    then, you will provide feedback below:
    - the level of the response based on OPIC level(AL, IH, IM, IL, NH, NM, NL)
    - an alternative expression of the sentences
    - an explanation of the sentences
    - an advice for getting a higher score... etc...
    `,
  };
}

const main = async () => {
  await getSurveys();
};

main();
