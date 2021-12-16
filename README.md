# Habit Sleigher - LAP 2 Project
Contributors:
- [Jakirul Islam](https://github.com/Jakirul)
- [Menelaos Kaskiris](https://github.com/mkaskiris)
- [Rajesh Sharma](https://github.com/Rajx1)
- [Souheil Fenghour](https://github.com/sf308)

## Project Description
This project was to create a website where a user could make an account and track their habits. They could also set how many times they want to track the habit for per day which can be incremented or decremented.

The website can be viewed in this link: [https://habit-sleigher.netlify.app/](https://habit-sleigher.netlify.app/)

## Installation and Usage
### Installation
- Clone/fork this repository
- To **run** the application, run `bash _scripts/startDB.sh` and navigate to `localhost:8080`
- For **testing**, swtich to test branch and run `bash _scripts/startTest.sh`

### Usage
- Run the application using the first command above
	- Navigate to `localhost:8080`
- Create an account and you can add habits

## Testing

### Client Testing

-   In the  `client`  folder, run  `npm run coverage`  or  `npm test`

### Server Testing

-  In the root directory, run `bash _scripts/startTest.sh`
![Backend Coverage](https://user-images.githubusercontent.com/55515038/146405353-d8f794f6-ecf3-45af-b52b-fcecfe9a8d52.png)


## Technologies
### Front end
- HTML / CSS
- JavaScript
- Jest Testing
- Bundles

### Backend / Hosting
- JavaScript
- Node.js / Express.js
- PostgreSQL
- Docker
- Heroku / Netlify

## Process
- Started by meeting on **Friday** and planning the design using Figma (design image below) and deciding who will work on which part of the code
- Worked in the weekend to plan the project
- Built the backend in the start of the week
	- Created a model file for the Habit and User and also tests to make sure files work as expected
	- Created controllers and made the code more modular
- Built the front end of the code
	- We referred to the Figma code and started coding using plain HTML/CSS
	- Added in JavaScript code after to fetch data from the backend
	- Wrote tests for the front end
- Deployment:
	- Deployed the backend first using **Heroku** then deployed the front end using **Netlify**

## Wins and challenges
### Wins
- Built a streaks system after a lot of hard work
- Allowed the user to create habits and assign it to their account
- Added a proper date system so it tracks the past activities
- Added a working login/registration system

### Challenges
- Streaks were tough to code and did not work when we first created it.
- Some of us had issues where docker would refuse to run the code (although was solved once the server was hosted)

## Figma Design
![Figma Design](https://i.gyazo.com/c9141a561017ba5ccc2b8a2e08901a4f.png)

## Website Design

Login / Registration Page
![Login and Registration Page](https://i.gyazo.com/a221141a048a51a4416b9188a5db2427.png)

Habits Page
![Habits Page](https://i.gyazo.com/54a3c2bd071a73fe869394fe350a5675.png)

  
## Licence
[MIT license](https://opensource.org/licenses/mit-license.php)
