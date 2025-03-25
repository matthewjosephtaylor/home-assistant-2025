import { evaluateProgram } from "./chatlang/evaluateProgram";
import { parseProgram } from "./chatlang/parseProgram";
import { SimpleEvaluator } from "./chatlang/SimpleEvaluator";
import { getConnection } from "./connection/Connections";

export const play = async () => {
  try {
    // await playWebclient();
    await playTextgen();
  } catch (error) {
    console.error(error);
  }
};
export const playTextgen = async () => {
  console.log("playTextgen");
  const con = await getConnection();
  con.requestMany({
    onResponse: (response) => {
      console.log("response", response);
    },
    subject: "textgen.generate",
    request: {
      body: {
        // prompt: "tell me a joke about snow",
        messages: [{ content: "tell me a joke about snow", role: "user" }],
        model: "gemma3:1b",
        stream: true,
        // width: 512,
        // height: 512,
        // seed: 42,
        // cfg_scale: 7,
        // steps: 10,
      },
    },
  });
};

export const playWebclient = async () => {
  console.log("playWebclient");
  const con = await getConnection();
  con.requestMany({
    onResponse: (response) => {
      console.log("response", response);
    },
    subject: "webclient.exec",
    request: {
      body: [
        {
          name: "open",
          // params: "https://www.example.com"
          params: "https://www.google.com/search?q=cute+cats",
        },
        { name: "markdown" },
        { name: "screenshot" },
        { name: "pdf" },
      ],
    },
  });
};

// export const playImagegen = async () => {
//   console.log("playImagegen");
//   const con = await getConnection();
//   con.requestMany({
//     onResponse: (response) => {
//       console.log("response", response);
//     },
//     subject: "imagegen.txt2img",
//     request: {
//       body: {
//         prompt: "A cat in a hat",
//         width: 512,
//         height: 512,
//         seed: 42,
//         cfg_scale: 7,
//         steps: 10,
//       },
//     },
//   });
// };

export const playChat = async () => {
  // const program = ChatLang.Program.parse("Hi @Joe /help");
  // if (program.status) {
  //   console.log("AST =>", JSON.stringify(program.value, null, 2));
  // } else {
  //   console.error("Parse Error:", program.expected);
  // }
  //  evaluateProgram(program, )

  const input = "Hello @Joe how are you? /help /foo";
  const ast = parseProgram(input);
  // console.log("Parsed Program AST:", JSON.stringify(ast, null, 2));

  const output = await evaluateProgram(ast, SimpleEvaluator);
  console.log("Evaluated Output =>", output);
};

// export const playAsr = async () => {
//   const config = await Idbs.get(AppConfig, "config");
//   const con = await Messages.createConnection<AsrConnectionMap>({
//     server: "wss://mq.daimix.com",
//     options: { log: console.log },
//     token: config?.authToken,
//   });
//   console.log("con", con);
//   const audio = await fetch("./female5.wav").then((r) => r.arrayBuffer());
//   console.log("audio", audio);
//   console.log("audio.length", audio.byteLength);
//   const hash = await Bytes.addressStringOf({ bytes: audio });
//   console.log("hash", hash);
//   const resp = await con.request({
//     subject: "asr.transcribe",
//     options: { timeoutMs: 10000 },
//     request: {
//       body: {
//         audio,
//         word_timestamps: true,
//         output: "json",
//       },
//     },
//   });
//   console.log("resp", resp);
// };

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
