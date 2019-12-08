const {
        theme,
        username,
        customFilePath
} = require("./languages/en_au").questions;

const os = require("os");

const questions = [
    {
        name: "theme",
        type: "list",
        choices: ["green", "blue", "pink", "red"],
        message: theme
    },
    {
        name: "githubUsername",
        type: "input",
        message: username
    },
    {
        name: "customFilePath",
        type: "input",
        message: customFilePath
    }
];


let PATH_SEPARATOR = "/";
let OPEN_FILE_COMMAND = "open";
if(os.platform().localeCompare("win32") === 0){
    //window file path user "\"
    PATH_SEPARATOR = "\\";
    OPEN_FILE_COMMAND = 'start ""'
}

const DEFAULT_FILE_PATH = `.${PATH_SEPARATOR}`;
const DEFAULT_FILE_SUFFIX = "profile.pdf";

const TEMPLATE_FILE = "./template.html";

module.exports = {
    questions,
    PATH_SEPARATOR,
    OPEN_FILE_COMMAND,
    DEFAULT_FILE_PATH, 
    DEFAULT_FILE_SUFFIX,
    TEMPLATE_FILE,
};