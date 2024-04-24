# API Directory UI

## Description

API Directory UI is a Node.js package built with React, using Parcel as the bundler. This package is designed to serve as a user interface for an API directory, helping users to interactively browse and manage APIs.

## Features

- Modern React UI components.
- Easy-to-use development and build scripts powered by Parcel.
- Supports modern browsers and Node.js environments.

## Installation

To use API Directory UI in your project, follow these steps:

1. Ensure you have Node.js installed on your system.
2. Clone or download the package to your local environment.
3. Navigate to the package directory and run:

```bash
npm install
```
This will install all necessary dependencies for the project.

## Usage

To start the development server, run:
```bash
npm start
```
This command removes the Parcel cache and starts the Parcel development server, opening the application's main HTML file.

For building the production version, you can use:
```bash
npm run build
```

This will generate a production build in the build/default directory. If you need to build for a distribution as an embedded package, use:
```bash
npm run build-dist
```

This command builds the application targeting the distribution settings and outputs to the `../www` directory, accessible at `/app/` on your server.