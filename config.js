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

const colors = {
    green: {
        wrapperBackground: "#E6E1C3",
        headerBackground: "#C1C72C",
        headerColor: "black",
        photoBorderColor: "black"
    },
    blue: {
        wrapperBackground: "#5F64D3",
        headerBackground: "#26175A",
        headerColor: "white",
        photoBorderColor: "#73448C"
    },
    pink: {
        wrapperBackground: "#879CDF",
        headerBackground: "#FF8374",
        headerColor: "white",
        photoBorderColor: "#FEE24C"
    },
    red: {
        wrapperBackground: "#DE9967",
        headerBackground: "#870603",
        headerColor: "white",
        photoBorderColor: "white"
    }
};


const _githubUrl = "https://api.github.com/users/";

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

/**
 * Return google url with the location
 * @param {string} location 
 * @return string URI
 * e.g. https://www.google.com/maps/search/?api=1&query=sydney%2caustralia
 */
const getGoogleUrl = function(location){
    return encodeURI(`https://www.google.com/maps/search/?api=1&query=${location.replace(" ","")}`);
};

/**
 * return user's github api url
 * @param {string} location 
 * @return string URI
 */
const getGitHubURL = function(user){
    return encodeURI(`${_githubUrl}${user}`);
};

/**
 * return user's github api url
 * @param {string} location 
 * @return string URI
 */
const getGitHubStarsURL = function(user){
    return encodeURI(`${getGitHubURL(user)}/starred`);
};

module.exports = {
    questions,
    colors,
    PATH_SEPARATOR,
    OPEN_FILE_COMMAND,
    DEFAULT_FILE_PATH, 
    DEFAULT_FILE_SUFFIX,
    TEMPLATE_FILE,
    getGoogleUrl,
    getGitHubURL,
    getGitHubStarsURL
};