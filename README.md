
# Project Progress  
[Demo Video](https://youtu.be/JxYszUOaXmU) 
![Image](https://github.com/user-attachments/assets/181b6a7a-07a0-4d8b-a638-637156dfa21d)
- Fully runnable with ogg audio, json subtitle provided
- Take in ogg audio and json subtitle file from user upload
- Run substitle word by word, calculate runtime using json timestamp and calculate start time using current audio playtime
- Able to update subtile on the play to match current audio playtime
## Day 1  
- Started the project  
- Learned basic components and layout  
- Designed the general render layout, including an audio player and subtitle lines (still rendered as discrete line objects)  
- Implemented file upload functionality  
- Got the audio player working  
- Attempted real-time tracking of the audio player to match `currentTime` with subtitle JSON timestamps  
  - Tracking interval was inconsistent and missed a lot  
- Tried matching subtitles with discrete dialog objects by reindexing timestamps  
  - Calculated mappings from the current timestamp to the displayed dialog line for highlighting  

## Day 2  
- Could not achieve reliable real-time tracking due to inconsistent intervals and hardware limitations  
- Switched to running subtitles independently using their own timestamps  
  - `currentTime` tracking now only determines where to continue highlighting  
- Joined the entire dialog into a single string with HTML elements instead of discrete lines  
- Implemented a highlight function to style specific words  
  - Used timeouts to trigger highlights at the correct time  
- Adjusted calculations for timing and duration of word highlights  
- Ran tests with decent results  
- Uploaded the project to GitHub and wrote the README  


 
