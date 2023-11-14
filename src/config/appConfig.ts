import express from 'express';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';

const appConfig = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
});

appConfig.use(limiter);
appConfig.use(bodyParser.json());
appConfig.use(helmet());
appConfig.use(cors({
  origin: ['https://arcbrix.co.uk'],
  methods: ['GET'],
  allowedHeaders: ['Content-Type'],
}));

// Security Headers Middleware
appConfig.use((_req, res, next) => {
  // Set security headers
  res.header('Content-Security-Policy', 'default-src \'self\'');
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

export default appConfig;
