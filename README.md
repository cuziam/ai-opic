# AI OPIC 모의시험 앱

**OPIC**은 유명한 영어 말하기 시험으로, 많은 사람들이 무료 모의시험을 통해 준비하고 있습니다. 보다 현실감 있는 시험 환경을 제공하기 위해 AI를 활용한 모의시험 앱을 개발하게 되었습니다.

## 프로젝트 개요

### 소개

이 프로젝트는 학습자들이 실제 OPIC 시험과 비슷한 환경에서 연습할 수 있도록 설계되었습니다. 시험과 유사한 인터페이스와 기능을 제공하여 학습자가 몰입감 있게 준비할 수 있는 환경을 목표로 하고 있습니다.&#x20;

## 데모

- **데모 비디오**:

[![데모 비디오 시청](https://img.youtube.com/vi/NgIGsHcvDPo/0.jpg)](https://youtu.be/NgIGsHcvDPo)



## 주요 기능

- 실제 시험과 동일한 UI 제공
- 음성 녹음 및 재생 기능 구현
- ChatGPT API를 활용한 실제 시험과 유사한 질문 생성
- 녹음된 파일의 저장 및 관리 기능

## 사용 기술

- **프론트엔드**: Next.js, TailwindCSS

- **백엔드**: Node.js, SQLite (로컬 데이터베이스)

- **AI 연동**: ChatGPT API

- **활용 도구**: ScreenshotToCode (스크린샷을 UI 코드로 변환)

- **브랜치 관리**: Git-flow 전략

## 설치 및 실행 방법

```bash
# 리포지토리 클론
git clone https://github.com/cuziam/ai-opic.git

# 프로젝트 디렉토리로 이동
cd ai-opic

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## Git 브랜치 관리

- Git-flow 전략을 채택하여 브랜치를 체계적으로 관리하고 있습니다. `main`, `develop`, `feature` 브랜치로 나누어 작업을 분리하여 기능 개발과 안정성을 유지하고 있습니다.
- 특히, `develop` 브랜치에서 `feature` 브랜치를 rebase하여 병합함으로써, 브랜치가 과도하게 뻗어나가는 것을 방지하고 있습니다.

## 프로젝트 구조

```
📦 AI-OPIC-Mock-Exam
 ┣ 📂 app                        # 주요 페이지 구성 (로그인, 약관 동의, 준비, 환영 페이지)
 ┃ ┣ 📂 login                   # 로그인 관련 페이지
 ┃ ┣ 📂 policy-agreement        # 약관 동의 관련 페이지
 ┃ ┣ 📂 prepare                 # 시험 준비 관련 페이지
 ┃ ┣ 📂 welcome                 # 환영 페이지
 ┃ ┣ 📜 favicon.ico             # 웹사이트 파비콘
 ┃ ┗ 📜 globals.css             # 글로벌 스타일 파일
 ┣ 📂 components                # 재사용 가능한 UI 컴포넌트 모음
 ┣ 📂 lib                       # 백엔드 로직 및 유틸리티 파일들
 ┃ ┣ 📜 OpicDbHandler.ts        # OPIC 데이터베이스 핸들러
 ┃ ┣ 📜 db-types.ts             # 데이터베이스 타입 정의 파일
 ┃ ┣ 📜 fetch-sample-audio.js   # 샘플 오디오 파일 로드 스크립트
 ┃ ┣ 📜 initdb.js               # 데이터베이스 초기화 스크립트
 ┃ ┗ 📜 mydb.ts                 # 데이터베이스 설정 파일
 ┣ 📂 public                    # 정적 파일들이 위치한 디렉토리
 ┃ ┣ 📂 images                  # 이미지 파일들
 ┃ ┣ 📜 next.svg                # Next.js 로고 파일
 ┃ ┣ 📜 sample-voice.aac        # 샘플 음성 파일
 ┃ ┣ 📜 vercel.svg              # Vercel 로고 파일
 ┃ ┗ 📜 volume-processor.js     # 볼륨 처리 스크립트
 ┣ 📂 reference                 # 디자인 및 리소스 참고 자료
 ┃ ┣ 📜 erd.png                 # ERD 이미지 1
 ┃ ┣ 📜 erd2.png                # ERD 이미지 2
 ┃ ┗ 📜 erd3.png                # ERD 이미지 3
 ┣ 📂 test-data                 # 테스트에 사용되는 데이터 파일들
 ┣ 📜 .eslintrc.json            # ESLint 설정 파일
 ┣ 📜 .gitignore                # Git에서 무시할 파일 및 폴더 목록
 ┣ 📜 README.md                 # 프로젝트 정보 문서
 ┣ 📜 next.config.mjs           # Next.js 설정 파일
 ┣ 📜 opic.mwb                  # OPIC 데이터베이스 모델 파일
 ┣ 📜 package-lock.json         # 프로젝트 종속성 관리 파일 (잠금 버전)
 ┣ 📜 package.json              # 프로젝트 종속성 및 스크립트 관리 파일
 ┣ 📜 postcss.config.js         # PostCSS 설정 파일
 ┣ 📜 tailwind.config.ts        # Tailwind CSS 설정 파일
 ┗ 📜 tsconfig.json             # TypeScript 설정 파일
```

## 문의

궁금한 점이 있거나 문제가 발생했을 경우 [yameame320@gmail.com](mailto\:yameame320@gmail.com)으로 연락하거나, Issue 탭에 남겨주세요.
