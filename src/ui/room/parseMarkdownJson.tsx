
export const parseMarkdownJson = (text?: string) => {
  const jsonMatch = text?.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[1]);
  }
  return undefined;
};
