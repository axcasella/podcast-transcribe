# Podcast Transcription and Question Answering 

This project transcribes Alex's podcast episodes and allows users to ask questions based on the transcribed text. The episodes are originally hosted on Spotify: [Driving Forces Podcast](https://open.spotify.com/show/5w2qgWTomGnT6yNx8TjiaL).

Since Spotify doesn't allow direct downloads, two original podcast audio files have been added for demo purposes. In total, there are 7 episodes, so 5 are not included.

### Prerequisites

- Node.js
- npm

### To run
- Create a .env file. Follow the .env.example file. 
- Run `node main.js`
- Change the userQuestion global variable for new questions. 

### Future Improvements

- Improve Chunking: Currently, the script chunks the audio at exactly 25 MB, which is the limit for OpenAI. There are better ways to chunk the data to avoid breaking off mid-sentence.

- Customization Options: Provide options for customization, such as specifying the chunk size.

- Error Handling: Improve error handling for long wait times and potential connection errors during transcription.

- Retry Logic: Introduce logic to handle failures in chunking and retry the chunking process.

- Code Structure: Break the file into components for better readability and set up a more organized directory structure.

- API Exposure: Expose APIs to allow the upload of additional audio files and interaction with a frontend.