// Imports
import fs from 'fs/promises';
import parser from './parser';
import render from './render';
(async () => {
  // TODO: Handle Command Line Argument And Reading File
  const filePath = process.argv[2];
  if (!filePath) {
    console.log('Please Provide A File');
    process.exit(0);
  }
  const fileData = await fs.readFile(filePath, 'utf8');
  // TODO: Parse
  const parsedData = parser(fileData);
  // TODO: Render
  // console.log(parsedData);
  console.log(render(parsedData));
})()