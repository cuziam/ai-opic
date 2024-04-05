/**
 * Represents a volume processor that calculates the volume of audio input.
 * @class
 * @extends AudioWorkletProcessor
 */
class VolumeProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.volume = 0;
    this.port.onmessage = (e) => {
      this.port.postMessage({ volume: this.volume });
    };
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input.length === 0 || input[0].length === 0) {
      // 입력 채널이 비어 있으면 볼륨을 0으로 설정하고 메시지를 보냅니다.
      this.volume = 0;
      this.port.postMessage({ volume: this.volume });
      return true;
    }

    let volume = 0;
    for (let channel = 0; channel < input.length; channel++) {
      const inputChannel = input[channel];
      let sum = 0;
      for (let i = 0; i < inputChannel.length; i++) {
        sum += Math.abs(inputChannel[i]);
      }
      if (inputChannel.length > 0) {
        volume += sum / inputChannel.length;
      }
    }

    if (input.length > 0) {
      volume /= input.length;
    }

    volume = Math.round(volume * 100);
    this.volume = volume;

    return true;
  }
}

registerProcessor("volume-processor", VolumeProcessor);
