import express from 'express';
const app = express()
import chatRoutes from './routes/chat.routes';
import healthRoutes from './routes/health.routes';
import streamRoutes from './routes/stream.routes';
import ragRoutes from './routes/rag.routes';
app.use(express.json()); 
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use("/api", [healthRoutes, chatRoutes, streamRoutes, ragRoutes]);
app.listen(8080, () => {
console.log('Server started on port 3000');
});