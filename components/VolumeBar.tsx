"use client";
import { useState, useEffect, useRef } from "react";

interface VolumeBarProps {
  power: boolean;
  userVoiceVolume: number;
  updateUserVoiceVolume: (volume: number) => void;
}
export default function VolumeBar({
  power,
  userVoiceVolume,
  updateUserVoiceVolume,
}: VolumeBarProps) {
  const [isSettingDone, setIsSettingDone] = useState<boolean>(false);
  const mediaStreamRef = useRef<MediaStream>(null);
  const mediaRecorderRef = useRef<MediaRecorder>(null);
  const audioFileRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext>(null);
  const audioWorkletNodeRef = useRef<AudioWorkletNode>(null);

  useEffect(() => {
    if (!navigator.mediaDevices || isSettingDone) {
      console.log(
        "MediaDevices API is not supported or setting is already done."
      );
      return;
    }

    const initializeAudio = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      console.log("authorization: ok, audio");

      // Initialize audio context and worklet node
      mediaRecorderRef.current = new MediaRecorder(mediaStreamRef.current);
      audioContextRef.current = new AudioContext();
      await audioContextRef.current.audioWorklet.addModule(
        "/volume-processor.js"
      );
      await audioContextRef.current.suspend();
      audioWorkletNodeRef.current = new AudioWorkletNode(
        audioContextRef.current,
        "volume-processor"
      );

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(audioWorkletNodeRef.current);
      audioWorkletNodeRef.current.connect(audioContextRef.current.destination);
    };

    initializeAudio()
      .then(() => setIsSettingDone(true))
      .catch((err) => {
        console.error("Failed to initialize audio", err);
      });

    // Cleanup function to prevent memory leaks
    return () => {
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [isSettingDone]);

  useEffect(() => {
    if (!isSettingDone) return;

    const updateVolume = (e) => {
      if (userVoiceVolume !== e.data.volume) {
        updateUserVoiceVolume(e.data.volume);
      }
    };

    if (audioWorkletNodeRef.current) {
      audioWorkletNodeRef.current.port.onmessage = updateVolume;
    }

    let timeout;
    if (power) {
      audioContextRef.current?.resume().then(() => {
        timeout = setInterval(() => {
          audioWorkletNodeRef.current?.port.postMessage("getVolume");
        }, 200);
      });
    } else {
      audioContextRef.current?.suspend();
      if (timeout) {
        clearInterval(timeout);
      }
    }

    // Cleanup function to remove the event listener
    return () => {
      if (audioWorkletNodeRef.current) {
        audioWorkletNodeRef.current.port.onmessage = null;
      }
      if (timeout) {
        clearInterval(timeout);
      }
    };
  }, [power, isSettingDone, userVoiceVolume, updateUserVoiceVolume]);

  return (
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
  );
}
