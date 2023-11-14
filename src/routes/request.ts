import axios from 'axios';

export interface ContributionCalendarWeek {
  contributionDays: Array<{
    color: string;
    contributionCount: number;
    date: string;
    weekday: string;
  }>;
  firstDay: string;
  totalContributions: number;
}

export interface GitHubAPIResponse {
  data: {
    data: {
      user: {
        contributionsCollection: {
          contributionCalendar: {
            weeks: Array<ContributionCalendarWeek>;
          };
        };
      };
    };
  };
}

type ContributionCalendars = {
  totalContributions: number;
  weeks: Array<{
    contributionDays: Array<{
      contributionCount: number;
      date: string;
    }>;
  }>;
};

export function githubContributionData(
  username: string
): Promise<ContributionCalendars['weeks']> {
  return new Promise((resolve, reject) => {
    axios
      .post(
        'https://api.github.com/graphql',
        {
          query: `query {
                    user(login: "${username}"){
                      contributionsCollection {
                        contributionCalendar {
                          totalContributions
                          weeks {
                          contributionDays {
                              contributionCount
                              date
                            }
                          }
                        }
                      }
                    }
                  }`,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_PERSONAL_KEY}`,
          },
        }
      )
      .then((response) => {
        resolve(
          response.data.data.user.contributionsCollection?.contributionCalendar
            ?.weeks
        );
      }).catch((error) => {
        reject(error.message);
      });
  });
}

export function gitlabContributionData(
  username: string
): Promise<[]> {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://gitlab.com/users/${username}/calendar.json`)
      .then((response) => {
        resolve(response?.data);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
}
