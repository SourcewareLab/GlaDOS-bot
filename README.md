# GlaDOS Community Bot
[![Discord](https://img.shields.io/badge/Discord-Community-blue?logo=discord)](https://discord.gg/X69MUr2DKm)
![Node.js](https://img.shields.io/badge/Node.js-v22.14.0-green?logo=node.js)
![License](https://img.shields.io/badge/License-ISC-yellow)

🤖 **About**  
The GlaDOS Community Bot is a powerful administration tool designed to streamline server management and enhance the community experience. Built with **Node.js** and **Discord.js**, it provides robust functionality for both moderators and members, focusing on efficient server management and community engagement.

---

## 🛠️ Setup and Installation

Follow these steps to set up the GlaDOS Community Bot on your local machine or server:

### Prerequisites
- **Node.js**: Ensure you have Node.js installed (version specified in `.nvmrc` or `package.json`).
- **Git**: Install Git to clone the repository.
- **Discord Bot Token**: Create a bot on the [Discord Developer Portal](https://discord.com/developers/applications) and obtain your bot token.
- **Docker**: Install Docker to run the bot and a postgres instance.

### Installation Steps
1. **Fork the Repository**: Fork this repo to your personal Github account
2. **Clone the Repository**:
   ```bash
   git clone git@github.com:your-username/GlaDOS-bot.git
   cd GlaDOS-bot
3. **Install Dependencies**:
    ```bash
    npm install
4. **Set Up Environment Varialbes**:
    ```bash
    cp SAMPLE.env .env
    ```
    open the .env file and fill in the required values

5. **Run the Bot**:
    ```bash
    docker compose up
    
6. **Invite the Bot to your server**:
    - Use the OAuth2 URL generator on the Discord Developer Portal to create an invite link with the necessary permissions.
    - Invite the bot to your server using the generated link.

---

## 🚀 How to Contribute

We love contributions from everyone! Whether you're fixing a bug, adding a new feature, or improving documentation, your help is always appreciated. Here's how you can contribute:

Follow the steps below to contribute effectively:

1. **Fork the Repository:** Start by forking the repository to your own GitHub account.

2. **Clone the Repository:** Clone the forked repository to your local development environment.<br><br>
`git clone https://github.com/your-username/GlaDOS-bot.git`

3. **Create a New Branch Locally:** Create a branch for your feature or fix. Name your branch in a way that describes the purpose of your changes. For example:
- `feature/feature-name`
- `bugfix/bug-description`
- `docs/clarify-setup-instructions`

4. **Make Your Changes:**
   - Add your code, features, or bug fixes.

5. **Commit Guidelines:** When committing changes to your branch, please follow this naming scheme to keep commit history clean and readable:

Commit message format: `<type>:<short-description>`

Types:

    feat: A new feature or functionality added to the project.
    fix: A bug fix.
    docs: Documentation changes.
    style: Code style changes (e.g., formatting, missing semicolons).
    refactor: Code changes that neither fix a bug nor add a feature, but improve the structure.
    test: Adding or modifying tests.
    chore: Changes to the build process or auxiliary tools.

Example Commit Messages:

    feat: add user authentication to the website
    fix: resolve issue with missing image on homepage
    docs: update README.md with contribution guidelines
    style: format code according to ESLint rules
    test: add unit test for login function
    chore: update dependencies to latest version

6. **Push and Create a Pull Request:** Once you're ready, push your changes to your forked repository and open a pull request to the `dev` repository.\
   **Note:** open a pull request per feature and don't forget to link the corresponding issue by writing the `#issue-number`.

7. **Follow Up** We will review your changes and may provide feedback. Please address any comments or requested changes, and we’ll merge your contribution!

---

## 💡 Contribution Tips

- Always follow the coding style and best practices.
- Keep PRs concise and focused on a single feature or fix.
- Stay engaged in the discussions and suggest improvements.

---

## 💬 Join the Community

Have questions or want to discuss the project? Join our Discord community!  
[![Discord](https://img.shields.io/badge/Discord-Join%20Us-blue?logo=discord)](https://discord.gg/X69MUr2DKm)
