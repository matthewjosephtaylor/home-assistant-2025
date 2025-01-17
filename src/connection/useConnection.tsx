import { useState, useEffect } from "react";
import { getConnection, type createConnection } from "./Connections";

export const useConnection = () => {
  const [connection, setConnection] = useState<
    Awaited<ReturnType<typeof createConnection>> | undefined
  >(undefined);

  useEffect(() => {
    (async () => {
      setConnection(await getConnection());
    })();
  }, []);

  return connection;
};
