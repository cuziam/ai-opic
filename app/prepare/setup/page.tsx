"use client";
import { useRouter } from "next/navigation";
export default function Setup() {
  const router = useRouter();
  const handleNextClick = (minusOrPlus: boolean) => {
    if (minusOrPlus === false) {
      router.push("/prepare/self-assessment");
    } else {
      router.push("/prepare/sample-question");
    }
  };

  return (
    <main>
      <div className="Contents flex flex-col justify-center">
        <h1 className="text-2xl font-bold mb-4">Pre-Test Setup</h1>
        <div className="border-t border-gray-300 pt-4"></div>
        <div className="flex">
          <div className="VoiceControl flex">
            <div className="ViewerAndPlay flex flex-col">
              <img
                src="https://placehold.co/200x200"
                alt="Placeholder image of a woman with brown hair, wearing a black suit, representing Ava"
                className="Viewer inline-block w-16 h-16"
              />
              <button className="Play w-6 h-4 play">&#9654;</button>
            </div>
            <div className="ViewerVolume h-16 w-1 bg-black"></div>
          </div>
          <div className="VoiceRecorder font-bold text-sm">
            <ol className="Instruction">
              <li>
                1. Play 아이콘(&#9654; )을 눌러 질문을 듣고 재생 음량을
                조정하십시오
              </li>
              <li>
                2. 마이크 점검을 위해 Start Recording을 누르고 답변 후 Stop
                Recording을 눌러 녹음을 마칩니다.
              </li>
              <li>
                3. Play Recording을 눌러 음성이 정상 녹음되었는지 확인하십시오.
              </li>
            </ol>
            <div className="RecorderButtons">
              <button className="StartRecording p-1 bg-green-600 text-white">
                Start Recording
              </button>
              <button className="StopRecording p-1 bg-red-600 text-white">
                Stop Recording
              </button>
              <button className="PlayRecording p-1 bg-blue-600 text-white">
                Play Recording
              </button>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value="50"
              className="UserVolume w-16 h-1 bg-black"
            />
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
    </main>
  );
}
