
const {
    questions,
} = require( './config.js');

const inquirer = require("inquirer");

const {
    retrieveData,
    renderData,
    writeToFile
} = require("./process.js");

const {
    alerts: {
        usernameRequired: msgUsernameRequired,
        mustBePdf: msgMustBePdf
    },
    errorPrefixs:{
        init: errInit
    }
}= require("./languages/en_au");

/**
 * Init function where the program will ask user for the information and get 
 */
async function init() {
    try {
        const answers = await inquirer.prompt(questions);
        const theme = answers.theme;
        const githubUsername = answers.githubUsername.trim();
        const customFilePath = answers.customFilePath.trim();

        if(!githubUsername){
            return console.log(msgUsernameRequired);
        }
        if(customFilePath && customFilePath.search(/\.[a-z]{2,5}$/g) !== -1 && !customFilePath.endsWith(".pdf")){
            return console.log(msgMustBePdf);
        }

        const [template,data] = await retrieveData(theme,githubUsername);
        if(!template || (data.constructor === Object && Object.entries(data).length === 0)){
            //if no data, exit the process
            return;
        }
        const output = await renderData(template,data);
        if(!output && typeof output !== "undefined"){
            //if no data, exit the process
            return;
        }
        writeToFile(customFilePath,data.name,output);


    }catch(err){
        console.log(errInit, err.message);
    }
}
init();


