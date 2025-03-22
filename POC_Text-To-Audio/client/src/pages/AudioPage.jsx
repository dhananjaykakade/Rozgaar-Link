import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAudioFileById } from "../services/audioService";

const AudioPage = () => {
  const { audioId } = useParams();  // Retrieve audioId from URL params
  const [audioFile, setAudioFile] = useState(null);

  useEffect(() => {
    const fetchAudioFile = async () => {
      try {
        const data = await getAudioFileById(audioId);
        setAudioFile(data);
      } catch (error) {
        console.error("Error fetching audio file:", error);
        alert("Error fetching audio file");
      }
    };

    fetchAudioFile();
  }, [audioId]);

  return (
    <div>
      {audioFile ? (
        <div>
          <h3>{audioFile.audioFilename}</h3>
          <audio controls>
            <source src={`http://localhost:3000/audio/${audioFile.audioFilename}`} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      ) : (
        <p>Loading audio...</p>
      )}
    </div>
  );
};

export default AudioPage;
