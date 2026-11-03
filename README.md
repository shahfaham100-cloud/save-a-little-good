# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## Deploy to Hostinger (Node.js Web App)

1. `npm install`
2. `npm run build:hostinger` → creates `hostinger-upload/`
3. Zip the **contents** of `hostinger-upload/` (not the folder itself) and upload in hPanel → Websites → Add Website → Node.js web app → Upload files.
4. Settings: Framework **Other**, Node **22**, build command **empty**, entry file **server.js** (start command `npm start`).
