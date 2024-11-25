# FindMe🔎 - CS485 Cybersecurity & Usability Project

## Overview
FindMe is a web application designed as a part of NJIT's CS485 (Cybersecurity and Usability) course project. The purpose of the application is to bring awareness to the vast amount of personal data that is publicly accessible online. It allows users to see how much of their personal information—including phone numbers, addresses, email addresses, social media profiles, and more—is publicly available and can be easily found through online searches.

By inputting basic details (like their name and location), users can quickly view a summary of potentially exposed data that is searchable via various public sources. The goal of the application is to highlight the importance of privacy and data security in a digital age where personal information is frequently exposed without the user's awareness. By showing users how much of their personal information is available through online searches, it serves as a reminder of the need for careful management of personal data in an increasingly connected world.

## Purpose of the Project
The project’s primary objective is to:

**Increase Awareness**: Help individuals understand how much of their personal data is exposed online.

**Privacy Education**: Encourage users to be more cautious and deliberate about what they share online.

**Data Security**: Empower users to take actions to protect their personal information.

The application is also a demonstration of the interplay between cybersecurity and usability. While the goal is to provide valuable insights for users, the user experience is also a key focus. The application is designed with an easy-to-use interface that provides meaningful data without overwhelming the user.

## Features

### Frontend
**User-friendly Interface**: Built with Next.js, TypeScript, and Tailwind CSS for a sleek, responsive design.

**Search Functionality**: Users input their basic details (name, location), and the app fetches a list of potential matches from a variety of public sources.

**Data Visualization**: The app displays categorized personal data (e.g., emails, addresses, social media profiles) with a clear and organized layout.


### Backend

**Data Scraping**: The backend collects public data related to the user by querying various data sources.

**Security Measures**: The backend ensures that no sensitive or unauthorized data is exposed or misused during the process.

### How to Use
**Start the Application**: Visit the homepage and enter your first name, last name, and location.

**Run the Search**: Click on the "Run Search" button. The app will take a few seconds to gather publicly available data related to the input.

**Review the Results**: View the search results displayed in the application. You will see categories such as:
- Possible Addresses
- Possible Phone Numbers
- Possible Email Addresses
- Social Media Accounts
- Usernames, etc.


## Technical Details

### Frontend
Built with **Angular**, **TypeScript**, and styled using **Bootstrap**.

### Backend
Utilizes various APIs and web scraping techniques to gather public data from reliable sources.
Backend built using **Node.js**.

### Future Work
**Improve Data Accuracy**: Work on enhancing the precision of the data returned by the system.

**Enhance Security**: Strengthen security features to prevent unauthorized access.

**Extended Coverage**: Add more data sources to provide a broader overview of publicly available information.

## Privacy Notice
FindMe is a tool to highlight how much personal data is available online. The data used for the search is public and doesn’t involve accessing or retrieving any private data from users or any unauthorized sources.

