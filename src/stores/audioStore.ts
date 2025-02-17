import { create } from "zustand";

interface AudioStore {
  recording: boolean;
  recordTime: number;
  loading: boolean;
  audioBlob: Blob | null;
  startRecording: () => void;
  stopRecording: () => void;
  setAudioBlob: (audioBlob: Blob) => void;
}

let timer: ReturnType<typeof setInterval> | null = null;

export const useAudioStore = create<AudioStore>(set => ({
  recording: false,
  recordTime: 0,
  loading: false,
  audioBlob: null,

  startRecording: () => {
    set({ recording: true, recordTime: 0, loading: false });

    timer = setInterval(() => {
      set(state => ({ recordTime: state.recordTime + 1 }));
    }, 1000);
  },

  stopRecording: () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }

    set({ recording: false, recordTime: 0 });
  },

  setAudioBlob: (audioBlob: Blob) => {
    set({ audioBlob });
  },
}));
