<template>
  <div>
    <input type="file" @change="uploadAudio" accept="audio/ogg" />
    <input type="file" @change="uploadSubtitles" accept="application/json" />
    <audio ref="audioPlayer" controls @timeupdate="updateSubtitle"></audio>

    <div class="subtitles">
      <p v-for="(line, index) in subtitles.dialog" :key="index" v-html="highlightText(line.text, index)"></p>
    </div>
  </div>
</template>

<script>
import * as JsonClasses from "@/components/Class/JsonObject";

var audioObject = new JsonClasses.AudioClass();

class AudioObserver {
  constructor(audioElement, startTime, endTime, callback) {
    this.audioElement = audioElement;
    this.startTime = startTime;
    this.endTime = endTime;
    this.callback = callback;
    this.isTriggered = false;

    // Attach the timeupdate event listener
    this.audioElement.addEventListener("timeupdate", this.checkTime.bind(this));
  }

  checkTime() {
    const currentTime = this.audioElement.currentTime * 1000; // Convert to milliseconds

    // Check if currentTime is within the range
    if (currentTime >= this.startTime && currentTime <= this.endTime) {
      if (!this.isTriggered) {
        this.callback(); // Trigger the callback
        this.isTriggered = true; // Ensure it only triggers once
      }
    } else {
      // Reset the flag if outside the range
      this.isTriggered = false;
    }
  }

  // Cleanup the event listener
  destroy() {
    this.audioElement.removeEventListener("timeupdate", this.checkTime.bind(this));
  }
}

export default {
  data() {
    return {
      audioSrc: null,
      subtitles: { dialog: [], timestamp: [] },
      activeIndex: -1,
    };
  },
  methods: {
    uploadAudio(event) {
      const file = event.target.files[0];
      if (file) {
        this.audioSrc = URL.createObjectURL(file);
        this.$refs.audioPlayer.src = this.audioSrc;
      }
    },
    uploadSubtitles(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.subtitles = JSON.parse(e.target.result);
          this.audioObject = JsonClasses.parseRoot(e.target.result);
          console.log(this.audioObject);
          this.audioObject.processTimeStamp();
          console.log("Chào Lan! Mình là James, đến từ Hoa Kỳ. Rất vui được gặp bạn.".length);
          if (this.subtitles.timestamp.length > 0) {
            const [start, duration] = this.subtitles.timestamp[0];
            const end = start + duration; // Calculate end time
            this.observer = new AudioObserver(
              this.$refs.audioPlayer,
              start,
              end,
              () => {
                console.log("Triggered callback for timestamp range:", start, end);
              }
            );
          }
        };
        reader.readAsText(file);
      }
    },


    updateSubtitle() {
      const currentTime = this.$refs.audioPlayer.currentTime * 1000; // Convert to milliseconds

      // Loop through the timestamp array
      for (let i = 0; i < this.subtitles.timestamp.length; i++) {
        const [start, duration, string] = this.subtitles.timestamp[i]; // Destructure the timestamp
        const end = start + duration; // Calculate end time

        // Check if currentTime is within the range
        if (currentTime >= start && currentTime <= end) {
          this.activeIndex = i;

          // Log the string attribute if it exists
          if (string) {
            // let sum = 0;
            // let tempIdx = 1;
            // for(let a =0; a < this.subtitles.dialog.length; a++){
            //   sum+= this.subtitles.dialog[a].length;
            //   if(sum > this.subtitles.timestamp[4]){
            //     tempIdx = a-1;
            //   }
            // }
            // this.highlightText(string,tempIdx-sum)

            console.log("Timestamp string:", string);


          }
          return;
        }
      }
      this.activeIndex = -1;
    },
    beforeUnmount() {
      // Cleanup the observer when the component is destroyed
      if (this.observer) {
        this.observer.destroy();
      }
    },
    playAudio() {
      this.$refs.audioPlayer.play();
    },
    pauseAudio() {
      this.$refs.audioPlayer.pause();
    },
    stopAudio() {
      this.$refs.audioPlayer.pause();
      this.$refs.audioPlayer.currentTime = 0;
    },

    highlightText(text, index) {
      const [startIdx, length] = this.subtitles.timestamp[index] || [null, null];
      if (startIdx === null || length === null) return text;

      const before = text.slice(0, startIdx);
      const highlight = text.slice(startIdx, startIdx + length);
      const after = text.slice(startIdx + length);

      return `${before}<span class='highlight'>${highlight}</span>${after}`;
    },
  },
};
</script>

<style>
.subtitles p {
  transition: color 0.3s;
}

.active {
  color: red;
  font-weight: bold;
}

.controls {
  margin-top: 10px;
}

.controls button {
  margin-right: 5px;
  padding: 5px 10px;
  cursor: pointer;
}

.highlight {
  background-color: yellow;
  font-weight: bold;
}
</style>
