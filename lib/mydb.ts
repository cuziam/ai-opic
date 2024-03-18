import Database from "better-sqlite3";
import {
  Survey,
  UserInfo,
  TestRecord,
  SurveyAnswer,
  SurveyRecord,
} from "@/lib/db-types";
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
    return this.db
      .prepare("SELECT * FROM surveys WHERE id = ?")
      .get(id) as Survey;
  }

  readByQuestion(question: string) {
    return this.db
      .prepare("SELECT * FROM surveys WHERE question = ?")
      .get(question) as Survey;
  }

  readAll() {
    return this.db.prepare("SELECT * FROM surveys").all() as Survey[];
  }

  update(survey: Survey) {
    return this.db
      .prepare("UPDATE surveys SET question = ? WHERE id = ?")
      .run(survey.question, survey.id);
  }

  delete(id: number) {
    return this.db.prepare("DELETE FROM surveys WHERE id = ?").run(id);
  }

  deleteAll() {
    return this.db.prepare("DELETE FROM surveys").run();
  }

  length() {
    return this.db.prepare("SELECT COUNT(*) FROM surveys").pluck().get();
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

  read(id: number) {
    return this.db
      .prepare("SELECT * FROM surveys_answers WHERE id = ?")
      .get(id) as SurveyAnswer;
  }

  readAllBySurveyId(surveys_id: number) {
    return this.db
      .prepare("SELECT * FROM surveys_answers WHERE surveys_id = ?")
      .all(surveys_id) as SurveyAnswer[];
  }
  readByAnswer(answer: string) {
    return this.db
      .prepare("SELECT * FROM surveys_answers WHERE answer = ?")
      .get(answer) as SurveyAnswer;
  }

  readAll() {
    return this.db
      .prepare("SELECT * FROM surveys_answers")
      .all() as SurveyAnswer[];
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

  deleteAll() {
    return this.db.prepare("DELETE FROM surveys_answers").run();
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
    return this.db
      .prepare("SELECT * FROM user_infos WHERE id = ?")
      .get(id) as UserInfo;
  }

  readAll() {
    return this.db.prepare("SELECT * FROM user_infos").all();
  }

  delete(id: string) {
    return this.db.prepare("DELETE FROM user_infos WHERE id = ?").run(id);
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
        "INSERT INTO survey_records (user_infos_id, surveys_answers_id, surveys_answers_surveys_id) VALUES (?, ?, ?)"
      )
      .run(
        surveyRecord.user_infos_id,
        surveyRecord.surveys_answers_id,
        surveyRecord.surveys_answers_surveys_id
      );
  }

  read(id: number, user_infos_id: string) {
    return this.db
      .prepare(
        "SELECT * FROM survey_records WHERE id = ? AND user_infos_id = ?"
      )
      .get(id, user_infos_id) as SurveyRecord;
  }

  readAll() {
    return this.db
      .prepare("SELECT * FROM survey_records")
      .all() as SurveyRecord[];
  }

  readAllByUserInfoId(user_infos_id: string) {
    return this.db
      .prepare("SELECT * FROM survey_records WHERE user_infos_id = ?")
      .all(user_infos_id) as SurveyRecord[];
  }

  update(surveyRecord: SurveyRecord) {
    return this.db
      .prepare(
        "UPDATE survey_records SET surveys_answers_id = ?, surveys_answers_surveys_id = ? WHERE id = ? AND user_infos_id = ?"
      )
      .run(
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

  deleteAll() {
    return this.db.prepare("DELETE FROM survey_records").run();
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
    return this.db
      .prepare("SELECT * FROM test_records WHERE id = ?")
      .get(id) as TestRecord;
  }

  readAll() {
    return this.db.prepare("SELECT * FROM test_records").all() as TestRecord[];
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

export {
  SurveysRepository,
  UserInfosRepository,
  TestRecordsRepository,
  SurveysAnswersRepository,
  SurveyRecordsRepository,
};
