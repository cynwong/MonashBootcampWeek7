
const {
    questions,
    colors,
    INQUIRER,
    AXIOS,
    FS,
    EJS,
    EXEC,
    PUPPETEER,
    PATH_SEPARATOR,
    OPEN_FILE_COMMAND,
    DEFAULT_FILE_PATH, 
    getGoogleUrl,
    getGitHubURL,
    getGitHubStarsURL,
} = require( './config.js');

/**
 * Save data in given file location.
 * @param {string} filepath destination file path
 * @param {object} data html data to be written to the file
 * @param {boolean} isUsingDefaultPath True if program is using default path, False if using user's defined path
 */
const writeToFile = async function (customFilePath,name, data) {
    const [filePath,isUsingDefaultPath] = await getFilePath(customFilePath,name);
    try{
        
        const browser = await PUPPETEER.launch();
        const page = await browser.newPage();
        
        await page.setContent(data);
        await page.emulateMediaType("print");
        console.log(`Saving to ${filePath}.....`);
        await page.pdf({
            path: filePath,
            format:"A4",
            printBackground: true,
        });
        console.log("PDF created.");
        EXEC(`${OPEN_FILE_COMMAND} ${filePath}`);
        await browser.close();
    }catch(err){
        console.log("Error in saving pdf", err.message);
        if(!isUsingDefaultPath){
            console.log("Trying to save file in default folder.")
            const newFilePath = DEFAULT_FILE_PATH + filePath.split(PATH_SEPARATOR).slice(-1).pop();
            // await writeToFile(newFilePath,data);
        }
    }
    process.exit();
}

/**
 * Retrieve user data and template 
 * @param {string} favColor 
 * @param {string} githubUsername 
 * @param {string} customFilePath 
 */
async function retrieveData(favColor,githubUsername){
    try{
        const getGithubData = AXIOS.get(getGitHubURL(githubUsername));
        const getGitHubStars = AXIOS.get(getGitHubStarsURL(githubUsername));
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
        if(!name){
            console.log("\nAlert: Something went wrong with retrieving profile from GitHub. Check github username and try again later.");
            return [];
        }
        let locationUrl = "";
        if (location) { 
            locationUrl = getGoogleUrl(location);
        }
        const {
            wrapperBackground,
            headerBackground,
            headerColor,
            photoBorderColor
        } = colors[favColor];
        
        return  [
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
                }
            ];
    } catch (err) {
        console.log("Error in data retrieval: ", err.message);
        return [];
    }
}

function getFilePath(customFilePath,name){
    let filePath = "";
    let isUsingDefaultPath = false;
    if(customFilePath && customFilePath.endsWith(".pdf")){
        //this already have  file name and so no changes needed
    
        filePath = customFilePath;
    }else{
        if(customFilePath && !customFilePath.endsWith(PATH_SEPARATOR)){
            //if filepath does not end with a separator, add one. 
            filePath = customFilePath.concat(PATH_SEPARATOR);
        }
        if(!customFilePath){
            //if no custom file path, use default
            filePath = DEFAULT_FILE_PATH;
            isUsingDefaultPath = true;
        }
        //add file default file name
        filePath += `${name.toLowerCase().replace(" ", "_")}_profile.pdf`;
    }
    console.log([filePath, isUsingDefaultPath])
    return [filePath, isUsingDefaultPath];
}

async function renderData(template, data){
    try{
        return await EJS.render(
            template,
            data,
            {
                async: true
            }
        );
    } catch (err) {
        console.log("Error in conversion", err.message);
    }
    return null;
}

/**
 * Init function where the program will ask user for the information and get 
 */
async function init() {
    try {
        const answers = await INQUIRER.prompt(questions);
        const favColor = answers.backgroundColor;
        const githubUsername = answers.githubUsername.trim();
        const customFilePath = answers.customFilePath.trim();

        if(!githubUsername){
            return console.log("\nAlert: Github username is required.");
        }
        if(customFilePath && customFilePath.search(/\.[a-z]{2,5}$/g) !== -1 && !customFilePath.endsWith(".pdf")){
            return console.log("\nAlert: Destination file must be a pdf file.")
        }

        const [template,data] = await retrieveData(favColor,githubUsername);
        if(!template || (data.constructor === Object && Object.entries(data).length === 0)){
            //if no data, exit the process
            return;
        }
        const output = await renderData(template,data);
        if(!output){
            //if no data, exit the process
            return;
        }
        writeToFile(customFilePath,data.name,output);


    }catch(err){
        console.log("Error: ", err.message);
    }
}
init();


