const questions = [
    {
        name: "backgroundColor",
        type: "list",
        choices: ["green", "blue", "pink", "red"],
        message: "What is your favourite color?"
    },
    {
        name: "githubUsername",
        type: "input",
        message: "GitHub username"
    },
    {
        name: "filePath",
        type: "input",
        message: "Where do you want to save your file?(Press Enter to use current location):"
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


const GITHUB_URL = "https://api.github.com/users/";

//https://www.google.com/maps/search/?api=1&query=sydney%2caustralia
const GOOGLE_URL = "https://www.google.com/maps/search/?api=1&query=";

const INQUIRER = require("inquirer");
const AXIOS = require("axios");
const FS = require("fs-extra");
const EJS = require("ejs");
const PUPPETEER = require("puppeteer");

const DEFAULT_FILE_PATH = "./";

module.exports = {
    questions,
    colors,
    GITHUB_URL,
    GOOGLE_URL,
    INQUIRER,
    AXIOS,
    FS,
    EJS,
    PUPPETEER,
    DEFAULT_FILE_PATH
};