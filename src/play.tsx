import { Idbs } from "@mjt-engine/idb";
import { Messages } from "@mjt-engine/message";
import { Bytes } from "@mjt-engine/byte";
import {
  TextgenConnectionMap,
  TEXTGEN_MODELS,
} from "@mjt-services/textgen-common-2025";
import { AppConfig } from "./AppConfig";
import type { AsrConnectionMap } from "@mjt-services/asr-common-2025";

export const play = async () => {
  try {
    await playAsr();
  } catch (error) {
    console.error(error);
  }
};

export const playAsr = async () => {
  const config = await Idbs.get(AppConfig, "config");
  const con = await Messages.createConnection<AsrConnectionMap>({
    server: "wss://mq.daimix.com",
    options: { log: console.log },
    token: config?.authToken,
  });
  console.log("con", con);
  const audio = await fetch("./female5.wav").then((r) => r.arrayBuffer());
  console.log("audio", audio);
  console.log("audio.length", audio.byteLength);
  const hash = await Bytes.addressStringOf({ bytes: audio });
  console.log("hash", hash);
  const resp = await con.request({
    subject: "asr.transcribe",
    options: { timeoutMs: 10000 },
    request: {
      body: {
        audio,
        word_timestamps: true,
        output: "json",
      },
    },
  });
  console.log("resp", resp);
};

// export const playTextgen = async () => {
//   // const creds = await (await fetch("./home.creds")).text();
//   // console.log("creds", creds);
//   const config = await Idbs.get(AppConfig, "config");
//   const con = await Messages.createConnection<TextgenConnectionMap>({
//     server: "wss://mq.daimix.com",
//     options: { log: console.log },
//     token: config?.authToken,
//   });
//   console.log("con", con);
//   const resp = await con.requestMany({
//     subject: "textgen.generate",
//     options: { timeoutMs: 10000 },
//     request: {
//       body: {
//         model: "google/gemini-flash-1.5",
//         prompt: "Tell me a joke about snow",
//         stream: true,
//       },
//     },
//     onResponse: function (response: {
//       delta?: string;
//       text?: string;
//       done?: boolean;
//     }): void | Promise<void> {
//       console.log("response", response);
//     },
//   });
//   console.log("resp", resp);
//   // Messages
//   // Messages
// };
