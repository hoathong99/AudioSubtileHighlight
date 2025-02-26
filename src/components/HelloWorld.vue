<template>
  <div>
    <input type="file" @change="uploadAudio" accept="audio/ogg" />
    <input type="file" @change="uploadSubtitles" accept="application/json" />
    <audio ref="audioPlayer" controls @timeupdate="updateSubtitle"></audio>

    <!-- <div class="subtitles">
      <p v-for="(line, index) in subtitles.dialog" :key="index" v-html="line.text"></p>
    </div> -->

    <div class="subtitles">
      <p v-for="(line, index) in subtitles.dialog" :key="index" v-html="line.text"></p>
    </div>

    <p v-html="highlightSubtitle"></p>

  </div>
</template>

<script>
import * as JsonClasses from "@/components/Class/JsonObject";

var audioObject = new JsonClasses.AudioClass();


export default {
  data() {
    return {
      audioSrc: null,
      subtitles: { dialog: [], timestamp: [] },
      activeIndex: -1,
      displayDialog: {dialog: [], timestamp: [] },
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
          
          this.audioObject.processTimeStamp();
          console.log(this.subtitles);
        };
        // this.displayDialog = this.subtitles;
        reader.readAsText(file);
      }
    },


    updateSubtitle() {
      const currentTime = this.$refs.audioPlayer.currentTime * 1000; // Convert to milliseconds
      var currentWord = "";
      // Loop through the timestamp array
      for (let i = 0; i < this.subtitles.timestamp.length; i++) {
        const [start, duration, string] = this.subtitles.timestamp[i]; // Destructure the timestamp
        const end = start + duration; // Calculate end time

        // Check if currentTime is within the range
        if (currentTime >= start && currentTime <= end) {
          this.activeIndex = i;
          if(currentWord != string ){
            currentWord = string;
            console.log(string,currentTime);
          }
          // Log the string attribute if it exists
          // if (string) {
            // let sum = 0;
            // let tempIdx = 1;
            // for(let a =0; a < this.subtitles.dialog.length; a++){
            //   sum += this.subtitles.dialog[a].text.length;
            //   if(sum >= this.subtitles.timestamp[i][3]){
            //     tempIdx = a;
            //     sum -= this.subtitles.dialog[a].text.length;
            //     break;
            //   }
            // }
            // sum-= this.subtitles.dialog[a].text.length;
            // this.highlightText(tempIdx,this.subtitles.timestamp[i][4]-sum, this.subtitles.timestamp[i][5]);
            // this.subtitles.dialog[tempIdx] = this.highlightText(tempIdx,this.subtitles.timestamp[i][3]-sum, this.subtitles.timestamp[i][4]);
            // console.log("Timestamp string:", string);
            // console.log("render string:", this.highlightText(tempIdx,this.subtitles.timestamp[i][3]-sum, this.subtitles.timestamp[i][4]));

          // }
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

    // highlightText(text, index) {

    //   const [startIdx, length] = this.subtitles.timestamp[index] || [null, null];

    //   if (startIdx === null || length === null) return text;

    //   const before = text.slice(0, startIdx);
    //   const highlight = text.slice(startIdx, startIdx + length);
    //   const after = text.slice(startIdx + length);

    //   return `${before}<span class='highlight'>${highlight}</span>${after}`;
    // },


    highlightText(dialogIdx, startIndex, subStringLength) {
      let currentWorkingLine = this.subtitles.dialog[dialogIdx].text;
      if (startIndex === null || subStringLength === null) return currentWorkingLine;
      const before = currentWorkingLine.slice(0, startIndex-dialogIdx);
      const highlight = currentWorkingLine.slice(startIndex-dialogIdx, startIndex-dialogIdx + subStringLength);
      const after = currentWorkingLine.slice(startIndex-dialogIdx + subStringLength);
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
  transition: background-color 0.3s ease;
}
</style>
