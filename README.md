# Welcome

This app was created for GDS DCUBE Technical assessment. The website can be accessed (here)[jurl.joenz.kim], and the backend repo can be found (here)[https://github.com/joenzkc/j-urls-backend]

## A short note

Thank you for taking a look at my assignment! Before doing this assessment, I actually did the technical assessment for ACE, which can be found at (here)[survey.joenz.kim]. While doing that technical assessment, I think I learned a lot about frontend development and I tried my best to apply whatever I learned here to make my page more mobile responsive (the other website is not really very mobile response).

Thanks for taking a look!

## Setup

1. Follow the instructions at (the backend repository) to setup your server first
2. Clone this repository:
   `git clone https://github.com/joenzkc/jsurvey-frontend.git`
3. Run `npm i` to install dependencies
4. Copy `.env.sample` and rename it to `.env`, fill in the necessary data
5. Run your backend server, once that is up, do `npm run dev` to launch the frontend
6. Visit (localhost:3000)[localhost:3000] to view your website

## Techstack

This project was created making use of Next.js and TailwindCSS for components

I chose to use Next.js as it provides a framework around React.js, which is a very popular library for creating frontend pages. I chose to use TailwindCSS as it allows to me easily write my own components instead of using a components library online. Tailwind also makes it easy to implement mobile responsiveness.

The backend was created making use of koa.js (a framework around express) and Postgres. Koa.js is very unrestrictive in how you framework your backend, and gives you a lot of freedom in how you wish to design it (unlike Nest.js which has a lot of "beliefs") Ultimately, I still followed what I believe to be the best practices for the backend (albeit similar to Nest.js)

This project is hosted on vercel for the frontend, and render.com for the backend. The database is hosted on supabase.io. I would have chosen to use AWS RDS and AWS Elastic Beanstalk, but I do not have anymore free tier for that...

## Assumptions

1. If two users shorten the same URL, they will get 2 different shortened URLs. However, if the user shortens the same URL twice, they will receive the same shortened URL that they received before

## Notes

Sometimes render.com can be very slow with the backend service, so if you are testing the app and its very slow, that could potentially be the reason. I do have a cron-job setup to constantly refresh the backend, but sometimes it fails and could lead in slowness
