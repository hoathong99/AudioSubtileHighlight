<template>
  <div class="audio-container">
    <!-- File Upload Inputs -->
    <input type="file" @change="handleAudioUpload" accept=".ogg" />
    <input type="file" @change="handleSubtitleUpload" accept=".json" />

    <!-- Audio Player -->
    <audio ref="audioPlayer" controls @play="runSubtitles" @pause="stopSubtitles" v-if="audioUrl">
      <source :src="audioUrl" type="audio/ogg" />
      Your browser does not support the audio element.
    </audio>
    <!-- <div class="subtitles">
      <p v-for="(line, index) in displayDialog.dialog" :key="index" v-html="line.text"></p>
    </div> -->
    <pre>
      <div v-html="currentSubtitle"></div>
    </pre>
    <!-- <div class="subtitles">
      
    </div> -->
    <!-- Subtitle Display -->
    <!-- <div class="subtitle" v-if="currentSubtitle">
      {{ currentSubtitle }}
    </div> -->

    <!-- Button to Manually Stop Subtitles -->
    <!-- <button @click="stopSubtitlesManually">Stop Subtitles</button> -->
  </div>
</template>

<script>

export default {
  data() {
    return {
      audioUrl: null,
      subtitles: [],
      currentSubtitle: "",
      subtitleTimeouts: [],
      displayDialog: [],
      idxTracker: 0,
      displaySubString: "",
      idxBr : [],
    };
  },

  methods: {
    handleAudioUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.audioUrl = URL.createObjectURL(file);
      }
    },
    handleSubtitleUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.subtitles = JSON.parse(e.target.result).timestamp;
          this.displayDialog = JSON.parse(e.target.result);
          this.audioObject = JSON.parse(e.target.result);
          // this.audioObject.dialog.forEach(element => {
          //   this.displaySubString.concat("/n", element.text);
          // });
          this.displaySubString = this.audioObject.dialog.map(u => u.text).join("<br>");
          console.log(this.displaySubString);
          let pos = this.displaySubString.indexOf("<br>");

          while (pos !== -1) {
            this.idxBr.push(pos);
            pos = this.displaySubString.indexOf("<br>", pos + 1);
          }
          console.log(this.idxBr);
        };
        reader.readAsText(file);
      }
    },
    // runSubtitles() {
    //   if (!this.subtitles.length) return;
    //   let currentTime = this.$refs.audioPlayer.currentTime * 1000;
    //   console.log("currentTime ", currentTime);
    //   // Stop any running subtitles
    //   this.stopSubtitles();

    //   this.subtitles.forEach((sub) => {
    //     const [start, duration, word] = sub;
    //       const showSubtitle = setTimeout(() => {
    //         this.currentSubtitle = word;
    //         console.log("Current Subtitle:", sub); // Log subtitle to console
    //         // Set another timeout to clear the subtitle after duration
    //         const hideSubtitle = setTimeout(() => {
    //           this.currentSubtitle = "";
    //         }, duration);

    //         this.subtitleTimeouts.push(hideSubtitle);
    //       }, start);

    //       this.subtitleTimeouts.push(showSubtitle);

    //   });

    // },

    // runSubtitles() {
    //   if (!this.displayDialog.timestamp.length) return;
    //   let currentTime = this.$refs.audioPlayer.currentTime * 1000;
    //   console.log("currentTime ", currentTime);
    //   // Stop any running subtitles
    //   this.stopSubtitles();

    //   this.displayDialog.timestamp.forEach((sub) => {
    //     const [start, duration, word, idx, length] = sub;
    //       const showSubtitle = setTimeout(() => {
    //         this.currentSubtitle = word;
    //         console.log("Current Subtitle:", sub); // Log subtitle to console
    //         // Set another timeout to clear the subtitle after duration
    //         const hideSubtitle = setTimeout(() => {
    //           this.currentSubtitle = "";
    //         }, duration);

    //         this.subtitleTimeouts.push(hideSubtitle);
    //       }, start);

    //       this.subtitleTimeouts.push(showSubtitle);

    //   });

    runSubtitles() {
      this.displayDialog.dialog.forEach(element => {
        // this.displaySubString.concat("/n", element.text);
      });
      // console.log("currentTime ", this.displaySubString);
      if (!this.displayDialog.timestamp.length) return;
      let currentTime = this.$refs.audioPlayer.currentTime * 1000;
      let currentIdx = 0;
      // console.log("currentTime ", currentTime);
      // Stop any running subtitles
      this.stopSubtitles();

      for (let i = 0; i < this.displayDialog.timestamp.length; i++) {
        const [start, duration, word, idx, length] = this.displayDialog.timestamp[i];
        currentIdx += length;
        // Skip subtitles that have already ended
        if (start + duration < currentTime) {
          continue;
        }

        const showSubtitle = setTimeout(() => {
          // this.currentSubtitle = word;
          // console.log("Current Subtitle:", word, `(Index: ${idx})`);
          // Set another timeout to clear the subtitle after duration
          const hideSubtitle = setTimeout(() => {
            this.idxTracker = currentIdx.valueOf;
            this.currentSubtitle = "";
            // console.log("index Tracker:", this.idxTracker);
            this.currentSubtitle = this.highlightText(idx, length);
            console.log(this.currentSubtitle);
          }, duration);

          this.subtitleTimeouts.push(hideSubtitle);
        }, Math.max(0, start - currentTime)); // Ensure no negative delay

        this.subtitleTimeouts.push(showSubtitle);
      }

    },

    stopSubtitles() {
      // Clear all scheduled subtitle timeouts
      this.subtitleTimeouts.forEach(clearTimeout);
      this.subtitleTimeouts = [];
      // this.currentSubtitle = "";
    },

    // highlightText(dialogIdx, startIndex, subStringLength) {
    //   let currentWorkingLine = this.displayDialog.dialog[dialogIdx].text;
    //   if (startIndex === null || subStringLength === null) return currentWorkingLine;
    //   const before = currentWorkingLine.slice(0, startIndex - dialogIdx);
    //   const highlight = currentWorkingLine.slice(startIndex - dialogIdx, startIndex - dialogIdx + subStringLength);
    //   const after = currentWorkingLine.slice(startIndex - dialogIdx + subStringLength);
    //   return `${before}<span class='highlight'>${highlight}</span>${after}`;
    // },
    highlightText(startIndex, subStringLength) {
      // let totalBr = 0;
      let flag = this.idxBr;
      flag.forEach(e => {
        if(startIndex > e){
          startIndex += 3;        
        }
      });
      if (startIndex === null || subStringLength === null) return this.displaySubString;
      const before = this.displaySubString.slice(0, startIndex);
      const highlight = this.displaySubString.slice(startIndex, startIndex + subStringLength);
      const after = this.displaySubString.slice(startIndex+subStringLength);
      return `${before}<span class='highlight'>${highlight}</span>${after}`;
    },
  }
};
</script>

<style scoped>
.audio-container {
  text-align: center;
  margin-top: 20px;
}

.subtitle {
  margin-top: 10px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

button {
  margin-top: 10px;
  padding: 8px 12px;
  font-size: 16px;
  cursor: pointer;
}


.highlight {
  background-color: yellow;
  font-weight: bold;
  transition: background-color 0.3s ease;
}


</style>
