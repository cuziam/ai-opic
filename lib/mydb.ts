//DB의 CRUD 함수 정의, 예외 처리는 아직 미완.
import Database from "better-sqlite3";
import test from "node:test";
const db = new Database("./db/ai_opic.db", { verbose: console.log });

// 사용자 정보 CRUD
interface UserInfo {
  id: string;
}
class UserInfos {
  static create(userinfo: UserInfo) {
    try {
      const stmt = db.prepare(`INSERT INTO user_infos (id) VALUES (?)`);
      stmt.run(userinfo.id);
    } catch (error) {
      console.error("Error in create method of UserInfos:", error);
    }
  }

  static read(id: string) {
    try {
      const stmt = db.prepare(`SELECT * FROM user_infos WHERE id = ?`);
      return stmt.get(id);
    } catch (error) {
      console.error("Error in read method of UserInfos:", error);
      return null;
    }
  }

  static delete(id: string) {
    try {
      const stmt = db.prepare(`DELETE FROM user_infos WHERE id = ?`);
      stmt.run(id);
    } catch (error) {
      console.error("Error in delete method of UserInfos:", error);
    }
  }

  static readAll() {
    try {
      const stmt = db.prepare(`SELECT * FROM user_infos`);
      return stmt.all();
    } catch (error) {
      console.error("Error in readAll method of UserInfos:", error);
      return [];
    }
  }

  static deleteAll() {
    try {
      const stmt = db.prepare(`DELETE FROM user_infos`);
      stmt.run();
    } catch (error) {
      console.error("Error in deleteAll method of UserInfos:", error);
    }
  }
}

//설문조사 정보 CRUD
interface SurveyRecord {
  question: string;
  answer: string;
}

class SurveyRecords {
  static create(surveyRecord: SurveyRecord) {
    const stmt = db.prepare(
      `INSERT INTO survey_records (question, answer) VALUES (?, ?)`
    );
    stmt.run(surveyRecord.question, surveyRecord.answer);
  }
  static read(id: number) {
    const stmt = db.prepare(`SELECT * FROM survey_records WHERE id = ?`);
    const result = stmt.get(id);
    return result;
  }
  static update(id: number, surveyRecord: SurveyRecord) {
    const stmt = db.prepare(
      `UPDATE survey_records SET question = ?, answer = ? WHERE id = ?`
    );
    stmt.run(surveyRecord.question, surveyRecord.answer, id);
  }
  static delete(id: number) {
    const stmt = db.prepare(`DELETE FROM survey_records WHERE id = ?`);
    stmt.run(id);
  }
  //필드 별로 업데이트 함수 정의
  static updateQuestion(id: number, question: string) {
    const stmt = db.prepare(
      `UPDATE survey_records SET question = ? WHERE id = ?`
    );
    stmt.run(question, id);
  }
  static updateAnswer(id: number, answer: string) {
    const stmt = db.prepare(
      `UPDATE survey_records SET answer = ? WHERE id = ?`
    );
    stmt.run(answer, id);
  }

  //전체 데이터 조회 및 삭제 함수 정의
  static readAll() {
    const stmt = db.prepare(`SELECT * FROM survey_records`);
    const result = stmt.all();
    return result;
  }
  static deleteAll() {
    const stmt = db.prepare(`DELETE FROM survey_records`);
    stmt.run();
  }
}

// 시험 기록 CRUD
interface TestRecord {
  question: string;
  answer: string;
  feedback: string;
  user_infos_id: string;
}

class TestRecords {
  static create(testRecord: TestRecord) {
    const stmt = db.prepare(
      `INSERT INTO test_records (question, answer, feedback, user_infos_id) VALUES (?, ?, ?, ?)`
    );
    stmt.run(
      testRecord.question,
      testRecord.answer,
      testRecord.feedback,
      testRecord.user_infos_id
    );
  }
  static read(id: number) {
    const stmt = db.prepare(`SELECT * FROM test_records WHERE id = ?`);
    const result = stmt.get(id);
    return result;
  }
  static update(id: number, testRecord: TestRecord) {
    const stmt = db.prepare(
      `UPDATE test_records SET question = ?, answer = ?, feedback = ?, user_infos_id = ? WHERE id = ?`
    );
    stmt.run(
      testRecord.question,
      testRecord.answer,
      testRecord.feedback,
      testRecord.user_infos_id,
      id
    );
  }
  static delete(id: number) {
    const stmt = db.prepare(`DELETE FROM test_records WHERE id = ?`);
    stmt.run(id);
  }

