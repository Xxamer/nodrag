import express from 'express';
const app = express()
import chatRoutes from './routes/chat.routes';
import healthRoutes from './routes/health.routes';
app.use(express.json()); 
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use("/api", [healthRoutes, chatRoutes]);
app.listen(8080, () => {
console.log('Server started on port 3000');
});