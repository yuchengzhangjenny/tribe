# Environment Variables Setup

This document explains how to set up environment variables for the Tribe application.

## Local Development

1. Create a `.env` file in the root directory by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual API keys and secrets in the `.env` file:
   ```
   GOOGLE_MAPS_API_KEY=your_actual_key_here
   GOOGLE_CLOUD_API_KEY=your_actual_key_here
   # Add other environment variables
   ```

3. **IMPORTANT**: Never commit your `.env` file to Git. It's already added to `.gitignore`.

## How Environment Variables Are Used

- **Server**: Variables are loaded using `dotenv` and accessed through the `server/config/keys.js` file.
- **Client**: 
  - For Expo/React Native, variables are configured in `app.config.js` and accessed through `client/src/config/env.js`.
  - The client-side configuration adapts based on the environment (dev/staging/prod).

## Deployment

### For Production/Staging Environments

1. Set environment variables on your hosting platform (Heroku, Vercel, AWS, etc.)
2. For Expo/React Native builds, use EAS secrets or environment variables:
   ```bash
   # Example for EAS Build
   eas secret:create --name GOOGLE_MAPS_API_KEY --value your_actual_key_here --scope project
   ```

## Adding New Environment Variables

1. Add new variables to `.env` and `.env.example` (with placeholder values)
2. Update the configuration files if needed:
   - `server/config/keys.js` for server-side variables
   - `client/src/config/env.js` for client-side variables
   - `client/app.config.js` for Expo configuration 