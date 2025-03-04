import type {
  DaimonEventMap,
  StopSubject,
} from "@mjt-services/daimon-common-2025";
import { getConnection } from "./connection/Connections";

export const onEscape = async () => {
  console.log("Escape");
  const con = await getConnection();

  const foo: DaimonEventMap = {
    stop: "",
  };
  con.publish<StopSubject, typeof foo>({
    subject: "stop.all",
    payload: "",
  });
};
