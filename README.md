# UAE Content AI v2

Real AI-powered version using the OpenAI Responses API. The API key stays on the server and is never placed in the browser.

## Run/deploy
1. Install Node.js and Vercel CLI if needed.
2. In this project folder, set an environment variable named `OPENAI_API_KEY`.
3. Optional: set `OPENAI_MODEL=gpt-5.6-luna` (default already set in code).
4. Run `npm run dev` for local testing, or deploy the folder to Vercel.

Never put the OpenAI API key inside `public/index.html` or any client-side JavaScript.

## Cost
The app uses the cost-sensitive GPT-5.6 Luna model by default. API usage is billed separately by OpenAI; hosting can be kept on a free-tier platform subject to its current limits.
