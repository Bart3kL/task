## Project Setup Instructions

To get started with the project, please follow these steps:

## 1. Install Dependencies

Install all the necessary packages:

```bash
pnpm install
```

## 2. Start Listening for Code Changes

Run the local server to start listening for code changes:

```bash
pnpm run start
```

## 3. Run Preview

Start the preview environment:

```bash
pnpm run shopify:dev
```

To view the application preview, visit the following address:

[http://127.0.0.1:9292/?preview_theme_id=your_theme_id](http://127.0.0.1:9292/?preview_theme_id=your_theme_id)

> **Note:** Make sure to replace `your_theme_id` with the actual `preview_theme_id` in your `package.json`.

## 4. Project Structure Description

In the `/src` directory, we have `.liquid`, `.ts`, and `.scss` files. After saving a file, it is automatically processed and moved to the respective folders in the main directory:

- `/assets`
- `/snippets`
- `/sections`

This setup ensures that your assets are organized and up-to-date with your latest code changes.
