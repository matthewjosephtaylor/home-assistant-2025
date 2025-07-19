export class MarkdownJsonExtractor {
  private buffer = "";
  private inBlock = false;

  write(chunk: string): string[] {
    this.buffer += chunk;
    const output: string[] = [];

    let i = 0;
    while (i < this.buffer.length) {
      if (!this.inBlock) {
        // Look for opening fence ```json
        const openIdx = this.buffer.indexOf("```json", i);
        if (openIdx === -1) break; // No opening found
        i = openIdx + 7; // Move past "```json"
        this.inBlock = true;
      } else {
        // Look for closing fence ```
        const closeIdx = this.buffer.indexOf("```", i);
        if (closeIdx === -1) {
          // No closing fence yet, emit everything from i to end
          output.push(this.buffer.slice(i));
          this.buffer = ""; // Clear buffer because we emitted it
          return output;
        }
        // Closing fence found, emit content up to it
        output.push(this.buffer.slice(i, closeIdx));
        i = closeIdx + 3;
        this.inBlock = false;
      }
    }

    // Keep unprocessed part in buffer
    this.buffer = this.buffer.slice(i);
    return output;
  }
}
