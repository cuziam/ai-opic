"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import VolumeBar from "@/components/VolumeBar";
import AudioPlayer from "@/components/AudioPlayer";

export default function Setup() {
  const router = useRouter();
  const [audioPlayerState, setAudioPlayerState] = useState<
    "pending" | "speaking"
  >("pending");
  const [recorderState, setRecorderState] = useState<
    "pending" | "recording" | "playing"
  >("pending");
  const [userVoiceVolume, setUserVoiceVolume] = useState<number>(0);
  const [volumeBarPower, setVolumeBarPower] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const handleNextClick = useCallback(
    (minusOrPlus: boolean) => {
      if (minusOrPlus === false) {
        router.push("/prepare/self-assessment");
      } else {
        router.push("/prepare/sample-question");
      }
    },
    [router]
  );

  const handleUserVoiceVolume = useCallback((volume: number) => {
    setUserVoiceVolume(volume);
    return;
  }, []);

  const handleAudioPlayerState = useCallback(() => {
    if (audioPlayerState === "pending") {
      setAudioPlayerState("speaking");
    }
  }, [audioPlayerState]);

  //오디오 플레이어 관련 sideeffect
  useEffect(() => {
    //샘플 오디오 파일 로드
    if (audioRef.current === null) {
      audioRef.current = new Audio("/sample-voice.aac");
      return;
    }
    //오디오 파일 재생
    if (audioPlayerState === "speaking") {
      audioRef.current.play();
      audioRef.current.onended = () => {
        setAudioPlayerState("pending");
      };
      return;
    }
    if (audioPlayerState === "pending") {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      return;
    }
  }, [audioPlayerState]);

  //볼륨바 관련 sideeffect
  useEffect(() => {
    console.log("recorderState:", recorderState);
    if (recorderState === "pending" || recorderState === "playing") {
      setVolumeBarPower(false);
    }
    if (recorderState === "recording") {
      setVolumeBarPower(true);
    }
  }, [recorderState]);

  // //녹음 관련 sideeffect
  // useEffect(() => {
  //   // 녹음기 상태가 pending이거나, playing일 시
  //   let intervalId;
  //   console.log(recorderState);

  //   if (recorderState === "pending") {
  //     mediaRecorderRef.current?.stop();
  //     audioContextRef.current?.suspend();
  //     clearInterval(intervalId);
  //     return;
  //   }

  //   if (recorderState === "playing") {
  //     //재생완료 후 초기화
  //     mediaRecorderRef.current?.stop();
  //     audioContextRef.current?.suspend();
  //     if (audioFileRef.current) {
  //       audioFileRef.current?.play(); //재생 진행도 설정
  //       audioFileRef.current.ontimeupdate = () => {
  //         setPlaybackProgress(
  //           (audioFileRef.current!.currentTime /
  //             audioFileRef.current!.duration) *
  //             100
  //         );
  //       };
  //       audioFileRef.current!.onended = () => {
  //         setRecorderState("pending");
  //       };
  //     }

  //     return;
  //   }
  //   //recorderState가 recording일 때
  //   //초기화 sideeffect에서 mediaStreamRef, mediaRecorderRef, audioContextRef, audioWorkletNodeRef가 초기화되었으므로 null체크 불필요하긴 하다.
  //   //1. 오디오 녹음
  //   const chunks = [] as Blob[];
  //   mediaRecorderRef.current.ondataavailable = (event) => {
  //     chunks.push(event.data);
  //   };
  //   mediaRecorderRef.current.onstop = () => {
  //     const audioBlob = new Blob(chunks, { type: "audio/aac" });
  //     const audioUrl = URL.createObjectURL(audioBlob);
  //     const audio = new Audio(audioUrl);
  //     audioFileRef.current = audio;
  //   };
  //   mediaRecorderRef.current.start(500);

  //   //2. 오디오 분석
  //   audioContextRef.current?.resume(); //오디오 컨텍스트 재개
  //   //how...? 200ms마다 workletNode에 메시지 전송하되, pending일 때 삭제
  //   intervalIdRef.current = setInterval(() => {
  //     audioWorkletNodeRef.current?.port.postMessage("getVolume");
  //   }, 200);

  //   //+3. 시간제한 후 녹음 중지
  //   const timeid = setTimeout(() => {
  //     console.log("recording timeout");
  //     setRecorderState("pending");
  //   }, 10000);

  //   return () => {
  //     console.log("cleanup: recording");
  //     // 위에서 실행한 작업들을 정리합니다.
  //     mediaRecorderRef.current?.stop();
  //     audioContextRef.current?.suspend();
  //     clearTimeout(timeid);
  //     if (intervalIdRef.current) {
  //       clearInterval(intervalIdRef.current);
  //       intervalIdRef.current = null; // interval 정리 후 null로 설정
  //     }
  //   };
  // }, [recorderState]);

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
                  audioPlayerState === "pending"
                    ? "Play w-12 h-8 bg-orange-500 rounded text-gray-200"
                    : "Play w-12 h-8 animate-pulse bg-orange-500 rounded text-gray-200"
                }
                onClick={handleAudioPlayerState} //autoplay 정책 때문에 sideeffect사용대신 onClick이벤트핸들러로 직접 연결
              >
                {"\u25B6"}
              </button>
            </div>

            <VolumeBar
              userVoiceVolume={userVoiceVolume}
              updateUserVoiceVolume={handleUserVoiceVolume}
              power={volumeBarPower}
            />
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
                  // style={{ width: `${playbackProgress}%` }}
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
