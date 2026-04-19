import { writeFile, readFile } from "fs/promises";

async function fileOperations() {
  try {
    const name = "Motunrayo Orebiyi";
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();

    const content = `Name: ${name}
      Date: ${date}
      Time: ${time}`;

    await writeFile("output.txt", content);
    const fileContent = await readFile("output.txt", "utf8");

    console.log(fileContent);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

fileOperations();
