const messages = {
    alerts: {
        mustBePdf:"\nAlert: Destination file must be a pdf file.",
        noGithubData :"\nAlert: Something went wrong with retrieving profile from GitHub. Check github username and try again later.",
        usernameRequired: "\nAlert: Github username is required.",
        userNotFound: "Username is not found on GitHub."
    },
    errorPrefixs:{
        conversion: "\nError in conversion: ",
        init:"\nError: ",
        retrieval: "\nError in data retrieval: ",
        savePdf : "\nError in saving pdf: "
    },
    questions:{
        customFilePath: "Where do you want to save your file?(Press Enter to use current location):",
        theme: "What is your favourite color?",
        username: "What is your GitHub username?"
    },
    info: {
        dataRetrieving:"Retrieving data from the server...",
        fileCreated: "PDF created.",
        parsingData: "Parsing data from the server...",
        saving:`Saving data in`,
        usingDefault: "Trying to save file in default folder."
    },
};

module.exports = messages;