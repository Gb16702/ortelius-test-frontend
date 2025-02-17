export interface AudioSpectrumProperties {
  recordTime: number;
  audioBlob: Blob;
  stopRecording: () => void;
  sendAudio: (audioBlob: Blob) => void;
}
