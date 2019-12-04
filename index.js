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

const PUPPETEER = require("puppeteer");
const readFile = UTILS.promisify(FS.readFile);


async function writeToFile(filepath, data) {
    try{
        const browser = await PUPPETEER.launch();
        const page = await browser.newPage();

        await page.setContent(data);
        await page.emulateMediaType("print");
        await page.pdf({
            path: filepath,
            format:"A4",
            printBackground: true,
        });
        console.log("PDF created.");
        await browser.close();
        process.exit();
    }catch(err){
        console.log(err);
    }
}

async function init() {
    try {
        const { backgroundColor: favColor, githubUsername } = await INQUIRER.prompt(questions);
        const userGithubUrl = GITHUB_URL + githubUsername;
        const getGithubData = AXIOS.get(userGithubUrl);
        const getGitHubStars = AXIOS.get(`${userGithubUrl}/starred`);
        const getTemplate = readFile("./template.html", "utf-8");
        
        // //Temporary data
        // const template = await readFile("./template.html", "utf-8");
        // const avatarUrl = "https://avatars3.githubusercontent.com/u/43305867?v=4";
        // const githubUrl = "https://github.com/cynwong";
        // const name="Cyn";
        // const company = "Self-employed";
        // const blogUrl = "http://cyn.blog.com";
        // const location= "Melbourne, Australia";
        // const bio = "I build things and teach people to code";
        // const repos = 12;
        // const followers = 0;
        // const following = 0;
        // const starredRepos = [1,2];

        const [
            {
                data: {
                    avatar_url: avatarUrl,
                    html_url: githubUrl,
                    name,
                    company,
                    blog: blogUrl,
                    location,
                    bio,
                    public_repos: repos,
                    followers,
                    following
                }
            },
            {
                data: starredRepos
            },
            template
        ] = await Promise.all([getGithubData, getGitHubStars, getTemplate]);
        let locationUrl = "";
        if (location) { locationUrl = GOOGLE_URL + location.replace(/ /g,""); }
        const {
            wrapperBackground,
            headerBackground,
            headerColor,
            photoBorderColor
        } = colors[favColor];
        const fileName = `./${name.toLowerCase().replace(" ", "_")}_profile.pdf`;

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
        writeToFile(fileName, result);
    } catch (err) {
        console.log(err);
    }
}
init();

