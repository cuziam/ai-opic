"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
export default function Setup() {
  const router = useRouter();
  const [interviewerState, setInterviewerState] = useState<
    "pending" | "speaking"
  >("pending");
  const [recorderState, setRecorderState] = useState<"pending" | "recording">(
    "pending"
  );
  const [userVoiceVolume, setUserVoiceVolume] = useState<number>(0);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  const handleNextClick = (minusOrPlus: boolean) => {
    if (minusOrPlus === false) {
      router.push("/prepare/self-assessment");
    } else {
      router.push("/prepare/sample-question");
    }
  };

  const handleInterviewerState = () => {
    if (interviewerState === "pending") {
      setInterviewerState("speaking");
      const audio = new Audio("/sample-voice.aac");
      audio.play();
      audio.onended = () => {
        setInterviewerState("pending");
      };
    }
    return;
  };

  //녹음 관련 sideeffect
  useEffect(() => {
    // 녹음 상태가 pending이면 아무것도 하지 않는다.
    if (recorderState === "pending") return;

    let audioContext;
    let workletNode;

    const initializeAudio = async () => {
      //mediaDevices API 사용 가능한지 확인
      if (!navigator.mediaDevices) {
        console.error("MediaDevices API is not supported");
        return;
      }

      //audioContext 생성 및 볼륨 분석
      try {
        console.log("Initializing audio");
        //마이크 권한 요청, 오디오 스트림 생성
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        audioContext = new AudioContext(); //오디오 컨텍스트 생성
        await audioContext.audioWorklet.addModule("/volume-processor.js"); //audioContext에 Worklet모듈 추가

        //audioWorkletNode 생성 & 연결
        workletNode = new AudioWorkletNode(audioContext, "volume-processor"); //Worklet 노드 생성
        const source = audioContext.createMediaStreamSource(stream); //오디오 소스 생성
        source.connect(workletNode); //소스를 workletNode에 연결
        workletNode.connect(audioContext.destination); // workletNode를 오디오 컨텍스트의 출력에 연결합니다.

        // Worklet에서 메시지를 받으면 볼륨 상태를 업데이트합니다.
        workletNode.port.onmessage = (event) => {
          setUserVoiceVolume(event.data.volume);
        };

        // // 스트림 녹음 로직
        // const mediaRecorder = new MediaRecorder(stream);
        // const chunks = [];
        // mediaRecorder.ondataavailable = (e) => {
        //   chunks.push(e.data);
        // };
        // mediaRecorder.onstop = () => {
        //   const blob = new Blob(chunks, { type: "audio/wav" });
        //   const url = URL.createObjectURL(blob);
        //   const audio = new Audio(url);
        //   console.log("url:", url);
        //   audio.play();
        // };
      } catch (err) {
        console.error("An error occurred in initializeAudio:", err);
        // 더 상세한 오류 로깅
        console.error("Error details:", {
          message: err.message,
          name: err.name,
        });
      }
    };
    (async () => {
      await initializeAudio();
    })();

    //리소스 정리
    return () => {
      console.log("Cleaning up audio resources");
      workletNode?.disconnect();
      audioContext?.close();
    };
  }, [recorderState]);

  return (
    <main>
      <div className="Contents flex flex-col justify-center">
        <h1 className="text-2xl font-bold mb-4">Pre-Test Setup</h1>
        <div className="border-t border-gray-300 pt-4"></div>
        <div className="flex">
          <div className="VoiceControl flex">
            <div className="ViewerAndPlay flex flex-col">
              <Image
                src="/images/interviewer.webp"
                width={200}
                height={200}
                alt="interviewer"
                priority
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "cover", // 이 속성은 이미지가 컨테이너 안에 적절히 맞도록 조정합니다.
                }}
              />

              <button
                className={
                  interviewerState === "pending"
                    ? "Play w-6 h-4"
                    : "Play w-6 h-4 animate-pulse"
                }
                onClick={handleInterviewerState} //autoplay 정책 때문에 sideeffect대신 onClick이벤트핸들러로 직접 연결
              >
                {"\u25B6"}
              </button>
            </div>
            <div>
              <div className="UserVolumeBg w-4 h-full rounded-md bg-slate-500">
                <div
                  className={`UserVolumeBar w-4 bg-blue-500 rounded-md`}
                  style={{ height: `${userVoiceVolume}%` }}
                ></div>
              </div>
            </div>
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
              <button
                className="StartRecording p-1 bg-green-600 text-white"
                onClick={() => {
                  setRecorderState("recording");
                }}
              >
                Start Recording
              </button>
              <button
                className="StopRecording p-1 bg-red-600 text-white"
                onClick={() => {
                  setRecorderState("pending");
                }}
              >
                Stop Recording
              </button>
              <button className="PlayRecording p-1 bg-blue-600 text-white">
                Play Recording
              </button>
            </div>
            <div className="UserRecorderBg h-4 w-full bg-slate-400">
              <div
                className="UserRecorder h-4 bg-blue-500"
                style={{ height: `${userVoiceVolume}%` }}
              ></div>
            </div>
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
