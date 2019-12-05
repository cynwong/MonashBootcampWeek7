const MESSAGES = {
    alerts: {
        mustBePdf:"\nAlert: Destination file must be a pdf file.",
        noGithubData :"\nAlert: Something went wrong with retrieving profile from GitHub. Check github username and try again later.",
        usernameRequired: "\nAlert: Github username is required."
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
        fileCreated: "PDF created.",
        saving:`Saving to`,
        usingDefault: "Trying to save file in default folder."
    },
};

module.exports = {
    ...MESSAGES
};