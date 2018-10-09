Offline Draft Tool for Fantasy Football. Data was imported via Fantasy Pros free ranked .csv.
No logins, teams are created as a first come first serve bases. All data is publicly accessible.

#Developers

1. After cloning and NPM install, create a mongoDB local store. 
2. Start your mongod service
3. fantasy_tool will be the dbs name
4. Node server runs on port 3001 locally, you can change this in server.js
5. React runs on port 3000 using create react app's development server.

To run locally:
1. Start Node server locally - cd to root dir /
   node server.js (or run in debugg mode with vscode or alternate).
   *Note: Mongo MUST be running
   
2. Start react app - cd /app npm start
   will run on localhost:3000 and point to node api on port 3001

Cutting a production build:

1. cd /app - npm run build
2. react will give you option to server locally on port 5000 - must npm install -g serve
3. This will point to productions API server.
