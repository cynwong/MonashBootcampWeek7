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
const FS = require("fs");
const UTILS = require("util");
const EJS = require("ejs");

const readFile = UTILS.promisify(FS.readFile);
const writeFile = UTILS.promisify(FS.writeFile);


async function writeToFile(fileName, data) {
    try {
        await writeFile(fileName, data, "utf-8");
    } catch (error) {
        console.log(error);
    }
}

async function init() {
    try {
        const { backgroundColor:favColor, githubUsername } = await INQUIRER.prompt(questions);
        const userGithubUrl = GITHUB_URL + githubUsername;
        const getGithubData = AXIOS.get(userGithubUrl);
        const getGitHubStars = AXIOS.get(`${userGithubUrl}/starred`);
        const getTemplate = readFile("./template.html", "utf-8");
        const [
            {
                data: {
                    avatar_url:avatarUrl,
                    html_url: githubUrl,
                    name,
                    company,
                    blog: blogUrl,
                    location,
                    bio,
                    public_repos:repos,
                    followers,
                    following
                }
            },
            {
                data: starredRepos
            },
            template
        ] = await Promise.all([getGithubData, getGitHubStars,getTemplate]);
    let locationUrl = "";
    if(location) {locationUrl = GOOGLE_URL+location;}
    const {
        wrapperBackground,
        headerBackground,
        headerColor,
        photoBorderColor
    } = colors[favColor];


        const result = await EJS.render(
            template, 
            {
                name,
                wrapperBackground,
                headerBackground,
                headerColor,
                photoBorderColor,
                avatarUrl,
                company,
                locationUrl,
                githubUrl,
                blogUrl,
                bio,
                repos,
                followers,
                stars: starredRepos.length,
                following
            }, 
            {
                async: true
            }
        );
        writeToFile("index.html", result);
    } catch (err) {
        console.log(err);
    }
}
init();
