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

const GITHUB = {
    userUrl: "https://api.github.com/users/",
};

//https://www.google.com/maps/search/?api=1&query=sydney%2caustralia
const GOOGLE_URL = "https://www.google.com/maps/search/?api=1&query=";
const INQUIRER = require("inquirer");
const AXIOS = require("axios");
const FS = require("fs");
const UTILS = require("util");

const readFile = UTILS.promisify(FS.readFile);
const writeFile = UTILS.promisify(FS.writeFile);
async function writeToFile(fileName, data) {
    try {
        await writeFile(fileName, data, "utf-8");
    } catch (error) {
        console.log(error);
    }
}

const TEMPLATE_VARIABLES = {
    headerBackground: "$[headerBackgroundColor]",
    headerColor: "$[headerColor]",
    wrapperBackground: "$[wrapperBackgroundColor]",
    photo: "$[avatarUrl]",
    name: "$[name]",
    company: "$[company]",
    location: "$[locationUrl]",
    github: "$[githubUrl]",
    blog: "$[blogUrl]",
    nRepos: "$[nRepos]",
    nFollowers: "$[nfollowers]",
    nStars: "$[nStars]",
    nFollowings: "$[nFollowings]",
    isHidden: "$[isHidden]",
};

async function init() {
    try {
        const { backgroundColor:favColor, githubUsername } = await INQUIRER.prompt(questions);
        const getGithubData = AXIOS.get(GITHUB.userUrl + githubUsername);
        const getGitHubStars = AXIOS.get(GITHUB.userUrl + githubUsername+"/starred");
        const getTemplate = readFile("./template.html", "utf-8");
        const [
            {
                data: {
                    avatar_url:avatarUrl,
                    html_url: url,
                    name,
                    company,
                    blog,
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
        const locationUrl = GOOGLE_URL+location;
        const {
            wrapperBackground,
            headerBackground,
            headerColor,
            photoBorderColor
        } = colors[favColor];
        let workplace, summary; 
        let result = template.replace(/\$\[\bname\]/g,name);
        result = result.replace(/\$\[wrapperBackgroundColor\]/g, wrapperBackground);
        result = result.replace(/\$\[headerBackgroundColor\]/g, headerBackground);
        result = result.replace(/\$\[headerColor\]/g, headerColor);
        result = result.replace(/\$\[photoBorderColor\]/g, photoBorderColor);
        result = result.replace(/\$\[avatarUrl\]/g, avatarUrl);
        if(company){
            workplace = `Currently @ ${company}`;
        }else{
            workplace = "";
        }
        result = result.replace(/\$\[company\]/g,workplace);
        result = result.replace(/\$\[locationUrl\]/g,locationUrl);
        result = result.replace(/\$\[githubUrl\]/g, url);
        result = result.replace(/\$\[blogUrl\]/g,blog);
        if(bio){
            summary = bio;
        }else{
            summary = "";
        }
        result = result.replace(/\$\[bio\]/g,summary);
        result = result.replace(/\$\[nRepos\]/g,repos);
        result = result.replace(/\$\[nfollowers\]/g,followers);
        result = result.replace(/\$\[nStars\]/g,starredRepos.length);
        result = result.replace(/\$\[nFollowings\]/g,following);


        writeToFile("index.html", result);
    } catch (err) {
        console.log(err);
    }
}
init();
