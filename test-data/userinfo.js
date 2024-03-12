//Opic 문항을 만들기 위한 테스트 데이타와 생성 함수

//dummy data

//request logic

const { OpenAI } = require("openai");
const openai = new OpenAI({});

//dummy surveyRecords(DB에서 불러오기)
const surveyRecords = [
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

//설문조사 질문과 답변을 문자열로 변환
function surveyToString(records) {
  return records
    .map((record) => {
      return `${record.question} : ${record.answer}`;
    })
    .join("\n");
}

async function getQuestions() {
  //initial config

  const survey = surveyToString(surveyRecords);

  const initialMessages = [
    {
      role: "system",
      content: `
      You are a questioner and assistant for the OPIC(Oral Proficiency Interview By Computer for English)test taker.
      You have to respond in JSON format.

      At first, You will generate survey questions for the OPIC test taker.
      the survey is written in Korean and consists of 10 questions in multiple-choice format.
      the json format of the survey is as follows:
      {
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
    },
    {
      role: "user",
      content:
        "Opic 시험 응시자를 위한 사전 설문조사를 만들어주세요. 설문조사는 총 10개의 문항으로 구성되어있으며 다중 선택 형식입니다.",
    },
    // {
    //   role: "user",
    //   content: `지금 제공하는 정보를 바탕으로 OPIC 시험을 위한 질문을 만들어 주세요.
    //     ${survey}`,
    // },
  ];
  const model = "gpt-4-turbo-preview";
  //survey logic
  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: initialMessages,
      response_format: {
        type: "json_object",
      },
    });
    const response = JSON.parse(completion.choices[0].message.content);
    response.survey.forEach((record, idx) => {
      console.log(`question : ${record.question}`);
      record.answer.forEach((ans, idx) => {
        console.log(`${ans}`);
      });
    });
    console.log(response);
  } catch (e) {
    console.log(e);
  }
}

getQuestions();
