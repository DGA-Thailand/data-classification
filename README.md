This source code implements a data classification assessment tool for government agencies, based on DGA Community Standard on "Government Data Classification and Data Sharing Framework", published at https://standard.dga.or.th/standard/dga-std/5343/.

The tool is generated using claude.ai using the prompt below.

## Prompt Used

```
Create a website for helping government agencies assess level of data classification with the following specifications.

TechStack : Next.JS

First ask for the name of data to be assessed.

* risk is assessed in 5 pillars : reputation, usage, financial, legal, national interest. 
* the impact of the "national interest" pillar is an average of impact scores from 3 sub-pillars: confidentiality, integrity, and availability. The impact score of each sub-pillar may go from 1 (low) to 3 (high). 
* The user needs to provide the score of the impact of the remaining pillars from 1 (low) to 3 (high). 
* The user needs to provide assessment for the likelihood of each pillar, and sub-pillar. Likelihood score may go from 1 to 5, defined as follows:
    * Level 1: Rare (Almost Impossible) - Once a year or less
    * Level 2: Unlikely (Improbable) -  Several times a year (2-4 times)
    * Level 3: Possible (May Occur) - Monthly or several times a month (1-3 times)
    * Level 4: Likely (Probable) - Weekly or several times a week (1-3 times)
    * Level 5: Almost Certain (Expected) - Daily or multiple times a day
* The risk score for each pillar is calculated from likelihood score multiply by impact score. 
* total risk level is calculated by taking average of risk from all pillars. 

Data classification is derived from total risk scores as follows: 
* score 1-2 : public 
* score 3-4 : internal 
* score 5-6 : confidential 
* score 7-9 : secret 
* 10 or more : top secret

Once data classification has been calculated. The website should allow the result, including the name of data and individual scores, to be exported.
```

## Getting Started

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). To run this project, first, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
