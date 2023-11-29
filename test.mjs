import {promises as fs} from "fs";

// Regular Content of the file
let fileContent = "Hello World!";

// The absolute path of the new file with its name
let filepathUTF8 = "./utf8_file.txt";
let filepathUTF8WithBOM = "./utf8bom_file.txt";

console.log(typeof(fileContent));

// 1. Write a file with UTF-8
fs.writeFile(filepathUTF8, fileContent, (err) => {
    if (err) throw err;

    console.log("The file was succesfully saved with UTF-8!");
}); 

// 2. Write a file with UTF-8 with BOM
// Note that you prepend \ufeff to the content that will be written
fs.writeFile(filepathUTF8WithBOM, "\ufeff" + fileContent, (err) => {
    if (err) throw err;

    console.log("The file was succesfully saved with UTF-8 with BOM!");
}); 