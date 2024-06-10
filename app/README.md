The actual source files of a software project are usually stored inside the src folder. Alternatively, you can put them into the lib (if you're developing a library), or into the app folder (if your application's source files are not supposed to be compiled).

# To start the image and see the UI:
- Open the repository in your code editor
- Open the terminal
- Navigate to the 'app' folder ( 'cd app' command )
- Enter the command 'docker compose up'
- Navigate to localhost:3000 on your web browser

# To add your Clerk API key for development:
- Navigate to the 'app' folder
- Navigate to the 'frontend' folder
- Create a new file called '.env'
- Inside the file, paste REACT_APP_API_KEY='YOUR_KEY_HERE'
- Replace the text 'YOUR_KEY_HERE' with your Clerk API key