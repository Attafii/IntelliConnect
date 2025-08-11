# Environment Configuration

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Generative AI API Configuration
GENERATIVE_API_KEY=your_api_key_here
GENERATIVE_API_URL=https://api.generative.engine.capgemini.com/v2/llm/invoke
GENERATIVE_API_BASE_URL=https://api.generative.engine.capgemini.com/v1
```

## Security Notes

- The `.env.local` file is already included in `.gitignore` and will not be committed to version control
- Never commit API keys directly in source code
- The application will show warnings if the API key is not properly configured

## Setup Instructions

1. Copy the `.env.local.example` file to `.env.local`
2. Replace `your_api_key_here` with your actual Generative Engine API key
3. Restart your development server for changes to take effect
