/*
Navn blir filtrert slik at titler og postfix skilles ut som separat egenskap

Alder sjekkes heltall mellom 0-150 og lagres som number

Telefonummer tar bort alt som ikke er nummer, og sparer de siste 8. Nummer som begyner på 0 eller 1 forkastes.

Gateadresse sjekkes om det er bokstaver, mellomrom og tall

engenskap [5] og [6] virker noe tilfeldig, men sjekks kun om det er tall og mellomrom.

*/

import {promises as fs} from "fs";

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
properties.push('title', 'suffix');
properties[5] = 'department';


for (let item of source){
    if (
        item.length < 7 ||
        !checkName(item[0]) ||
        !checkAge(item[1]) ||
        !checkPhoneNumber(item[2]) ||
        !checkStreetAddress(item[3]) ||
        !checkCode(item[4]) ||
        !checkCity(item[5]) ||
        !checkPet(item[6]) ||
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

console.log("\n" + errLines.length + " data-linjer med feil.");
console.log("\n" + temp.length + " data-linjer behandlet.\n");

let errors = errLines.join("\n");

let filesToWrite = 2;
let filesWritten = 0;

fs.writeFile("err.csv", errors, writeFileCallback);
fs.writeFile("books.json", books, writeFileCallback);

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

    item[2] = (item[2].replace(/\D/g,''));
    item[2] = item[2].substring(item[2].length-8);
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
    let tempString = string.replace(/\D/g,'');
    const temp = ( 
        checkCharacters(string, /^[\d\s\+\-]+$/) && // numbers and space and "+" and "-"
        tempString[tempString.length-8] != "0" &&
        tempString[tempString.length-8] != "1"
        );
    return temp;
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