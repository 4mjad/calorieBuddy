Completed all of the following from the requirement list:

R1: Home page:
R1A: Display the name of the web application.
R1B:  Display links to other pages or a navigation bar that contains links to other pages.

File: index.html

R2: About page: 
R2A: Display information about the web application including your name as the developer. Display a link to the home page or a navigation bar that contains links to other pages.

File: about.html

R3: Register page:
R3A: Display a form to users to add a new user to the database. The form should consist of the following items: first name, last name, email address, username, and password.  Display a link to the home page or a navigation bar that contains links to other pages.
R3B:  Collect form data to be passed to the back-end (database) and store user data in the database. Each user data consists of the following fields: first name, last name, email address, username and password. To provide security of data in storage, a hashed password should only be saved in the database, not a plain password.
R3C: Display a message indicating that add operation has been done.

File: register.html & Lines 196-234 in main.js

R4: Login page:
R4A: Display a form to users to log in to the dynamic web application. The form should consist of the following items: username and password.  Display a link to the home page or a navigation bar that contains links to other pages.
R4B: Collect form data to be checked against data stored for each registered user in the database. Users are logged in if and only if both username and password are correct. 
R4C: Display a message indicating whether login is successful or not and why not successful.
R5: Logout
There is a way to logout, a message is displayed upon successful logout.

File: login.html & Lines 236-270 in main.js

R6: Add food page (only available to logged-in users):
R6A: Display a form to users to add a new food item to the database. The form should consist of the following items: name, typical values, unit of the typical value, calories, carbs, fat, protein, salt, and sugar.  Display a link to the home page or a navigation bar that contains links to other pages.
R6B:  Collect form data to be passed to the back-end (database) and store food items in the database. Each food item consists of the following fields: name, typical values, unit of the typical value, calories, carbs, fat, protein, salt, and sugar. Here is an example of a food item:
name: flour, typical values per:100, unit of the typical value: gram, calories:  381 kilocalories, carbs: 81 g, Fat: 1.4 g, Protein: 9.1 g, salt: 0.01 g, and sugar: 0.6 g. The unit of the typical value may have values such as gram, liter, tablespoon, cup, etc. Going beyond by saving the username of the user who has added this food item to the database.
R6C: Display a message indicating that add operation has been done.

File: addfood.html & Lines 153-194 in main.js

R7: Search food page 
R7A: Display a form to users to search for a food item in the database. 'The form should contain just one field - to input the name of the food item'. Display a link to the home page or a navigation bar that contains links to other pages.
R7B:  Collect form data to be passed to the back-end (database) and search the database based on the food name collected from the form. If food found, display a template file (ejs, pug, etc) including data related to the food found in the database to users; name, typical values, unit of the typical value, calories, carbs, fat, protein, salt, and sugar. Display a message to the user, if not found.
R7C: Going beyond, search food items containing part of the food name as well as the whole food name. As an example, when searching for ‘bread’ display data related to ‘pitta bread’, ‘white bread’, ‘wholemeal bread’, and so on.

File: search.html, searchList.ejs & Lines 25-40 in main.js

R8: Update food page (only available to logged-in users)
R8A: Display search food form. Display a link to the home page or a navigation bar that contains links to other pages.
R8B: If food found, display data related to the food found in the database to users including name, typical values, unit of the typical value, calories, carbs, fat, protein, salt, and sugar in forms so users can update each field. Display a message to the user if not found. Collect form data to be passed to the back-end (database) and store updated food items in the database. Display a message indicating the update operation has been done. You can go beyond this requirement by letting ONLY the user who created the same food item update it.
R8C: Implement a delete button to delete the whole record, when the delete button is pressed, it is good practice to ask 'Are you sure?' and then delete the food item from the database, and display a message indicating the delete has been done. You can go beyond this requirement by letting ONLY the user who created the same food item delete it.

File: updatefood.html, updatingfood.ejs & Lines 42-111 in main.js

R9: List food page (available to all users)
R9A: Display all foods stored in the database including name, typical values, unit of the typical value, calories, carbs, fat, protein, salt, and sugar, sorted by name. Display a link to the home page or a navigation bar that contains links to other pages.
R8B: You can gain more marks for your list page is organised in a tabular format instead of a simple list.
R9C: Not completed

File: list.ejs & Lines 138-151 in main.js

R10: API
There is a basic API displayed on '/api' route listing all foods stored in the database in JSON format. i.e. food content can also be accessed as JSON via HTTP method, It should be clear how to access the API (this could include comments in code). Additional credit will be given for an API that implements get, post, push and delete.

Completed get and delete routes
Lines 281-331 in main.js

R11: form validation
All form data should have validations, examples include checking password length, email validation, integer data is integer and etc. 

R12: Your dynamic web application must be implemented in Node.js on your virtual server. The back-end of the web application could be MongoDB or MySQL. Make sure you have included comments in your code explaining all sections of the code including database interactions.

I have used MongoDB and have collections called food and user. Food will contain all the details of the items while user will include things email, password and username.