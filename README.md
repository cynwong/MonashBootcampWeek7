# Developer Profile Generator

## Description

Developer Profile Generator is a command line application which generate profile from user's GitHub user profile.

## Instructions

Profile generator is a command line application so terminal or command prompt program is needed to run this program.

1. Open the terminal.
2. In the terminal window, type the following command

    ```sh
    node index.js
    ```

3. Follow the prompts.
4. The application will generate a pdf file with the information provided during the prompts. 

## User Stories

```
    AS A product manager

    I WANT a developer profile generator

    SO THAT I can easily prepare reports for stakeholders
```

## Business Context

When preparing a report for stakeholders, it is important to have up-to-date information about members of the development team. Rather than navigating to each team member's GitHub profile, a command-line application will allow for quick and easy generation of profiles in PDF format.

## Requirements

Developer profile generator generate a PDF resume from provide user's Github profile. The PDF will be populated with the following:

* Profile image
* User name
* Links to the following:
  * User location via Google Maps
  * User GitHub profile
  * User blog
* User bio
* Number of public repositories
* Number of followers
* Number of GitHub stars
* Number of users following
* User's chosen color theme
