import dotenv from 'dotenv';
import { templateRouter } from './routes/contrib';
import appConfig from './config/appConfig';

dotenv.config();

const app = appConfig;
const port = process.env.port || 4100;

app.use('/', templateRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
