const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const os = require('os');

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

let userQuestion = 'What is the future of AI?';

const CHUNK_SIZE = 25 * 1024 * 1024; 

// This function chunks the audio file into smaller parts
// We need chunking because OpenAI's limit for audio transcription is 25 MB
const chunkAudioFile = async (filePath) => {
  const stats = fs.statSync(filePath);
  const totalSize = stats.size;
  const chunks = [];
  let start = 0;

  while (start < totalSize) {
    const end = Math.min(start + CHUNK_SIZE, totalSize);
    const chunkPath = path.join(os.tmpdir(), `chunk_${start}_${end}.m4a`);
    const chunkStream = fs.createWriteStream(chunkPath);
    const readStream = fs.createReadStream(filePath, { start, end: end - 1 });

    readStream.pipe(chunkStream);

    await new Promise((resolve) => {
      chunkStream.on('finish', resolve);
    });

    chunks.push(chunkPath);
    start = end;
  }

  return chunks;
};

// This function returns a transcription given a chunk of audio
const transcribeChunk = async (chunkPath) => {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(chunkPath),
    model: 'whisper-1',
  });
  return transcription.text;
};

// This function gets the transcription of the entire audio file
const getTranscription = async() => {
  try {
    const filePath = './episodes_audio/interview1.m4a';
    if (!fs.existsSync(filePath)) {
      console.error('File not found', filePath);
      return;
    }

    const chunks = await chunkAudioFile(filePath);
    let combinedTranscription = '';

    for (const chunk of chunks) {
      const transcription = await transcribeChunk(chunk);
      combinedTranscription += transcription + ' ';
      fs.unlinkSync(chunk); // Need to delete the chunk after transcription
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an assistant that helps to summarize and answer questions based on transcribed text from podcast episodes.' },
        { role: 'user', content: combinedTranscription },
        { role: 'user', content: `Question: ${userQuestion}` }
      ],
    });

    console.log('GPT-4 Response:', response.choices[0].message.content);
  } catch (err) {
    console.error(err)
  }
}

getTranscription();