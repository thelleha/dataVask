import { error } from "console";
import {promises as fs} from "fs";
import { it } from "node:test";

let source = null;
let properties = null;
let output = [];
let errLines = [];
let temp = [];


try {
    source = await fs.readFile("data.csv", "utf-8");
    source = source.split("\n").map( item => item.split(","));

} catch (error) {
    console.log(error);
    process.exit(-1);
}

properties = source.shift().map(item => item.toLowerCase().trim());

for (let item of source){
    if (
        item.length < 7 ||
        !checkName(item[0]) ||
        !checkAge(item[1]) ||
        !checkPhoneNumber(item[2]) ||
        !checkStreetAddress(item[3]) ||
        !checkCode(item[4]) ||
        !checkCity(item[5]) ||
        // !checkPet(item[6]) ||
        false
      ){ 
        errLines.push(item.join(","));
    } else {
        temp.push(fixItem(item));
    }
}



for (const item of temp){ 
    const convertedItem = {};
    for (const i in properties){ 
        convertedItem[properties[i].toLowerCase().trim()] = item[i];
    }
    output.push(convertedItem);
}

const books = JSON.stringify(output, null, 4);


// console.log(errLines);
//console.log("Length error: " + errLines.length);
//console.log("Length data: " + source.length);
let errors = errLines.join("\n");
// console.log(errors);
// console.log(typeof(errors));

//console.log(temp);



let filesToWrite = 2;
let filesWritten = 0;

function writeFileCallback(err) {
  if (err) throw err;

  console.log("The file was successfully saved with UTF-8!");

  // Check if all files have been written
  filesWritten++;
  if (filesWritten === filesToWrite) {
    // If all files are written, exit the process
    process.exit(0);
  }
}

fs.writeFile("err.csv", errors, writeFileCallback);
fs.writeFile("books.json", books, writeFileCallback);

function fixItem(item){
    item[0] = item[0].replace('"', '');
    let posDot = item[0].indexOf(".");
    let posSpace = item[0].indexOf(" ");
    if (posDot == -1 ||
            (posDot > posSpace )
            ) {
        item.push("");
    } else {
        item.push(item[0].substring(0, posDot+1));
        item[0] = item[0].substring(posSpace+1);
    }
    posDot = item[0].lastIndexOf(".");
    posSpace = item[0].lastIndexOf(" ");
    if (posDot == -1){
        item.push("");
    } else {
        item.push(item[0].substring(posSpace+1));
        item[0] = item[0].substring(0, posSpace);
    }

    item[1] = Number(item[1]);

    return item;
}


function checkName(string) {
    return checkCharacters(string, /^[\p{L}\s."]+$/u); // UTF-8 letters and space and "."
}
function checkAge(string) {
    const temp = Number(string);
    let OK = (
        Number.isInteger(temp) &&
        temp < 150 &&
        temp >= 0
    )
    return OK;
}
function checkPhoneNumber(string){
    return checkCharacters(string, /^[\d\s\+\-]+$/); // numbers and space and "+" and "-"
}
function checkStreetAddress(string){
    return checkCharacters(string, /^[\p{L}\s\d]+$/u); // UTF-8 letters and space and numbers
}
function checkCode(string){
    const temp = Number(string);
    let OK = (
        Number.isInteger(temp) &&
        temp <= 9999 &&
        temp >= 0
    )
    return OK;
}
function checkCity(string){
    return checkCharacters(string, /^[\p{L}\s]+$/u); // UTF-8 letters and space
}
function checkPet(string){
    let temp = checkCharacters(string, /^[\p{L}\s]+$/u); // UTF-8 letters and space
    if (temp){
        console.log(string);
    }
    return temp;
}


function checkCharacters(characters, regEx){
    for (const character of characters){
        
        if(!(regEx.test(character))){
            return false;
        } 
    } 
    return true;
}


/* const itemCharacters = [];
for (const string of item){
    itemCharacters.push(string.split(''));
} */