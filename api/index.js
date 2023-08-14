const fetch = require('node-fetch');

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );

  const auth_header = req.headers.authorization;

  if (!auth_header
    || auth_header === null
    || auth_header === ''
    || auth_header !== process.env.AUTH_KEY
  ) {
    res.status(401).send('Authorization header missing or invalid');

    return;
  }

  const index = req.query.status;

  const statuses = [
    {
      icon: 'house',
      text: 'Home'
    },
    {
      icon: 'eg',
      text: 'Work'
    },
    {
      icon: 'church',
      text: 'Church'
    },
    {
      icon: 'coffee',
      text: 'Coffee shop'
    },
    {
      icon: 'car',
      text: 'Elsewhere'
    }
  ];

  const slack_user_bearer_token = process.env.SLACK_USER_BEARER_TOKEN;

  const body = JSON.stringify({
    profile: {
      status_emoji: `:${statuses[index].icon}:`,
      status_expiration: 0,
      status_text: statuses[index].text
    }
  });

  fetch(
    'https://slack.com/api/users.profile.set',
    {
      body,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${slack_user_bearer_token}`,
        'Content-Type': 'application/json; charset=utf-8'
      }
    }
  )
  .then(res => res.json())
  .then((json) => {
    res.json({
      status: json.ok === true ? 200 : 400,
      status_emoji: json.profile.status_emoji,
      status_text: json.profile.status_text
    });
  });
};
