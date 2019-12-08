const _githubUrl = "https://api.github.com/users/";

/**
 * Return google url with the location
 * @param {string} location 
 * @return string URI
 * e.g. https://www.google.com/maps/search/?api=1&query=sydney%2caustralia
 */
const getGoogleUrl = function(location){
    return encodeURI(`https://www.google.com/maps/search/?api=1&query=${location.replace(" ","")}`);
};

/**
 * return user's github api url
 * @param {string} location 
 * @return string URI
 */
const getGitHubURL = function(user){
    return encodeURI(`${_githubUrl}${user}`);
};

/**
 * return user's github api url
 * @param {string} location 
 * @return string URI
 */
const getGitHubStarsURL = function(user){
    return encodeURI(`${getGitHubURL(user)}/starred`);
};

module.exports = {
    getGoogleUrl,
    getGitHubURL,
    getGitHubStarsURL
};