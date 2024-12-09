import express from 'express';
const app = express()
import chatRoutes from './routes/chat.routes';
import healthRoutes from './routes/health.routes';
import streamRoutes from './routes/stream.routes';
import ragRoutes from './routes/rag.routes';
app.use(express.json()); 
// Static folder
app.use('/outputs', express.static('./outputs'));
app.use("/api", [healthRoutes, chatRoutes, streamRoutes, ragRoutes]);
app.listen(8080, () => {
console.log('Server started on port 8080');
});