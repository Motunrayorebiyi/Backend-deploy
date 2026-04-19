import dotenv from "dotenv";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import connectDB from "./config/db.js";
import Name from "./models/Name.js";

dotenv.config();

await connectDB();

const argv = yargs(hideBin(process.argv))
  .usage("Usage: node mongodb_names.js <firstname> <lastname>")
  .help()
  .argv;

const [firstname, lastname] = argv._;

try {
  if (firstname && lastname) {
    const name = await Name.create({ firstname, lastname });
    console.log("Added:", name.firstname, name.lastname);
  } else {
    const names = await Name.find().sort({ createdAt: -1 });

    if (!names.length) {
      console.log("No names found.");
    } else {
      console.log("Stored names:");
      names.forEach((n, i) =>
        console.log(`${i + 1}. ${n.firstname} ${n.lastname}`)
      );
    }
  }
} catch (error) {
  console.error(error.message);
} finally {
  process.exit();
}