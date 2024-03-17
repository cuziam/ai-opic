const Database = require("better-sqlite3");
const db = new Database("../db/test.db", { verbose: console.log });

// surveys 테이블 생성
db.prepare(
  `CREATE TABLE IF NOT EXISTS surveys (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question TEXT NOT NULL
)`
).run();

// user_infos 테이블 생성
db.prepare(
  `CREATE TABLE IF NOT EXISTS user_infos (
  id TEXT PRIMARY KEY
)`
).run();

// test_records 테이블 생성
db.prepare(
  `CREATE TABLE IF NOT EXISTS test_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question TEXT NOT NULL,
  answer TEXT,
  feedback TEXT,
  user_infos_id TEXT NOT NULL,
  FOREIGN KEY (user_infos_id) REFERENCES user_infos(id)
)`
).run();

// surveys_answers 테이블 생성
db.prepare(
  `CREATE TABLE IF NOT EXISTS surveys_answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    answer TEXT,
    surveys_id INTEGER NOT NULL,
    UNIQUE (id, surveys_id),
    FOREIGN KEY (surveys_id) REFERENCES surveys(id)
  )`
).run();

// survey_records 테이블 생성
db.prepare(
  `CREATE TABLE IF NOT EXISTS survey_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_infos_id TEXT NOT NULL,
  surveys_answers_id INTEGER NOT NULL,
  surveys_answers_surveys_id INTEGER NOT NULL,
  UNIQUE (id, user_infos_id),
  FOREIGN KEY (user_infos_id) REFERENCES user_infos(id),
  FOREIGN KEY (surveys_answers_id, surveys_answers_surveys_id) REFERENCES surveys_answers(id, surveys_id)
)`
).run();

console.log("Database and tables have been created successfully.");
