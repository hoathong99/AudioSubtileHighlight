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

    <pre>
      <div v-html="currentSubtitle"></div>
    </pre>

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

    runSubtitles() {
      this.displayDialog.dialog.forEach(element => {

      });
      if (!this.displayDialog.timestamp.length) return;
      let currentTime = this.$refs.audioPlayer.currentTime * 1000;
      let currentIdx = 0;

      this.stopSubtitles();

      for (let i = 0; i < this.displayDialog.timestamp.length; i++) {
        const [start, duration, word, idx, length] = this.displayDialog.timestamp[i];
        currentIdx += length;
        // Skip subtitles that have already ended
        if (start + duration < currentTime) {
          continue;
        }

        const showSubtitle = setTimeout(() => {

          const hideSubtitle = setTimeout(() => {
            this.idxTracker = currentIdx.valueOf;
            this.currentSubtitle = "";
            this.currentSubtitle = this.highlightText(idx, length);
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
    },

   
    highlightText(startIndex, subStringLength) {
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
