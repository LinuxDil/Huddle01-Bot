# Huddle01 Auto Bot

A Node.js bot for automatically joining Huddle01 test network rooms to collect testnet participation points.

## Register

- Link : [https://testnet.huddle01.com](https://testnet.huddle01.com/r/0xfee38b6c8aa0c30ccd8d3c1bb377a221b1f7c0fe)

## 🚀 Features

- Automatically generates and manages Ethereum wallets
- Handles wallet-based authentication with Huddle01
- Maintains WebSocket connections to Huddle01 meetings
- Collects testnet participation points automatically
- Uses randomized user agents to avoid detection

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/LinuxDil/Huddle01-Bot.git
cd Huddle01-Auto-Bot
```

2. Install dependencies:
```bash
npm install
```

## 🎮 Usage

Run the bot with:
```bash
node index.js
```

The bot will:
1. Ask for a room ID (e.g., llb-bnxg-hfg)
2. Ask for a display name to use in the meeting
3. Generate or load an Ethereum wallet
4. Authenticate with Huddle01
5. Join the specified room
6. Stay connected to collect participation points

Press `Ctrl+C` to safely exit the bot.

## Note

You need to admit manual user from script to join room/meeting, simpel refresh or reload meeting link room to admit user

## 💾 Wallet Management

The bot automatically creates and manages Ethereum wallets in a `wallets.json` file. These wallets are used for authentication with Huddle01. The private keys and mnemonics are stored locally in this file, so please ensure it remains secure.

## ⚠️ Disclaimer

This bot is provided for educational purposes only. Use at your own risk and be aware of the terms of service of the platforms you interact with.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

---

Made with ❤️ by [LinuxDil](https://github.com/LinuxDil/Huddle01-Bot/)
