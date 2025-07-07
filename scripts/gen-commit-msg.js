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
    if (!line || !line.trim()) return;

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
    const {created, modified, other} = changes;
    const messages = [];
    if (created.length > 0) {
        messages.push("Created: " + changes.created.join(', '));
    }
    if (modified.length > 0) {
        messages.push("Modified: " + changes.modified.join(', '));
    }
    if (other) {
        messages.push("Other changes");
    }
    
    const prefix = "Sync w/ live."
    let changesStr = messages.join("; ") + '.';

    // Git commit titles are usually capped at 72 characters. 
    //   So we if the messages are too large, we replace the string.
    //   Using a lower number to have a little error margin.
    if (prefix.length + changesStr.length > 68) { 
        if (created.length > 0 && modified.length > 0) {
            changesStr = 'Several namespaces created and modified.'
        } else if (created.length > 0) {
            changesStr = 'Several namespaces created.'
        } else if (modified.length > 0) {
            changesStr = 'Several namespaces modified.'
        }
    }

    // Space is important here for readability
    console.log(`${prefix} ${changesStr}`)
}



const rl = readline.createInterface({
  input: stdin,
  output: stdout,
  terminal: false
});
rl.on('line', parsePorcelainChangeString);
rl.once('close', printCommitMessage);
