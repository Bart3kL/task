````markdown
# Project setup instructions

To get started with the project, please follow these steps:

## 1. Install dependencies

Install all the necessary packages:

```bash
pnpm i
```
````

## 2. Start listening for code changes

Run the local server to start listening for code changes:

```bash
pnpm run start
```

## 3. Run preview

```bash
pnpm run shopify:dev
```

To run the application preview, visit the following address (preview: [http://127.0.0.1:9292/?preview_theme_id=173116817756](http://127.0.0.1:9292/?preview_theme_id=your_theme_id)):

### Make sure you change the preview_theme_id in package.json

## 4. Description

In the /src directory we declare .liquid, .ts and .scss files, after saving the file they are immediately modified and moved to the main directory to the /assets, /snippets or /sections folder.
