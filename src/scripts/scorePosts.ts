import fs from "fs";
import path from "path";
import { draftPost } from "../services/geminiService";

async function scorePosts() {
  // Get the exact path to data/notes.json in the project root
  const notesPath = path.join(__dirname, "../../data/notes.json");
  
  // Check if the file exists
  if (!fs.existsSync(notesPath)) {
    console.error(`❌ data/notes.json not found at: ${notesPath}`);
    console.error("Please ensure the 'data' folder and 'notes.json' file exist in the project root.");
    return;
  }

  // Read the file
  const notes = JSON.parse(fs.readFileSync(notesPath, "utf-8"));
  let passed = 0;

  console.log("| id | result | attempts | words | bullets |");
  console.log("|---|---|---|---|---|");

  // Loop through each note
  for (const note of notes) {
    const noteText = note.text;

    // R4: Skip empty or whitespace-only notes
    if (!noteText || noteText.trim() === "") {
      console.log(`| ${note.id} | skipped | 0 | - | - |`);
      continue;
    }

    const result = await draftPost(noteText);
    
    if (result.ok) {
      passed++;
      const fullText = `${result.data.intro} ${result.data.bullets.join(" ")} ${result.data.takeaway}`;
      const words = fullText.split(/\s+/).filter(Boolean).length;
      console.log(`| ${note.id} | ok | ${result.attempts} | ${words} | ${result.data.bullets.length} |`);
    } else {
      console.log(`| ${note.id} | failed | ${result.attempts} | - | - |`);
    }

    // Add a delay to prevent hitting the API rate limit (5 requests per minute)
    // Waiting for 12 seconds ensures we stay well below the limit
    await new Promise(resolve => setTimeout(resolve, 12000)); 
  }
  
  console.log(`\nTotal Passed: ${passed} / ${notes.length}`);
}

// Call the function
scorePosts();