import { Vads } from "@mjtdev/vad-2025";
import { Box, Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Connections } from "../connection/Connections";
import { textUpdater } from "./StreamingText";

export const MicrophoneButton: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  const handleEnableMicrophone = async () => {
    try {
      const {
        audioContext: context,
        source,
        stream,
      } = await Vads.startVad({
        onSpeechStart: () => {
          textUpdater("...");
        },
        onSpeechEnd: async (wavBuffer) => {
          console.log("Speech ended", wavBuffer);
          const con = await Connections.getConnection();
          const transcription = await con.request({
            subject: "asr.transcribe",
            request: {
              body: { audio: wavBuffer, word_timestamps: true, output: "json" },
            },
          });
          console.log("out", transcription);
          if (typeof transcription != "string") {
            console.log("transcription", transcription.text);
            const words = transcription.text
              .trim()
              .split(" ")
              .map((word) => {
                return word.toLocaleLowerCase();
              });
            console.log("words", words);
            const wakeWords = ["hey", "house,"];

            // make sure the first words are the wake phrase

            textUpdater(transcription.text);
            if (
              words.length > 2 &&
              words[0] === wakeWords[0] &&
              words[1] === wakeWords[1]
            ) {
              const cleanWords = words.slice(2);
              console.log("cleanWords", cleanWords);
              con.requestMany({
                subject: "textgen.generate",
                onResponse: (response) => {
                  console.log("response", response);
                  textUpdater(response.text || "");
                },
                request: {
                  body: {
                    model: "google/gemini-flash-1.5",
                    prompt: cleanWords.join(" "),
                    stream: true,
                  },
                },
              });
            }
          }
        },
      });
      // const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // const context = new AudioContext();
      // const source = context.createMediaStreamSource(stream);
      const analyserNode = context.createAnalyser();
      // const analyserNode = Asserts.assertValue(await Vads.getMicAudio(true));
      analyserNode.fftSize = 256;

      source.connect(analyserNode);
      setAudioContext(context);
      setAnalyser(analyserNode);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!ctx || !analyser) return;

      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = "lime";
      ctx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      requestAnimationFrame(draw);
    };

    draw();
  }, [analyser]);

  return (
    <Box>
      <Button variant="contained" onClick={handleEnableMicrophone}>
        Enable Microphone
      </Button>
      {analyser && (
        <Box mt={2}>
          <canvas
            ref={canvasRef}
            style={{
              width: "100%",
              maxWidth: "300px",
              height: "100px",
              background: "#000",
            }}
          />
        </Box>
      )}
    </Box>
  );
};
