"use client";
import { useState, useEffect, useRef, useCallback } from "react";
interface VoicePlayerProps {
  filePath: string;
  updateState: React.Dispatch<
    React.SetStateAction<"pending" | "playing" | "waiting" | "done">
  >;
}

export default function VoicePlayer({
  filePath,
  updateState,
}: VoicePlayerProps) {
  const [voicePlayerState, setVoicePlayerState] = useState<
    "pending" | "playing" | "waiting" | "done"
  >("pending");
  const [isPlayedBefore, setIsPlayedBefore] = useState<boolean>(false); //이전에 재생되었는지 여부
  const [progression, setProgression] = useState<number>(0); //재생 진행도
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const audioRef = useRef<HTMLAudioElement>(new Audio(filePath));

  const updateClassName = useCallback(
    (action: "add" | "remove", classname: string) => {
      if (playButtonRef.current) {
        if (action === "add") {
          playButtonRef.current.classList.add(classname);
        } else {
          playButtonRef.current.classList.remove(classname);
        }
      }
    },
    []
  );
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      const progress = (audio.currentTime / audio.duration) * 100;
      setProgression(progress);
    };

    if (audio) {
      audio.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, []);

  useEffect(() => {
    console.log("voicePlayerState:", voicePlayerState);
    updateState(voicePlayerState);
  }, [voicePlayerState, updateState]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    switch (voicePlayerState) {
      case "pending":
        updateClassName("remove", "animate-pulse");
        playButtonRef.current!.disabled = false;
        return;
      case "playing":
        audioRef.current.play();
        updateClassName("add", "animate-pulse");
        playButtonRef.current!.disabled = true;
        audioRef.current.onended = () => {
          setVoicePlayerState("waiting");
        };
        break;
      case "waiting":
        updateClassName("remove", "animate-pulse");
        if (isPlayedBefore === true) {
          setVoicePlayerState("done");
          break;
        }
        setIsPlayedBefore(true);
        //5초 대기 후 done으로 전환
        playButtonRef.current!.disabled = false;
        timeout = setTimeout(() => {
          setVoicePlayerState("done");
        }, 5000);
        break;
      case "done":
        //버튼 작동 불가능하게 만들기
        updateClassName("remove", "animate-pulse");
        playButtonRef.current!.disabled = true;
        break;
      default:
        break;
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [voicePlayerState, filePath]);

  return (
    <div className="VoicePlayer flex flex-col w-full">
      <div className="flex w-full">
        <button
          ref={playButtonRef}
          className={"PlayButton w-8 h-8 bg-orange-500 text-gray-200"}
          onClick={() => {
            setVoicePlayerState("playing");
          }} //autoplay 정책 때문에 sideeffect사용대신 onClick이벤트핸들러로 직접 연결
        >
          {voicePlayerState === "waiting" ? "\u21bb" : "\u25B6"}
        </button>

        <div className="PlayProgression flex-grow h-8 bg-slate-200 flex justify-center items-center">
          <div className="PlayProgressionBorder w-11/12 h-2 border-2 border-gray-300">
            <div
              className="PlayProgressionBar h-full bg-blue-500 transition-all ease-linear"
              style={{ width: `${progression}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
