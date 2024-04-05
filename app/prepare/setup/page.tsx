"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { clear } from "console";
export default function Setup() {
  const router = useRouter();
  const [interviewerState, setInterviewerState] = useState<
    "pending" | "speaking"
  >("pending");
  const [recorderState, setRecorderState] = useState<
    "pending" | "recording" | "playing"
  >("pending");
  const [userVoiceVolume, setUserVoiceVolume] = useState<number>(0);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);

  const mediaStreamRef = useRef<MediaStream>(null);
  const mediaRecorderRef = useRef<MediaRecorder>(null);
  const audioFileRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext>(null);
  const audioWorkletNodeRef = useRef<AudioWorkletNode>(null);
  const intervalIdRef = useRef(null); // useRef를 사용하여 intervalId 저장

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

  //오디오 설정 초기화 sideeffect
  useEffect(() => {
    //mediaDevices API 사용 가능한지 확인
    if (!navigator.mediaDevices) {
      console.error("MediaDevices API is not supported");
      return;
    }
    //audio 권한 획득 & mediaStreamRef초기화
    try {
      const initializeAudio = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaStreamRef.current = stream;
        console.log("authorization: ok, audio");

        //mediaRecorderRef초기화
        mediaRecorderRef.current = new MediaRecorder(mediaStreamRef.current);

        //audioContextRef초기화
        audioContextRef.current = new AudioContext();
        await audioContextRef.current.audioWorklet.addModule(
          "/volume-processor.js"
        );
        audioContextRef.current.suspend(); //오디오 컨텍스트 처음엔 일시정지

        //audioWorkletNode 초기화
        audioWorkletNodeRef.current = new AudioWorkletNode(
          audioContextRef.current,
          "volume-processor"
        );
        //audioWorkletNode의 입력과 출력 설정
        const source = audioContextRef.current.createMediaStreamSource(
          mediaStreamRef.current
        ); //오디오 소스 생성
        source.connect(audioWorkletNodeRef.current); //소스를 workletNode에 연결
        audioWorkletNodeRef.current.connect(
          audioContextRef.current.destination
        ); // workletNode를 오디오 컨텍스트의 출력에 연결합니다.
        // Worklet에서 메시지를 받으면 볼륨 상태를 업데이트합니다.
        audioWorkletNodeRef.current.port.onmessage = (e) => {
          if (userVoiceVolume !== e.data.volume) {
            setUserVoiceVolume(e.data.volume);
          }
        };
      };
      (async () => {
        await initializeAudio();
      })();
    } catch (err) {
      console.log(err);
      throw new Error("Failed to initialize audio");
    }
  }, []);

  //녹음 관련 sideeffect
  useEffect(() => {
    // 녹음기 상태가 pending이거나, playing일 시
    let intervalId;
    console.log(recorderState);

    if (recorderState === "pending") {
      mediaRecorderRef.current?.stop();
      audioContextRef.current?.suspend();
      clearInterval(intervalId);
      return;
    }

    if (recorderState === "playing") {
      //재생완료 후 초기화
      mediaRecorderRef.current?.stop();
      audioContextRef.current?.suspend();
      if (audioFileRef.current) {
        audioFileRef.current?.play(); //재생 진행도 설정
        audioFileRef.current.ontimeupdate = () => {
          setPlaybackProgress(
            (audioFileRef.current!.currentTime /
              audioFileRef.current!.duration) *
              100
          );
        };
        audioFileRef.current!.onended = () => {
          setRecorderState("pending");
        };
      }

      return;
    }
    //recorderState가 recording일 때
    //초기화 sideeffect에서 mediaStreamRef, mediaRecorderRef, audioContextRef, audioWorkletNodeRef가 초기화되었으므로 null체크 불필요하긴 하다.
    //1. 오디오 녹음
    const chunks = [] as Blob[];
    mediaRecorderRef.current.ondataavailable = (event) => {
      chunks.push(event.data);
    };
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(chunks, { type: "audio/aac" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioFileRef.current = audio;
    };
    mediaRecorderRef.current.start(500);

    //2. 오디오 분석
    audioContextRef.current?.resume(); //오디오 컨텍스트 재개
    //how...? 200ms마다 workletNode에 메시지 전송하되, pending일 때 삭제
    intervalIdRef.current = setInterval(() => {
      audioWorkletNodeRef.current?.port.postMessage("getVolume");
    }, 200);

    //+3. 시간제한 후 녹음 중지
    const timeid = setTimeout(() => {
      console.log("recording timeout");
      setRecorderState("pending");
    }, 10000);

    return () => {
      console.log("cleanup: recording");
      // 위에서 실행한 작업들을 정리합니다.
      mediaRecorderRef.current?.stop();
      audioContextRef.current?.suspend();
      clearTimeout(timeid);
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null; // interval 정리 후 null로 설정
      }
    };
  }, [recorderState]);

  return (
    <main>
      <div className="Contents flex flex-col justify-center">
        <h1 className="text-2xl font-bold mb-4">Pre-Test Setup</h1>
        <div className="border-t border-gray-300 pt-4"></div>
        <div className="Setup flex gap-8">
          <div className="VoiceControl flex gap-4">
            <div className="ViewerAndPlay flex flex-col items-center gap-4">
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
                    ? "Play w-12 h-8 bg-orange-500 rounded text-gray-200"
                    : "Play w-12 h-8 animate-pulse bg-orange-500 rounded text-gray-200"
                }
                onClick={handleInterviewerState} //autoplay 정책 때문에 sideeffect사용대신 onClick이벤트핸들러로 직접 연결
              >
                {"\u25B6"}
              </button>
            </div>
            <div className="Volume flex flex-col items-center gap-2">
              <div className="UserVolumeBg w-2 h-full rounded-md border-2 flex flex-col-reverse content-center items-center">
                <div
                  className={`UserVolumeBar w-2 bg-blue-500 rounded-md transition-all ease-linear`}
                  style={{ height: `${userVoiceVolume}%` }}
                ></div>
              </div>
              <div className="Microphone">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-slate-800 w-4 h-4"
                  version="1.1"
                  viewBox="0 0 512 512"
                >
                  <g>
                    <g>
                      <path d="m439.5,236c0-11.3-9.1-20.4-20.4-20.4s-20.4,9.1-20.4,20.4c0,70-64,126.9-142.7,126.9-78.7,0-142.7-56.9-142.7-126.9 0-11.3-9.1-20.4-20.4-20.4s-20.4,9.1-20.4,20.4c0,86.2 71.5,157.4 163.1,166.7v57.5h-23.6c-11.3,0-20.4,9.1-20.4,20.4 0,11.3 9.1,20.4 20.4,20.4h88c11.3,0 20.4-9.1 20.4-20.4 0-11.3-9.1-20.4-20.4-20.4h-23.6v-57.5c91.6-9.3 163.1-80.5 163.1-166.7z" />
                      <path d="m256,323.5c51,0 92.3-41.3 92.3-92.3v-127.9c0-51-41.3-92.3-92.3-92.3s-92.3,41.3-92.3,92.3v127.9c0,51 41.3,92.3 92.3,92.3zm-52.3-220.2c0-28.8 23.5-52.3 52.3-52.3s52.3,23.5 52.3,52.3v127.9c0,28.8-23.5,52.3-52.3,52.3s-52.3-23.5-52.3-52.3v-127.9z" />
                    </g>
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <div className="Record font-bold text-sm flex flex-col gap-8">
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
            <div className="Recorder flex flex-col gap-4">
              <div className="RecorderButtons flex gap-2">
                {/* 녹음기 상태에 따라 버튼 활성화 */}

                <button
                  className="StartRecording p-1 bg-orange-500 text-white rounded active:bg-orange-700"
                  onClick={() => {
                    setRecorderState("recording");
                  }}
                >
                  Start Recording
                </button>

                <button
                  className="StopRecording p-1 bg-orange-500 text-white rounded active:bg-orange-700"
                  onClick={() => {
                    setRecorderState("pending");
                  }}
                >
                  Stop Recording
                </button>
                <button
                  className="PlayRecording p-1 bg-orange-500 text-white rounded active:bg-orange-700"
                  onClick={() => {
                    setRecorderState("playing");
                  }}
                >
                  Play Recording
                </button>
              </div>
              <div className="UserRecorderBg h-4 w-full p-4 bg-slate-400 flex items-center rounded-md">
                <div
                  className="UserRecorder h-2 bg-black rounded-md transition-all ease-linear"
                  style={{ width: `${playbackProgress}%` }}
                ></div>
              </div>
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
