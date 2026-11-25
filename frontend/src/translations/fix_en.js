const fs = require('fs');
const path = 'c:\\Users\\T14\\Desktop\\my_advc\\My-Tawjihe-fixed\\My-Tawjihe\\frontend\\src\\translations\\en.ts';

let content = fs.readFileSync(path, 'utf8');

// Replace the corrupted block (from line 707 onward with duplicated exercices sections)
// The pattern: after the correct `hidePassword` closing, there's extra duplicated content
const regex = /(hidePassword: 'Hide password',\s*\},)([\s\S]*?)(\s+concours: \{)/;

content = content.replace(regex, (match, group1, corruptedBlock, group3) => {
  // Keep only the first correct exercices section, remove duplicates
  // Find the correct exercices section that comes after line 706
  return group1 + '\n      exercices: {\n        answerNote: "Your answer — the AI will auto-correct",\n        aiScoreLabel: "Score assigned by the AI",\n        retryExercise: \'Retry this exercise\',\n        allSubjects: \'All subjects\',\n        allDifficulties: \'All difficulties\',\n        levels: [\'Tronc commun\',\'1ère Bac\',\'Terminale (2ème Bac)\'],\n        resetFilter: \'✕ Reset\',\n        correctionInProgress: \'🤖 AI correction in progress...\',\n        correctionOfficial: \'Official correction\',\n        allLevels: \'All levels\',\n      }' + group3;
});

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed successfully!');
