// 인터페이스 정의
export interface Survey {
  id?: number;
  question: string;
}

export interface UserInfo {
  id: string;
}

export interface TestRecord {
  id?: number;
  question: string;
  answer: string;
  feedback: string;
  user_infos_id: string;
}

export interface SurveyAnswer {
  id?: number;
  answer: string;
  surveys_id: number;
}

export interface SurveyRecord {
  id?: number;
  user_infos_id: string;
  surveys_answers_id: number;
  surveys_answers_surveys_id: number;
}
