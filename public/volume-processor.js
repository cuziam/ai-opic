class VolumeProcessor extends AudioWorkletProcessor {
  //오디오 프로세싱을 위한 process 메서드를 구현
  process(inputs, outputs, parameters) {
    //오디오 입력 채널 가져오기, 볼륨만 계산하므로 단일 입력 채널만 사용하면 됨
    const input = inputs[0];
    let volume = 0;

    //입력 오디오 채널의 샘플값(음량)을 모두 더해 평균 볼륨을 계산
    for (let channel = 0; channel < input.length; channel++) {
      const inputChannel = input[channel];
      let sum = 0;
      for (let i = 0; i < inputChannel.length; i++) {
        sum += Math.abs(inputChannel[i]);
      }
      volume += sum / inputChannel.length;
    }
    //평균 볼륨을 계산
    volume /= input.length;

    //볼륨을 0~100 사이의 값으로 변환
    volume = Math.round(volume * 100);
    this.port.postMessage({ volume });
    return true;
  }
}

registerProcessor("volume-processor", VolumeProcessor);
