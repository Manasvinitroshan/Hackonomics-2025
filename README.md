# Foundr

**Your 24/7 AI CFO for Startup Survival**

Built at **Hackenomics 2025**, Foundr is an AI-powered financial co-pilot designed to help early-stage founders avoid common financial pitfalls and make smarter decisions around the clock—via chat or voice.

---

## Table of Contents

* [Features](#features)
* [Architecture](#architecture)
* [Getting Started](#getting-started)

  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Configuration](#configuration)
* [Usage](#usage)
* [Contributing](#contributing)
* [License](#license)

---

## Features

* **RAG-Based Document Q\&A**: Upload PDFs (term sheets, P\&Ls, cap tables) to AWS S3, parsed by AWS Textract, and answered via GPT-4 + Pinecone.
* **Retell Voice AI**: 24/7 call-in CFO powered by Retell SDK, with serverless AWS Lambda and API Gateway.
* **Metrics & Simulations**: Real-time runway, burn rate, MRR tracking and Monte Carlo funding forecasts.
* **Live Feeds**: Startup events from SerpAPI and financial news via NewsAPI.
* **Founder Forum**: Serverless discussion board (DynamoDB) supporting posts, replies, and likes.
* **Learning Hub**: Bite-sized finance lessons to boost financial literacy.

---

## Architecture

![](architecture.png)

Our AWS-based architecture uses:

* **API Gateway** → **AWS Lambda** for request handling
* **AWS S3** for document storage
* **AWS Textract** for OCR parsing
* **Pinecone** for vector embeddings and RAG search
* **OpenAI GPT-4** for natural language answers
* **Retell SDK** for voice integration
* **DynamoDB** for forum data
* External APIs: SerpAPI & NewsAPI

---

## Getting Started

### Prerequisites

* Node.js (v16+)
* npm or yarn
* AWS account with S3, Textract, Lambda, API Gateway, and DynamoDB permissions
* OpenAI API key
* Retell SDK credentials
* Pinecone API key

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/foundr.git
cd foundr

# Install dependencies
npm install    # or yarn install
```

### Configuration

1. Copy `.env.example` to `.env` and fill in your credentials:

   ```env
   OPENAI_API_KEY=your_openai_key
   PINECONE_API_KEY=your_pinecone_key
   AWS_ACCESS_KEY_ID=...
   AWS_SECRET_ACCESS_KEY=...
   RETELL_API_KEY=your_retell_key
   ```
2. Deploy serverless functions:

   ```bash
   npx serverless deploy
   ```

---

## Usage

1. **Start the frontend**:

   ```bash
   npm run dev
   ```
2. **Upload documents** via the UI, ask questions in the chat, or call the Retell voice endpoint.
3. **View metrics** and run simulations on the dashboard.
4. **Join the forum** to ask questions and like or reply to posts.

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/NewThing`.
3. Commit your changes: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature/NewThing`.
5. Open a Pull Request.

Please ensure all tests pass and documentation is updated.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
