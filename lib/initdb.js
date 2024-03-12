const Database = require("better-sqlite3");
const db = new Database("./db/ai_opic.db", { verbose: console.log });

db.pragma("foreign_keys = ON");

const createUserInfos = db.prepare(`
CREATE TABLE IF NOT EXISTS user_infos (
  id TEXT NOT NULL,
  PRIMARY KEY (id)
)`);
createUserInfos.run();

const createChatRecords = db.prepare(`
CREATE TABLE IF NOT EXISTS chat_records (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  user_infos_id TEXT NOT NULL,
  role TEXT NOT NULL,
  message TEXT NOT NULL,
  FOREIGN KEY (user_infos_id) 
    REFERENCES user_infos (id) 
    ON DELETE CASCADE 
    ON UPDATE NO ACTION
)`);
createChatRecords.run();

const createTestRecords = db.prepare(`
CREATE TABLE IF NOT EXISTS test_records (
  user_infos_id TEXT NOT NULL,
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  feedback TEXT NOT NULL,
  FOREIGN KEY (user_infos_id) 
    REFERENCES user_infos (id) 
    ON DELETE CASCADE
    ON UPDATE NO ACTION
)`);
createTestRecords.run();

const createSurveyRecords = db.prepare(`
CREATE TABLE IF NOT EXISTS survey_records (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL
)`);
createSurveyRecords.run();

const createSurveyRecordsHasUserInfos = db.prepare(`
CREATE TABLE IF NOT EXISTS survey_records_has_user_infos (
  survey_records_id INTEGER NOT NULL,
  user_infos_id TEXT NOT NULL,
  PRIMARY KEY (survey_records_id, user_infos_id),
  FOREIGN KEY (survey_records_id) 
    REFERENCES survey_records (id) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION,
  FOREIGN KEY (user_infos_id) 
    REFERENCES user_infos (id) 
    ON DELETE CASCADE
    ON UPDATE NO ACTION
)`);
createSurveyRecordsHasUserInfos.run();
