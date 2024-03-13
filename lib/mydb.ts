import Database from "better-sqlite3";
// 인터페이스 정의
interface Survey {
  id?: number;
  question: string;
}

interface UserInfo {
  id: string;
}

interface TestRecord {
  id?: number;
  question: string;
  answer: string;
  feedback: string;
  user_infos_id: string;
}

interface SurveyAnswer {
  id?: number;
  answer: string;
  surveys_id: number;
}

interface SurveyRecord {
  id: number;
  user_infos_id: string;
  surveys_id: number;
  surveys_answers_id: number;
  surveys_answers_surveys_id: number;
}

class SurveysRepository {
  private db: Database.Database;
  constructor(db: Database.Database) {
    this.db = db;
  }

  create(survey: Survey) {
    return this.db
      .prepare("INSERT INTO surveys (question) VALUES (?)")
      .run(survey.question);
  }

  read(id: number) {
    return this.db.prepare("SELECT * FROM surveys WHERE id = ?").get(id);
  }

  readIdByQuestion(question: string) {
    return this.db
      .prepare("SELECT id FROM surveys WHERE question = ?")
      .get(question);
  }

  readAll() {
    return this.db.prepare("SELECT * FROM surveys").all();
  }

  update(survey: Survey) {
    return this.db
      .prepare("UPDATE surveys SET question = ? WHERE id = ?")
      .run(survey.question, survey.id);
  }

  delete(id: number) {
    return this.db.prepare("DELETE FROM surveys WHERE id = ?").run(id);
  }
}

class UserInfosRepository {
  private db: Database.Database;
  constructor(db: Database.Database) {
    this.db = db;
  }

  create(userInfo: UserInfo) {
    return this.db
      .prepare("INSERT INTO user_infos (id) VALUES (?)")
      .run(userInfo.id);
  }

  read(id: string) {
    return this.db.prepare("SELECT * FROM user_infos WHERE id = ?").get(id);
  }

  readAll() {
    return this.db.prepare("SELECT * FROM user_infos").all();
  }

  delete(id: string) {
    return this.db.prepare("DELETE FROM user_infos WHERE id = ?").run(id);
  }
}

class TestRecordsRepository {
  private db: Database.Database;
  constructor(db: Database.Database) {
    this.db = db;
  }

  create(testRecord: TestRecord) {
    return this.db
      .prepare(
        "INSERT INTO test_records (question, answer, feedback, user_infos_id) VALUES (?, ?, ?, ?)"
      )
      .run(
        testRecord.question,
        testRecord.answer,
        testRecord.feedback,
        testRecord.user_infos_id
      );
  }

  read(id: number) {
    return this.db.prepare("SELECT * FROM test_records WHERE id = ?").get(id);
  }

  readAll() {
    return this.db.prepare("SELECT * FROM test_records").all();
  }

  update(testRecord: TestRecord) {
    return this.db
      .prepare(
        "UPDATE test_records SET question = ?, answer = ?, feedback = ?, user_infos_id = ? WHERE id = ?"
      )
      .run(
        testRecord.question,
        testRecord.answer,
        testRecord.feedback,
        testRecord.user_infos_id,
        testRecord.id
      );
  }

  delete(id: number) {
    return this.db.prepare("DELETE FROM test_records WHERE id = ?").run(id);
  }
}

class SurveysAnswersRepository {
  private db: Database.Database;
  constructor(db: Database.Database) {
    this.db = db;
  }

  create(surveyAnswer: SurveyAnswer) {
    return this.db
      .prepare("INSERT INTO surveys_answers (answer, surveys_id) VALUES (?, ?)")
      .run(surveyAnswer.answer, surveyAnswer.surveys_id);
  }

  read(id: number, surveys_id: number) {
    return this.db
      .prepare("SELECT * FROM surveys_answers WHERE id = ? AND surveys_id = ?")
      .get(id, surveys_id);
  }

  readBySurveyId(surveys_id: number) {
    return this.db
      .prepare("SELECT * FROM surveys_answers WHERE surveys_id = ?")
      .all(surveys_id);
  }

  readAll() {
    return this.db.prepare("SELECT * FROM surveys_answers").all();
  }

  update(surveyAnswer: SurveyAnswer) {
    return this.db
      .prepare(
        "UPDATE surveys_answers SET answer = ? WHERE id = ? AND surveys_id = ?"
      )
      .run(surveyAnswer.answer, surveyAnswer.id, surveyAnswer.surveys_id);
  }

  delete(id: number, surveys_id: number) {
    return this.db
      .prepare("DELETE FROM surveys_answers WHERE id = ? AND surveys_id = ?")
      .run(id, surveys_id);
  }
}

class SurveyRecordsRepository {
  private db: Database.Database;
  constructor(db: Database.Database) {
    this.db = db;
  }

  create(surveyRecord: SurveyRecord) {
    return this.db
      .prepare(
        "INSERT INTO survey_records (user_infos_id, surveys_id, surveys_answers_id, surveys_answers_surveys_id) VALUES (?, ?, ?, ?)"
      )
      .run(
        surveyRecord.user_infos_id,
        surveyRecord.surveys_id,
        surveyRecord.surveys_answers_id,
        surveyRecord.surveys_answers_surveys_id
      );
  }

  read(id: number, user_infos_id: string) {
    return this.db
      .prepare(
        "SELECT * FROM survey_records WHERE id = ? AND user_infos_id = ?"
      )
      .get(id, user_infos_id);
  }

  readAll() {
    return this.db.prepare("SELECT * FROM survey_records").all();
  }

  update(surveyRecord: SurveyRecord) {
    return this.db
      .prepare(
        "UPDATE survey_records SET surveys_id = ?, surveys_answers_id = ?, surveys_answers_surveys_id = ? WHERE id = ? AND user_infos_id = ?"
      )
      .run(
        surveyRecord.surveys_id,
        surveyRecord.surveys_answers_id,
        surveyRecord.surveys_answers_surveys_id,
        surveyRecord.id,
        surveyRecord.user_infos_id
      );
  }

  delete(id: number, user_infos_id: string) {
    return this.db
      .prepare("DELETE FROM survey_records WHERE id = ? AND user_infos_id = ?")
      .run(id, user_infos_id);
  }
}

export {
  SurveysRepository,
  UserInfosRepository,
  TestRecordsRepository,
  SurveysAnswersRepository,
  SurveyRecordsRepository,
};
