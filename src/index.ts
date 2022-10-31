
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

import express, { NextFunction, Request, Response, Express } from 'express';
import cors from 'cors';
import StatusCodes from 'http-status-codes';
import 'express-async-errors';

import path from 'path'
import glob from 'glob'

import fs from 'fs';
import http from 'http';
import https from 'https';

import helmet from 'helmet'
import logger from './loaders/logger'
import Config from './config'
import { error } from './utils/apiResponse'

logger.silly("=== app instance start ===")

const { BAD_REQUEST } = StatusCodes;

const app = express()
app.use('*', cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1)
    app.use(helmet());
}

function attemptToEnableHTTPS(expressApp: Express) {
    try {
      const certPath = Config.https.tls.path + Config.https.tls.certificate;
      const keyPath =  Config.https.tls.path + Config.https.tls.key;
      const HTTPS_PORT = Config.https.port;
  
      https.createServer(
        {
          cert: fs.readFileSync(certPath, 'utf8'),
          key: fs.readFileSync(keyPath, 'utf8'),
        },
        expressApp,
      ).listen(HTTPS_PORT, () => {
        logger.info(`App is now running on https://localhost:${HTTPS_PORT}`);
      });
    } catch (error) {
        logger.error(error)
      logger.warn('Failed to enable HTTPS. Skipping...');
    }
  }

// Load apis dynamically
glob(path.join(__dirname, 'api/**/*' + path.extname(__filename)), (err, files) => {
    if (err) {
        return Promise.reject(err)
    }
    logger.info('Mounting API routes..')

    files.map(file => {
        const relativepath = path.relative(path.join(__dirname, 'api'), file).slice(0, -3)

        logger.info('Mounting ' + relativepath + ' API..')
        app.use('/api/' + relativepath, require(file),
            (err: Error, req: Request, res: Response, next: NextFunction) => {
                res.status(BAD_REQUEST)
                if (err instanceof Error) {
                    res.json(error(err.message, BAD_REQUEST))
                } else {
                    res.json(error(err, BAD_REQUEST))
                }

                res.end()
            })
    })

    logger.info('Completed mounting API routes.')
})

app.get('/ping', function (req, res, next) {
    res.send('pong')
})

// error middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err);
    res.status(400)
    return res.status(BAD_REQUEST).json({
        error: err,
    });
});

// const server = app.listen(Config.port || 5000, async () => {
//     logger.info(`App listening at http://localhost:${Config.port || 5000}`)
// })

attemptToEnableHTTPS(app);
const server = http.createServer(app).listen(Config.port || 5000, () => {
    logger.info(`App is now running on http://localhost:${Config.port || 5000}`);
  });

process.on('SIGINT', () => {
    logger.info('SIGINT received.')
    logger.info('Shutting down server instance.')

    server.close(async (err: any) => {
        if (err) {
            return logger.error(err)
        }

        logger.info('Shutting down database connection.')

        try {
            logger.info('All connections terminated.')
            process.exit(0)
        } catch (e) {
            logger.error(err)
            process.exit(1)
        }
    })
})

export default server