# UAE Content AI — Cloudflare Pages version

## Structure

```text
uae-content-ai/
├── functions/
│   └── api/
│       └── generate.js
├── public/
│   └── index.html
├── package.json
└── README.md
```

The frontend calls `/api/generate`; Cloudflare Pages maps `functions/api/generate.js` to that route.

## Cloudflare Pages settings

Connect the GitHub repository using **Workers & Pages → Create application → Pages → Connect to Git**.

- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `public`
- Root directory: `/`

After deployment, add an encrypted secret named `OPENAI_API_KEY` under **Settings → Variables and Secrets**.

Optional variable: `OPENAI_MODEL`. If omitted, the function uses `gpt-5.6-luna`.

Never put the OpenAI API key in `public/index.html` or commit it to GitHub.

Use Git integration for this project because it contains a Pages Function.