  //필드 별로 업데이트 함수 정의
  static updateQuestion(id: number, question: string) {
    const stmt = db.prepare(
      `UPDATE test_records SET question = ? WHERE id = ?`
    );
    stmt.run(question, id);
  }
  static updateAnswer(id: number, answer: string) {
    const stmt = db.prepare(`UPDATE test_records SET answer = ? WHERE id = ?`);
    stmt.run(answer, id);
  }
  static updateFeedback(id: number, feedback: string) {
    const stmt = db.prepare(
      `UPDATE test_records SET feedback = ? WHERE id = ?`
    );
    stmt.run(feedback, id);
  }
  static updateUserInfosId(id: number, user_infos_id: string) {
    const stmt = db.prepare(
      `UPDATE test_records SET user_infos_id = ? WHERE id = ?`
    );
    stmt.run(user_infos_id, id);
  }
  //전체 데이터 조회 및 삭제 함수 정의
  static readAll() {
    const stmt = db.prepare(`SELECT * FROM test_records`);
    const result = stmt.all();
    return result;
  }
  static deleteAll() {
    const stmt = db.prepare(`DELETE FROM test_records`);
    stmt.run();
  }
}

// 채팅 기록 CRUD
interface ChatRecord {
  role: "user" | "assistant" | "system";
  message: string;
  user_infos_id: string;
}

class ChatRecords {
  static create(chatRecord: ChatRecord) {
    const stmt = db.prepare(
      `INSERT INTO chat_records (role, message, user_infos_id) VALUES (?, ?, ?)`
    );
    stmt.run(chatRecord.role, chatRecord.message, chatRecord.user_infos_id);
  }
  static read(id: number) {
    const stmt = db.prepare(`SELECT * FROM chat_records WHERE id = ?`);
    const result = stmt.get(id);
    return result;
  }
  static update(id: number, chatRecord: ChatRecord) {
    const stmt = db.prepare(
      `UPDATE chat_records SET role = ?, message = ?, user_infos_id = ? WHERE id = ?`
    );
    stmt.run(chatRecord.role, chatRecord.message, chatRecord.user_infos_id, id);
  }
  static delete(id: number) {
    const stmt = db.prepare(`DELETE FROM chat_records WHERE id = ?`);
    stmt.run(id);
  }

  //필드 별로 업데이트 함수 정의
  static updateRole(id: number, role: "user" | "assistant" | "system") {
    const stmt = db.prepare(`UPDATE chat_records SET role = ? WHERE id = ?`);
    stmt.run(role, id);
  }
  static updateMessage(id: number, message: string) {
    const stmt = db.prepare(`UPDATE chat_records SET message = ? WHERE id = ?`);
    stmt.run(message, id);
  }
  //전체 데이터 조회 및 삭제 함수 정의
  static readAll() {
    const stmt = db.prepare(`SELECT * FROM chat_records`);
    const result = stmt.all();
    return result;
  }
  static deleteAll() {
    const stmt = db.prepare(`DELETE FROM chat_records`);
    stmt.run();
  }
}

// 설문조사 기록과 사용자 정보의 관계 CRUD
class SurveyRecordsUserInfos {
  static create(surveyRecordId: number, userInfoId: string) {
    const stmt = db.prepare(
      `INSERT INTO survey_records_has_user_infos (survey_records_id, user_infos_id) VALUES (?, ?)`
    );
    stmt.run(surveyRecordId, userInfoId);
  }
  static read(surveyRecordId: number, userInfoId: string) {
    const stmt = db.prepare(
      `SELECT * FROM survey_records_has_user_infos WHERE survey_records_id = ? AND user_infos_id = ?`
    );
    const result = stmt.get(surveyRecordId, userInfoId);
    return result;
  }
  static delete(surveyRecordId: number, userInfoId: string) {
    const stmt = db.prepare(
      `DELETE FROM survey_records_has_user_infos WHERE survey_records_id = ? AND user_infos_id = ?`
    );
    stmt.run(surveyRecordId, userInfoId);
  }
  //전체 데이터 조회 및 삭제 함수 정의
  static readAll() {
    const stmt = db.prepare(`SELECT * FROM survey_records_has_user_infos`);
    const result = stmt.all();
    return result;
  }
  static deleteAll() {
    const stmt = db.prepare(`DELETE FROM survey_records_has_user_infos`);
    stmt.run();
  }
}

class MyDb {
  static userInfos = UserInfos;
  static surveyRecords = SurveyRecords;
  static testRecords = TestRecords;
  static chatRecords = ChatRecords;
  static surveyRecordsUserInfos = SurveyRecordsUserInfos;
}

export default MyDb;
