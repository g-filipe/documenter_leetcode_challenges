export function markdownConverter(description) {
  const newLines = [];

  let found = 0;
  let previous = "";

  for (let line of description.split("\n")) {
    line = line.replace(/\u00a0/g, "");
    let isBold = false;
    if (line.match(/^Table: .+$/) || line.match(/^.+ table:$/)) {
      newLines.push("\n");
      isBold = true;
    }
    if (line.match(/^example/i) || line.match(/^sample input/i)) {
      isBold = true;
    }
    if (line.match(/^input:/i)) {
      line = line.replace("Input:", "**Input:**");
    }
    if (line.match(/^output:/i)) {
      line = line.replace("Output:", "**Output:**");
    }
    if (line.match(/^explanation:/i)) {
      line = line.replace("Explanation:", "**Explanation:**\n\n");
    }
    if (line.match(/\+(-+\+)+/)) {
      if (found % 3 == 0 && previous.trim() != "") {
        newLines.push("\n");
      }
      if (found % 3 == 1) {
        newLines.push(line.replaceAll("+", "|"));
      }
      if (found % 3 == 2) {
        newLines.push("<br>\n");
      }
      found++;
    } else {
      newLines.push(isBold ? `**${line}**` : line);
    }
    previous = line;
  }

  const convertedDescription = newLines.join("\n");
  
  return convertedDescription;
}
