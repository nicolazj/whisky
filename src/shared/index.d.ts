


type WhisperConfigType = {
  service: "local" | "azure" | "cloudflare" | "openai";
  availableModels: {
    type: string;
    name: string;
    size: string;
    url: string;
    savePath: string;
  }[];
  modelsPath: string;
  model: string;
  ready?: boolean;
};

type WhisperOutputType = {
  engine?: string;
  model: {
    audio?: {
      cts: number;
      head: number;
      layer: number;
      state: number;
    };
    ftype?: number;
    mels?: number;
    multilingual?: number;
    text?: {
      cts: number;
      head: number;
      layer: number;
      state: number;
    };
    type: string;
    vocab?: number;
  };
  params: {
    language: string;
    model: string;
    translate: boolean;
  };
  result: {
    languate: string;
  };
  systeminfo: string;
  transcription: TranscriptionResultSegmentType[];
};