"use client";
import { useRouter } from "next/navigation";

export default function TestInstructions() {
  const router = useRouter();

  const handleNextClick = (minusOrPlus: boolean) => {
    if (minusOrPlus === false) {
      router.push("/prepare/sample-question");
    } else {
      router.push("/test");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">시험 진행 안내</h2>
      <p className="mb-8">유의사항을 읽고 각 체크박스를 선택하여 주십시오.</p>

      <div className="flex text-sm gap-4 mb-8">
        <div className="flex flex-col items-center">
          <div className="bg-gray-200 rounded-full p-4 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6 text-blue-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <p className="font-bold p-2">시험화면을 벗어나지 마십시오.</p>
          <input type="checkbox" />
          <p className="text-sm text-center">
            시험 중 다른 웹사이트나 <br />
            프로그램 실행 시 자동 종료되고 <br />
            로그인 화면으로 다시 이동하게 됩니다.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-gray-200 rounded-full p-4 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6 text-red-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 12H6"
              />
            </svg>
          </div>
          <p className="font-bold p-2">새로고침, 뒤로가기 금지 </p>
          <input type="checkbox" />
          <p className="text-sm text-center">
            시험 중 화면을 새로고침하거나 <br />
            브라우저의 뒤로가기 버튼을 <br />
            누르는 경우, 시험상에 자동 <br />
            종료되고 로그인 화면으로 다시 <br />
            이동하게 됩니다.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-gray-200 rounded-full p-4 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6 text-blue-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </div>
          <p className="font-bold p-2">말하기</p>
          <input type="checkbox" />
          <p className="text-sm text-center">
            각 질문의 내용에 부합하여 <br />
            최대한 자세하게 답변하되, 너무 <br />
            로소리로 말해 다른 수험자에게 <br />
            방해가 되지 않도록 주의 <br />
            바랍니다.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-gray-200 rounded-full p-4 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6 text-blue-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="font-bold p-2">시험 시간 엄수</p>
          <input type="checkbox" />
          <p className="text-sm text-center">
            시험 재한 시간은 40분입니다. <br />
            반드시 감독관의 시작 안내가 <br />
            있은 후 Begin을 누르고 시험을 <br />
            시작하십시오.
          </p>
        </div>
      </div>

      <div className="bg-purple-100 p-4 rounded mb-8">
        <p className="text-sm">
          기술적인 문제 발생 시, 당황하지 마시고 즉시 감독관에게 보고 바랍니다.
          재접속 시 문제가 있었던 부분부터 다시 진행하며, 추가시간을 부여합니다.
        </p>
      </div>

      <div className="text-orange-500 font-semibold py-2 px-4 rounded">
        준비되셨나요?
      </div>

      <div className="PageControlButtons flex justify-between mt-8 w-full">
        <button
          className="bg-orange-500 hover:bg-orange-700 text-white px-6 py-2 rounded"
          onClick={() => handleNextClick(false)}
        >
          Back
        </button>
        <button
          className="bg-orange-500 hover:bg-orange-700 text-white px-6 py-2 rounded"
          onClick={() => handleNextClick(true)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
