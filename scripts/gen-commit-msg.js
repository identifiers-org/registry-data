// This scripts generates a human readable commit message for periodic updates
//   It assumes the output of "git status --porcelain" is passed to this via stdin after sync.js & git-add are run

import * as readline from 'readline';
import { stdin, stdout } from 'process';
import Path from 'path'


const changes = {
    modified: [],
    created: [],
    other: false
}

const parsePorcelainChangeString = (line) => {
    if (!line) return;

    const changeArr = line.trim().split(/\s+/);
    if (changeArr.length !== 2) {
        return;
    }
    const [statusCode, fileDescription] = changeArr;
    const filePaths = fileDescription.includes("->") ?
    fileDescription.split(/\s?->\s?/) : [fileDescription];
    
    for (const file of filePaths) {
        if (file === "registry-data/full.json") {
            continue;
        } else if (!file.startsWith("registry-data")) {
            changes.other = true;
        } else {
            const prefix = Path.parse(file).name;
            if (statusCode.includes("A")) {
                changes.created.push(prefix);
            } else if (statusCode.includes("M")) {
                changes.modified.push(prefix);
            }
        }
    }
}

const printCommitMessage = () => {
    const messages = [];
    if (changes.created.length > 0) {
        messages.push("Created: " + changes.created.join(', '));
    }
    if (changes.modified.length > 0) {
        messages.push("Modified: " + changes.modified.join(', '));
    }
    if (changes.other) {
        messages.push("Other changes");
    }
    console.log(`Update repository from live dataset. ${messages.join("; ")}.`);
}



const rl = readline.createInterface({
  input: stdin,
  output: stdout,
  terminal: false
});
rl.on('line', parsePorcelainChangeString);
rl.once('close', printCommitMessage);
