#### Run the project
Rename ```.env.example```to ```.env```
Run ```npm run start``` this commmand is defined to run ```tsc && node --env-file=.env dist/app.js```
<p style="font-size: 8px"> If you want to use other environtment variables is up to you hehe </p>

#### Run the project dev mode
Nodemon is installed to make development easier, just run ```npm run dev``` and it will run ```dotenv -e .env nodemon src/app.ts```

g