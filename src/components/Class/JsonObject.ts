export interface Audio {
  src: string;
  rate: number;
  channels: number;
  language: string;
}

export interface Dialog {
  role: string;
  text: string;
}

export interface Root {
  type: string;
  audio: Audio;
  dialog: Dialog[];
  timestamp: [number, number, string, number, number][];
}

export class AudioClass implements Audio {
  src: string;
  rate: number;
  channels: number;
  language: string;

  constructor(src: string, rate: number, channels: number, language: string) {
    this.src = src;
    this.rate = rate;
    this.channels = channels;
    this.language = language;
  }
}

export class DialogClass implements Dialog {
  role: string;
  text: string;

  constructor(role: string, text: string) {
    this.role = role;
    this.text = text;
  }
}

export class RootClass implements Root {
  type: string;
  audio: AudioClass;
  dialog: DialogClass[];
  timestamp: [number, number, string, number, number][];

  constructor(
    type: string,
    audio: AudioClass,
    dialog: DialogClass[],
    timestamp: [number, number, string, number, number][]
  ) {
    this.type = type;
    this.audio = audio;
    this.dialog = dialog;
    this.timestamp = timestamp;
  }

  processTimeStamp(){
    let currentIndex = 0;

    for(let i = 0; i< this.timestamp.length-1; i++){
      if(this.isCharInRanges(this.timestamp[i+1][2])){
        currentIndex += this.timestamp[i][4];
        this.timestamp[i+1][3] = currentIndex.valueOf();
      }else{
        currentIndex += this.timestamp[i][4]+1;
        this.timestamp[i+1][3] = currentIndex.valueOf();
      }
    }
  }

  isCharInRanges(char: string): boolean {
    // Get the ASCII decimal code of the character
    const asciiCode = char.charCodeAt(0);
  
    // Check if the ASCII code is within the specified ranges
    return (
      (asciiCode > 31 && asciiCode < 47) || // Range 1: 32 to 46
      (asciiCode > 57 && asciiCode < 65)    // Range 2: 58 to 64
    );
  }
  
}

export function parseRoot(json: string): RootClass {
  const parsed = JSON.parse(json);

  const audio = new AudioClass(
    parsed.audio.src,
    parsed.audio.rate,
    parsed.audio.channels,
    parsed.audio.language
  );

  const dialog = parsed.dialog.map((d: any) => new DialogClass(d.role, d.text));

  return new RootClass(parsed.type, audio, dialog, parsed.timestamp);
}

