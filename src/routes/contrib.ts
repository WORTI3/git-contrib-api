import express, { Request, Response } from 'express';
import z from 'zod';
import { githubContributionData, gitlabContributionData } from './request';
import { ExpressMiddleware } from './routeTypes';

const router = express.Router();
const bodySchema = z.object({
  githubUsername: z.string().min(1).max(39),
  gitlabUsername: z.string().min(2).max(255),
});

const validateBody: ExpressMiddleware = (req, res, next) => {
  try {
    req.parsedData = bodySchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: 'invalid request' });
  }
};

interface contributions {
  date?: string,
  count: number
}

router.post('/contrib', validateBody, async (req: Request, res: Response) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_ACCESS_KEY || !apiKey) {
    return res.status(403).json({ error: 'unauthorised' });
  }
  const requestData = req.body;
  const githubUsername = requestData?.githubUsername;
  const gitlabUsername = requestData?.gitlabUsername;

  const contributions: contributions[] = [];

  try {
    const data = await githubContributionData(githubUsername);
    data.forEach((element) => {
      element.contributionDays.forEach((day) => {
        contributions.push({
          date: day.date,
          count: day.contributionCount,
        });
      });
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(400).json({ error: 'Bad Request', message: 'A valid Github username must be defined'});
  }
  // latest first
  contributions.reverse();

  let gitlabData: contributions[] = [];
  let githubContribs = 0;
  let gitlabContribs = 0;

  await gitlabContributionData(gitlabUsername).then((data) => {
    gitlabData = Object.entries(data).map(([key, value]) => ({
      date: key,
      count: value,
    }));
  }).catch((error) => {
    console.error('Error:', error);
  });

  contributions.forEach((element, index) => {
    const itemIndex = gitlabData.findIndex(
      (item) => item.date === element.date
    );

    githubContribs += contributions[index].count;    

    if (itemIndex !== -1) {
      gitlabContribs += gitlabData[itemIndex].count;
      contributions[index].count = contributions[index].count + gitlabData[itemIndex].count;
    }
  });

  const totalContributionCount = contributions.reduce(
    (accumulator, contribution) => {
      return accumulator + (contribution.count ?? 0);
    },
    0
  );

  res
    .json({
      data: {
        github: githubContribs,
        gitlab: gitlabContribs,
        totalContributionCount,
        contributions,
      },
    })
    .status(200);
});

export { router as templateRouter };
