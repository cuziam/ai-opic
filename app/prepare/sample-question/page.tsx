"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import VoicePlayer from "@/components/VoicePlayer";
import VolumeBar from "@/components/VolumeBar";
type voicePlayerState = "pending" | "playing" | "waiting" | "done";
type userState = "pending" | "speaking" | "done";
export default function SampleQuestion() {
  //setup과 유사하지만 진행바가 없음
  const [voicePlayerState, setVoicePlayerState] =
    useState<voicePlayerState>("pending");
  const [userState, setUserState] = useState<userState>("pending");
  const [userVoiceVolume, setUserVoiceVolume] = useState<number>(0); //0~100
  const [VolumeBarPower, setVolumeBarPower] = useState<boolean>(false);

  const router = useRouter();
  const handleNextClick = useCallback(
    (minusOrPlus: boolean) => {
      if (minusOrPlus === false) {
        router.push("/prepare/setup");
      } else {
        router.push("/prepare/begin-test");
      }
    },
    [router]
  );
  const handleVoicePlayerState = useCallback((state: voicePlayerState) => {
    setVoicePlayerState(state);
    return;
  }, []);

  const handleUserVoiceVolume = useCallback((volume: number) => {
    setUserVoiceVolume(volume);
    return;
  }, []);

  //voicePlayerState에 따라 userState를 변경
  useEffect(() => {
    if (voicePlayerState === "pending" || voicePlayerState === "playing") {
      setUserState("pending");
      return;
    }
    if (voicePlayerState === "waiting") {
      setUserState("speaking");
      return;
    }
  }, [voicePlayerState]);

  useEffect(() => {
    console.log("userState:", userState);
    let timer: NodeJS.Timeout;
    switch (userState) {
      case "pending":
        //아무것도 안함
        break;
      case "speaking":
        //activate voice recognition
        if (timer) clearTimeout(timer);
        setVolumeBarPower(true);
        //3초 후 done으로 변경
        timer = setTimeout(() => {
          setUserState("done");
        }, 10000); //실제로는 2분
        break;
      case "done":
        //deactivate voice recognition
        setVolumeBarPower(false);
        //save the voice file
        break;
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [userState]);
  return (
    <main>
      <div className="Contents flex flex-col justify-center">
        <h1 className="text-2xl font-bold mb-4">Sample Question</h1>
        <div className="border-t border-gray-300 pt-4"></div>
        <div className="text-base font-bold mb-8">
          본 단계는 연습 문제 단계이며, 시험 성적에는 영향을 주지 않습니다.
        </div>
        <h1 className="text-xl font-bold mb-2">Question 1 of 1</h1>
        <div className="MainSection flex gap-8">
          <div className="VoiceControl flex gap-4">
            <div className="ImageAndPlayer flex flex-col items-center justify-center">
              <Image
                src="/images/interviewer.webp"
                width={200}
                height={200}
                alt="interviewer"
                priority
                style={{
                  width: "250px",
                  height: "250px",
                  objectFit: "cover", // 이 속성은 이미지가 컨테이너 안에 적절히 맞도록 조정합니다.
                }}
              />
              <VoicePlayer
                filePath="/sample-voice.aac"
                updateState={handleVoicePlayerState} //상태 업데이트 함수
              />
            </div>
            <VolumeBar
              userVoiceVolume={userVoiceVolume}
              updateUserVoiceVolume={handleUserVoiceVolume}
              power={VolumeBarPower}
            />
          </div>
          <div className="Maininfo font-bold text-sm flex flex-col gap-8">
            <div className="Progression flex flex-col gap-2">
              <div>문항 진행: </div>
              <ul className="flex items-center gap-2">
                <li className="w-8 h-8 bg-slate-600 flex text-white justify-center items-center">
                  1
                </li>
              </ul>
            </div>

            <div className="Help w-full p-4 bg-blue-600 text-white text-base">
              Play 아이콘을 눌러 질문을 청취하십시오
              <br />
              <br />
              중요!5초 이내에 버튼을 늘면 질문 다시듣기가 가능하며, 재청취는
              한번만 가능합니다.
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
