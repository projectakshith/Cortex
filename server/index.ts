import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import evaluateRoute from './routes/evaluate';
import healthRoute from './routes/health';
import historyRoute from './routes/history';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api', evaluateRoute);
app.use('/api/health', healthRoute);
app.use('/api/history', historyRoute);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`server on ${PORT}`);
});
