
const {
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
} = require( './config.js');

async function writeToFile(filepath, data) {
    try{
        const browser = await PUPPETEER.launch();
        const page = await browser.newPage();
        
        await page.setContent(data);
        await page.emulateMediaType("print");
        console.log(`Saving to ${filepath}.....`);
        await page.pdf({
            path: filepath,
            format:"A4",
            printBackground: true,
        });
        console.log("PDF created.");
        await browser.close();
        process.exit();
    }catch(err){
        //console.log("Error in writing pdf", err.message);
        if(filepath.search(/^\.\//g)=== -1){
            //if not default path.
            //try again with new 
            // await browser.close();
            console.log(err.message);
            console.log("Trying to write file in current path.")
            const newFilePath = DEFAULT_FILE_PATH + filepath.split("/").slice(-1).pop();
            console.log(newFilePath);
            writeToFile(newFilePath,data);

        }
        process.exit();
    }
}

async function init() {
    try {
        const { backgroundColor: favColor, githubUsername, filePath } = await INQUIRER.prompt(questions);
        const userGithubUrl = GITHUB_URL + githubUsername;
        const getGithubData = AXIOS.get(userGithubUrl);
        const getGitHubStars = AXIOS.get(`${userGithubUrl}/starred`);
        const getTemplate = FS.readFile("./template.html", "utf-8");
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
        if (location) { 
            locationUrl = GOOGLE_URL + location.replace(/ /g,""); 
        }
        const {
            wrapperBackground,
            headerBackground,
            headerColor,
            photoBorderColor
        } = colors[favColor];
        let fileName = "";
        if(filePath){
            fileName = `${filePath.replace(/\/$/g,"")}/`;
        }else{
            fileName = DEFAULT_FILE_PATH;
        }
        fileName += `${name.toLowerCase().replace(" ", "_")}_profile.pdf`;

        const html = await EJS.render(
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
        writeToFile(fileName, html);
    } catch (err) {
        console.log("Error in conversion", err.message);
        process.exit();
    }
}
init();

