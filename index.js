
const {
    questions,
    INQUIRER,
} = require( './config.js');

const {
    retrieveData,
    renderData,
    writeToFile
} = require("./process.js");

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
        if(!output && typeof output !== "undefined"){
            //if no data, exit the process
            return;
        }
        writeToFile(customFilePath,data.name,output);


    }catch(err){
        console.log("Error: ", err.message);
    }
}
init();


