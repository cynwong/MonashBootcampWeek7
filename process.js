const {
    colors,
    PATH_SEPARATOR,
    OPEN_FILE_COMMAND,
    DEFAULT_FILE_PATH, 
    DEFAULT_FILE_SUFFIX,
    TEMPLATE_FILE,
    getGoogleUrl,
    getGitHubURL,
    getGitHubStarsURL,
} = require( './config.js');


const axios = require("axios");
const fs = require("fs-extra");
const ejs = require("ejs");
const puppeteer = require("puppeteer");
const exec = require("child_process").exec;

const {
    alerts:{
        noGithubData: alertNoGithubData,
        userNotFound: alertUserNotFound
    },
    errorPrefixs: {
        savePdf: prefixSavePDF,
        retrieval: prefixRetrival,
        conversion: prefixConversion
    },
    info: {
        saving: infoSaving,
        fileCreated: infoFileCreated,
        usingDefault: infoUsingDefault,
        dataRetrieving: infoDataRetrieving,
        parsingData: infoParsingData
        
    }
}= require("./languages/en_au");

/**
 * Save data in given file location.
 * @param {string} filepath destination file path
 * @param {object} data html data to be written to the file
 * @param {boolean} isUsingDefaultPath True if program is using default path, False if using user's defined path
 */
const writeToFile = async function (customFilePath,name, data) {
    const {filePath,isUsingDefaultPath} = _getFilePath(customFilePath,name);
    try{
        
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        await page.setContent(data);
        await page.emulateMediaType("print");
        console.log(`${infoSaving} ${filePath}.....`);
        //save data to pdf file
        await page.pdf({
            path: filePath,
            format:"A4",
            printBackground: true,
        });
        console.log(infoFileCreated);
        exec(`${OPEN_FILE_COMMAND} ${filePath}`);
        await browser.close();
    }catch(err){
        console.log(prefixSavePDF, err.message);
        if(!isUsingDefaultPath){
            console.log(infoUsingDefault);
            const newFilePath = DEFAULT_FILE_PATH + filePath.split(PATH_SEPARATOR).slice(-1).pop();
            await writeToFile(newFilePath,name, data);
        }
    }
    process.exit();
};

/**
 * Retrieve user data and template 
 * @param {string} theme 
 * @param {string} githubUsername 
 * @param {string} customFilePath 
 * @return {string} template
 * @return {object} data for html rendition
 */
const retrieveData = async function(theme,githubUsername){
    try{
        //write out the message to update the process status to the user
        console.log(infoDataRetrieving);

        // ajax call to get github profile data from the server
        const getGithubData = axios.get(getGitHubURL(githubUsername));
        //another ajax call to get github starred repo
        const getGitHubStars = axios.get(getGitHubStarsURL(githubUsername));
        //read the template file. 
        const getTemplate = fs.readFile(TEMPLATE_FILE, "utf-8");
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
        //Check if we get data back from github
        if(!name){
            console.log(alertNoGithubData);
            return [];
        }
        //construct the location url for the pdf
        let locationUrl = "";
        if (location) { 
            locationUrl = getGoogleUrl(location);
        }
        //get the color scheme
        const {
            wrapperBackground,
            headerBackground,
            headerColor,
            photoBorderColor
        } = colors[theme];
        //calculate stargazers count for github stars
        const stars = starredRepos.reduce((acc,{stargazers_count})=> acc+stargazers_count,0);
        //return the template and data
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
                    stars,
                    following
                }
            ];
    } catch (err) {
        if(err.response.status && err.response.status === 404){
            //error 404: user not found
            console.log(prefixRetrival, alertUserNotFound)
        }else{
            console.log(prefixRetrival, err.message);
        }
        return [];
    }
};

/**
 * Build the destination filepath. 
 * @param {string} customFilePath - user's defined file path to replace the default path.
 * @param {string} name - user's full name to build default filename
 * @return {string} destination file path
 */
const _getFilePath = function (customFilePath,name){
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
        filePath += `${name.toLowerCase().replace(" ", "_")}_${DEFAULT_FILE_SUFFIX}`;
    }
    return {filePath, isUsingDefaultPath};
}

/**
 * Build the html from the template with the data provided. 
 * @param {*} template 
 * @param {*} data 
 * @return {string} rendered html with the data provided
 */
const renderData = async function (template, data){
    try{
        //update user about rendition state of the process
        console.log(infoParsingData);
        //let ejs(template engine) to render the template with the data provided
        return await ejs.render(
            template,
            data,
            {
                async: true
            }
        );
    } catch (err) {
        console.log(prefixConversion, err.message);
    }
    return null;
};

module.exports = {
    retrieveData,
    renderData,
    writeToFile
};