
export type WithSpec = {
  spec?: string;
  [key: string]: any;
};

export const isWithSpec = (maybe: unknown): maybe is WithSpec => {
  const straw = maybe as WithSpec;
  return (
    typeof straw === "object" &&
    maybe !== null &&
    typeof straw.spec === "string"
  );
};
