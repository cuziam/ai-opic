"use client";
import { useRouter } from "next/navigation";
export default function SampleQuestion() {
  const router = useRouter();
  const handleNextClick = (minusOrPlus: boolean) => {
    if (minusOrPlus === false) {
      router.push("/prepare/setup");
    } else {
      router.push("/prepare/begin-test");
    }
  };
  return (
    <main>
      <div className="Contents flex flex-col justify-center">
        <h1 className="text-2xl font-bold mb-4">Pre-Test Setup</h1>
        <div className="border-t border-gray-300 pt-4"></div>
        <div className="flex text-sm font-bold">
          <div className="VoiceControl flex">
            <div className="Viewer flex flex-col">
              <img
                src="https://placehold.co/200x200"
                alt="Placeholder image of a woman with brown hair, wearing a black suit, representing Ava"
                className="Viewer inline-block w-16 h-16"
              />
              <div className="PlayAndRange flex">
                <button className="Play p-2 play">&#9654;</button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value="50"
                  className="Volume"
                />
              </div>
              <button className="PlayRecording p-2 bg-blue-600 text-white text-xs">
                Click play button to listen
              </button>
            </div>
            <div className="ViewerVolume h-16 w-1 bg-black"></div>
          </div>

          <div className="Instruction">
            <div>문항 진행</div>
            <div className="QuestionNumber p-4">1</div>
            <p className="InstructionText p-2 bg-blue-600 text-white ">
              Play 아이콘(&#9654;)을 눌러 질문을 청취하십시오
              <br />
              <br />
              중요! 5초 이내에 버튼을 누르면 질문 다시듣기가 가능하며, 재청취는
              한번만 가능합니다.
            </p>
            <div className="bg-blue-600 p-2 text-white text-center">
              Recording...
            </div>
          </div>
        </div>
        <div className="PageControlButtons flex justify-between mt-8">
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
    </main>
  );
}
