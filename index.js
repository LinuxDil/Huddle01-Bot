const axios = require('axios');
const ethers = require('ethers');
const fs = require('fs-extra');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const colors = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  white: "\x1b[37m",
  bold: "\x1b[1m"
};

const logger = {
  info: (msg) => console.log(`${colors.green}[?] ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}[?] ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}[?] ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}[?] ${msg}${colors.reset}`),
  loading: (msg) => console.log(`${colors.cyan}[?] ${msg}${colors.reset}`),
  step: (msg) => console.log(`${colors.white}[?] ${msg}${colors.reset}`),
  banner: () => {
    console.log(`${colors.cyan}${colors.bold}`);
    console.log(`---------------------------------------------`);
    console.log(`  Huddle Testnet Auto Bot - Airdrop Seeker `);
    console.log(`---------------------------------------------${colors.reset}`);
    console.log();
  }
};

// Crypto-themed names generator
const generateCryptoName = () => {
  const prefixes = ['0x', 'degen', 'crypto', 'web3', 'eth', 'btc', 'ape', 'gm', 'wagmi', 'hodl', 'fomo', 'dyor', 'ngmi', 'rekt', 'bull', 'bear', 'shill', 'fud', 'lambo', 'ser'];
  const suffixes = ['master', 'king', 'queen', 'lord', 'sniper', 'whale', 'maxi', 'farmer', 'miner', 'trader', 'dev', 'ninja', 'god', 'punk', 'dude', 'chad', 'guru', 'sifu', 'degen', 'killer'];
  const domains = ['eth', 'crypto', 'bitcoin', 'nft', 'dao', 'defi', 'money', 'bank', 'wallet', 'x', 'btc'];
  
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const randomDomain = domains[Math.floor(Math.random() * domains.length)];
  
  // Randomly choose between different name formats
  const formats = [
    () => `${randomPrefix}${randomSuffix}`,
    () => `${randomPrefix}_${randomSuffix}`,
    () => `0x${ethers.utils.hexlify(ethers.utils.randomBytes(4)).slice(2, 10)}`,
    () => `${randomPrefix}.${randomDomain}`,
    () => `${randomPrefix}${Math.floor(Math.random() * 1000)}`,
    () => `${randomPrefix}${randomSuffix}.${randomDomain}`
  ];
  
  return formats[Math.floor(Math.random() * formats.length)]();
};

const generateRandomUserAgent = () => {
  const chromeVersions = ['110.0.0.0', '111.0.0.0', '112.0.0.0', '113.0.0.0', '114.0.0.0', '115.0.0.0', '116.0.0.0', '117.0.0.0', '118.0.0.0', '119.0.0.0', '120.0.0.0', '121.0.0.0', '122.0.0.0', '123.0.0.0', '124.0.0.0', '125.0.0.0'];
  const firefoxVersions = ['110.0', '111.0', '112.0', '113.0', '114.0', '115.0', '116.0', '117.0', '118.0', '119.0', '120.0', '121.0', '122.0', '123.0', '124.0', '125.0'];
  const safariVersions = ['15.0', '15.1', '15.2', '15.3', '15.4', '15.5', '15.6', '16.0', '16.1', '16.2', '16.3', '16.4', '16.5', '17.0'];
  const edgeVersions = ['110.0.0.0', '111.0.0.0', '112.0.0.0', '113.0.0.0', '114.0.0.0', '115.0.0.0', '116.0.0.0', '117.0.0.0', '118.0.0.0', '119.0.0.0', '120.0.0.0', '121.0.0.0', '122.0.0.0', '123.0.0.0', '124.0.0.0', '125.0.0.0'];
  const braveVersions = ['120.0.0.0', '121.0.0.0', '122.0.0.0', '123.0.0.0', '124.0.0.0', '125.0.0.0', '126.0.0.0', '127.0.0.0', '128.0.0.0', '129.0.0.0', '130.0.0.0', '131.0.0.0', '132.0.0.0', '133.0.0.0', '134.0.0.0', '135.0.0.0', '136.0.0.0', '137.0.0.0'];

  const windowsVersions = ['10.0', '11.0'];
  const macosVersions = ['10_15_7', '11_0_0', '11_1_0', '11_2_0', '11_3_0', '11_4_0', '11_5_0', '11_6_0', '12_0_0', '12_1_0', '12_2_0', '12_3_0', '12_4_0', '12_5_0', '12_6_0', '13_0_0', '13_1_0', '13_2_0', '13_3_0', '13_4_0', '13_5_0', '14_0_0'];
  const linuxTypes = ['X11; Linux x86_64', 'X11; Ubuntu; Linux x86_64', 'X11; Fedora; Linux x86_64'];

  const androidVersions = ['10.0', '11.0', '12.0', '13.0', '14.0'];
  const iosVersions = ['15_0', '15_1', '15_2', '15_3', '15_4', '15_5', '15_6', '16_0', '16_1', '16_2', '16_3', '16_4', '17_0', '17_1', '17_2'];

  const randomItem = arr => arr[Math.floor(Math.random() * arr.length)];
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const browserTypes = [
    () => {
      const version = randomItem(chromeVersions);
      const windowsVer = randomItem(windowsVersions);
      return `Mozilla/5.0 (Windows NT ${windowsVer}; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36`;
    },
    () => {
      const version = randomItem(chromeVersions);
      const macVer = randomItem(macosVersions);
      return `Mozilla/5.0 (Macintosh; Intel Mac OS X ${macVer}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36`;
    },
    () => {
      const version = randomItem(chromeVersions);
      const linux = randomItem(linuxTypes);
      return `Mozilla/5.0 (${linux}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36`;
    },
    () => {
      const version = randomItem(chromeVersions);
      const androidVer = randomItem(androidVersions);
      const model = `SM-${randomItem(['A', 'S', 'N'])}${randomInt(10, 99)}${randomItem(['', 'U', 'F'])}`;
      return `Mozilla/5.0 (Linux; Android ${androidVer}; ${model}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Mobile Safari/537.36`;
    },
    () => {
      const version = randomItem(firefoxVersions);
      const windowsVer = randomItem(windowsVersions);
      return `Mozilla/5.0 (Windows NT ${windowsVer}; Win64; x64; rv:${version}) Gecko/20100101 Firefox/${version}`;
    },
    () => {
      const version = randomItem(firefoxVersions);
      const macVer = randomItem(macosVersions);
      return `Mozilla/5.0 (Macintosh; Intel Mac OS X ${macVer}; rv:${version}) Gecko/20100101 Firefox/${version}`;
    },
    () => {
      const version = randomItem(safariVersions);
      const macVer = randomItem(macosVersions);
      return `Mozilla/5.0 (Macintosh; Intel Mac OS X ${macVer}) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${version} Safari/605.1.15`;
    },
    () => {
      const version = randomItem(safariVersions);
      const iosVer = randomItem(iosVersions);
      const device = randomItem(['iPhone', 'iPad']);
      return `Mozilla/5.0 (${device}; CPU OS ${iosVer} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${version} Mobile/15E148 Safari/604.1`;
    },
    () => {
      const version = randomItem(edgeVersions);
      const windowsVer = randomItem(windowsVersions);
      return `Mozilla/5.0 (Windows NT ${windowsVer}; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36 Edg/${version}`;
    },
    () => {
      const version = randomItem(braveVersions);
      const windowsVer = randomItem(windowsVersions);
      return `Mozilla/5.0 (Windows NT ${windowsVer}; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36 Brave/${version}`;
    },
    () => {
      const version = randomItem(braveVersions);
      const macVer = randomItem(macosVersions);
      return `Mozilla/5.0 (Macintosh; Intel Mac OS X ${macVer}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36 Brave/${version}`;
    }
  ];

  return randomItem(browserTypes)();
};

const BASE_URL = 'https://huddle01.app/api/v2/platform/api/v2';

const getHeaders = () => {
  return {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.7',
    'content-type': 'application/json',
    'priority': 'u=1, i',
    'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'sec-gpc': '1',
    'User-Agent': generateRandomUserAgent(),
    'Accept-Encoding': 'gzip, compress, deflate, br'
  };
};

const generateWallet = async () => {
  const wallet = ethers.Wallet.createRandom();
  const walletData = {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic.phrase
  };

  let wallets = [];
  try {
    wallets = await fs.readJson('wallets.json');
  } catch (error) {
  }
  wallets.push(walletData);
  await fs.writeJson('wallets.json', wallets, { spaces: 2 });

  return wallet;
};

const getWallet = async () => {
  try {
    const wallets = await fs.readJson('wallets.json');
    if (wallets.length === 0) {
      logger.warn('No wallets found, generating new wallet...');
      return await generateWallet();
    }
    const walletData = wallets[wallets.length - 1];
    const wallet = new ethers.Wallet(walletData.privateKey);
    logger.success(`Wallet loaded: ${wallet.address.substring(0, 6)}...${wallet.address.substring(38)}`);
    return wallet;
  } catch (error) {
    logger.warn('wallets.json not found, generating new wallet...');
    return await generateWallet();
  }
};

const generateChallenge = async (address) => {
  try {
    logger.loading(`Generating challenge for ${address.substring(0, 6)}...${address.substring(38)}`);
    const response = await axios.post(
      `${BASE_URL}/auth/wallet/generateChallenge`,
      { walletAddress: address },
      { headers: getHeaders() }
    );
    if (!response.data.signingMessage) {
      throw new Error('signingMessage not found in challenge response');
    }
    return response.data;
  } catch (error) {
    logger.error(`Challenge generation failed: ${error.response?.data?.message || error.message}`);
    throw error;
  }
};

const signMessage = async (wallet, challenge) => {
  const message = challenge.signingMessage;

  try {
    logger.loading('Signing authentication message...');
    const signature = await wallet.signMessage(message);
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    if (recoveredAddress.toLowerCase() !== wallet.address.toLowerCase()) {
      throw new Error('Signature verification failed');
    }
    return signature;
  } catch (error) {
    logger.error(`Signing failed: ${error.message}`);
    throw error;
  }
};

const login = async (wallet, signature, retryCount = 3) => {
  try {
    logger.loading('Logging in to Huddle01...');
    const distinctId = `01966e39-${uuidv4().slice(0, 12)}`;
    const sessionId = `01966e39-${uuidv4().slice(0, 12)}`;
    const posthogCookie = `ph_phc_3E8W7zxdzH9smLU2IQnfcElQWq1wJmPYUmGFUE75Rkx_posthog=%7B%22distinct_id%22%3A%22${distinctId}%22%2C%22%24sesid%22%3A%5B${Date.now()}%2C%22${sessionId}%22%2C${Date.now() - 10000}%5D%7D`;

    const response = await axios.post(
      `${BASE_URL}/auth/wallet/login`,
      {
        address: wallet.address,
        signature,
        chain: 'eth',
        wallet: 'metamask',
        dashboardType: 'personal'
      },
      {
        headers: {
          ...getHeaders(),
          cookie: posthogCookie
        }
      }
    );
    return { tokens: response.data.tokens, posthogCookie };
  } catch (error) {
    logger.error(`Login failed: ${error.response?.data?.message || error.message}`);
    if (retryCount > 0 && error.response?.data?.message === 'Invalid signature') {
      logger.warn(`Retrying login (${retryCount} attempts left)...`);
      const newChallenge = await generateChallenge(wallet.address);
      const newSignature = await signMessage(wallet, newChallenge);
      return login(wallet, newSignature, retryCount - 1);
    }
    throw error;
  }
};

const getPreviewPeers = async (accessToken, posthogCookie, roomId) => {
  try {
    logger.loading(`Fetching preview peers for room ${roomId}...`);
    const response = await axios.get(
      `${BASE_URL}/web/getPreviewPeersInternal/${roomId}`,
      {
        headers: {
          ...getHeaders(),
          cookie: `accessToken=${accessToken}; ${posthogCookie}`,
          Referer: `https://huddle01.app/room/${roomId}/lobby`,
          'Referrer-Policy': 'strict-origin-when-cross-origin'
        }
      }
    );
    return response.data;
  } catch (error) {
    logger.error(`Failed to get preview peers: ${error.response?.data?.message || error.message}`);
    throw error;
  }
};

const getRecorderStatus = async (accessToken, posthogCookie, roomId) => {
  try {
    logger.loading('Checking recorder status...');
    const response = await axios.get(
      `${BASE_URL}/recorder/status?roomId=${roomId}`,
      {
        headers: {
          ...getHeaders(),
          cookie: `accessToken=${accessToken}; ${posthogCookie}`,
          Referer: `https://huddle01.app/room/${roomId}/lobby`,
          'Referrer-Policy': 'strict-origin-when-cross-origin'
        }
      }
    );
    return response.data;
  } catch (error) {
    logger.error(`Failed to get recorder status: ${error.response?.data?.message || error.message}`);
    throw error;
  }
};

const createMeetingToken = async (accessToken, displayName, posthogCookie, roomId) => {
  try {
    logger.loading('Creating meeting token...');
    const response = await axios.post(
      `${BASE_URL}/create-meeting-token`,
      {
        roomId: roomId,
        metadata: {
          displayName,
          avatarUrl: 'https://web-assets.huddle01.media/avatars/0.png'
        }
      },
      {
        headers: {
          ...getHeaders(),
          cookie: `accessToken=${accessToken}; ${posthogCookie}`,
          Referer: `https://huddle01.app/room/${roomId}/lobby`,
          'Referrer-Policy': 'strict-origin-when-cross-origin'
        }
      }
    );
    return response.data.token;
  } catch (error) {
    logger.error(`Failed to create meeting token: ${error.response?.data?.message || error.message}`);
    throw error;
  }
};

const getGeolocation = async () => {
  try {
    logger.loading('Fetching geolocation data...');
    const response = await axios.get('https://shinigami.huddle01.com/api/get-geolocation', {
      headers: {
        ...getHeaders(),
        Referer: 'https://huddle01.app/',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      }
    });
    logger.info(`Location: ${response.data.country} (${response.data.globalRegion})`);
    return response.data;
  } catch (error) {
    logger.error(`Failed to get geolocation: ${error.response?.data?.message || error.message}`);
    throw error;
  }
};

const getSushiUrl = async (meetingToken) => {
  try {
    logger.loading('Getting Sushi server URL...');
    const response = await axios.get('https://apira.huddle01.media/api/v1/getSushiUrl', {
      headers: {
        ...getHeaders(),
        authorization: `Bearer ${meetingToken}`,
        Referer: 'https://huddle01.app/',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      }
    });
    return response.data.url;
  } catch (error) {
    logger.error(`Failed to get Sushi URL: ${error.response?.data?.message || error.message}`);
    throw error;
  }
};

const connectWebSocket = async (sushiUrl, meetingToken, geolocation) => {
  logger.loading('Connecting to WebSocket server...');
  const wsUrl = `${sushiUrl}/ws?token=${meetingToken}&version=core@2.3.5,react@2.3.6&region=${geolocation.globalRegion}&country=${geolocation.country}`;
  const ws = new WebSocket(wsUrl, {
    headers: {
      'accept-language': 'en-US,en;q=0.7',
      'cache-control': 'no-cache',
      'pragma': 'no-cache',
      'sec-websocket-extensions': 'permessage-deflate; client_max_window_bits',
      'sec-websocket-key': Buffer.from(uuidv4()).toString('base64'),
      'sec-websocket-version': '13',
      'User-Agent': generateRandomUserAgent()
    }
  });

  return new Promise((resolve) => {
    ws.on('open', () => {
      logger.success('Connected to Huddle01 WebSocket');

      let joined = false;
      let joinTimeout = setTimeout(() => {
        if (!joined) {
          logger.warn('Timed out waiting for join confirmation, proceeding anyway');
        }
        resolve(ws);
      }, 10000); 
      
      ws.on('message', (data) => {
        const message = data.toString();
        try {
          const jsonMsg = JSON.parse(message);
          if (jsonMsg.type === "peer-join" || 
              (jsonMsg.type === "cmd" && jsonMsg.data && 
               jsonMsg.data.name === "join-room-done")) {
            logger.success('Successfully joined the room! ??');
            joined = true;
            clearTimeout(joinTimeout);
            resolve(ws);
          }
        } catch (e) {
        }
      });
    });

    ws.on('error', (error) => {
      logger.error(`WebSocket error: ${error.message}`);
    });

    ws.on('close', () => {
      logger.warn('WebSocket connection closed');
    });
  });
};

const fetchRoomData = async (accessToken, posthogCookie, roomId) => {
  try {
    logger.loading('Fetching room data...');
    await axios.get(
      `https://huddle01.app/room/_next/data/H3CDrjpx5azzh2ccQTXr1/en/${roomId}.json?roomId=${roomId}`,
      {
        headers: {
          ...getHeaders(),
          'x-nextjs-data': '1',
          cookie: `accessToken=${accessToken}; refreshToken=${accessToken}; ${posthogCookie}`,
          Referer: `https://huddle01.app/room/${roomId}/lobby`,
        }
      }
    );
    return true;
  } catch (error) {
    logger.error(`Failed to fetch room data: ${error.response?.data?.message || error.message}`);
    return false; 
  }
};

const fetchPointsData = async (wallet, accessToken, posthogCookie, roomId) => {
  try {
    logger.loading('Fetching points data...');
    await axios.get(
      `https://huddle01.app/room/api/trpc/hps.getPoints?batch=1&input=%7B%220%22%3A%7B%22walletAddress%22%3A%22${wallet.address}%22%7D%7D`,
      {
        headers: {
          ...getHeaders(),
          cookie: `accessToken=${accessToken}; refreshToken=${accessToken}; ${posthogCookie}`,
          Referer: `https://huddle01.app/room/${roomId}`,
        }
      }
    );
    return true;
  } catch (error) {
    logger.error(`Failed to fetch points data: ${error.response?.data?.message || error.message}`);
    return false; 
  }
};

const sendJoinRoomMessage = (ws, roomId) => {
  try {
    logger.loading('Sending join room request...');
    const joinMessage = JSON.stringify({
      type: "cmd",
      data: {
        name: "join-room",
        payload: {
          roomId: roomId,
          role: "viewer" 
        }
      }
    });
    
    ws.send(joinMessage);

    setTimeout(() => {
      logger.loading('Enabling audio...');
      const enableAudioMessage = JSON.stringify({
        type: "cmd",
        data: {
          name: "enable-audio",
          payload: {}
        }
      });
      ws.send(enableAudioMessage);
      logger.success('Audio enabled');
    }, 2000);
    
    return true;
  } catch (error) {
    logger.error(`Failed to send join message: ${error.message}`);
    return false;
  }
};

const joinMeeting = async (roomId, displayName, accountIndex, totalAccounts) => {
  try {
    if (accountIndex === 0) {
      logger.banner();
    }
    
    const accountNumber = accountIndex + 1;
    logger.info(`[Account ${accountNumber}/${totalAccounts}] Joining room ${roomId} as ${displayName}`);
    logger.info(`Using random User-Agent to avoid detection`);

    logger.step(`[Account ${accountNumber}] Loading wallet...`);
    const wallet = await getWallet();

    logger.step(`[Account ${accountNumber}] Starting authentication process...`);
    const challenge = await generateChallenge(wallet.address);

    const signature = await signMessage(wallet, challenge);

    const { tokens, posthogCookie } = await login(wallet, signature);
    logger.success(`[Account ${accountNumber}] Authentication successful ?`);

    logger.step(`[Account ${accountNumber}] Preparing to join meeting...`);
    await getPreviewPeers(tokens.accessToken, posthogCookie, roomId);

    await getRecorderStatus(tokens.accessToken, posthogCookie, roomId);

    const meetingToken = await createMeetingToken(tokens.accessToken, displayName, posthogCookie, roomId);
    logger.success(`[Account ${accountNumber}] Meeting token created`);

    const geolocation = await getGeolocation();

    const sushiUrl = await getSushiUrl(meetingToken);
    logger.success(`[Account ${accountNumber}] Server connection ready`);

    logger.step(`[Account ${accountNumber}] Connecting to room...`);
    const ws = await connectWebSocket(sushiUrl, meetingToken, geolocation);

    await fetchRoomData(tokens.accessToken, posthogCookie, roomId);

    await fetchPointsData(wallet, tokens.accessToken, posthogCookie, roomId);

    sendJoinRoomMessage(ws, roomId);
    
    console.log();
    logger.success(`[Account ${accountNumber}] Bot is now active in the meeting ??`);
    logger.info(`[Account ${accountNumber}] Collecting testnet participation points...`);
    
    return ws;
  } catch (error) {
    logger.error(`[Account ${accountIndex + 1}] Error in joinMeeting: ${error.response?.data?.message || error.message}`);
    console.error(`${colors.red}Error stack: ${error.stack}${colors.reset}`);
    return null;
  }
};

const startBot = async () => {
  logger.banner();
  console.log(`${colors.white}Welcome to the Huddle01 Testnet Auto Bot!${colors.reset}`);
  console.log(`${colors.white}This bot will help you join Huddle01 meetings and collect testnet points.${colors.reset}`);
  console.log();
  
  const roomId = await new Promise(resolve => {
    rl.question(`${colors.cyan}Enter room ID (e.g. llb-bnxg-hfg): ${colors.reset}`, resolve);
  });
  
  const accountCount = await new Promise(resolve => {
    rl.question(`${colors.cyan}Enter number of accounts to create: ${colors.reset}`, (answer) => {
      resolve(parseInt(answer) || 1);
    });
  });
  
  rl.close();
  
  const connections = [];
  
  for (let i = 0; i < accountCount; i++) {
    const displayName = generateCryptoName();
    const ws = await joinMeeting(roomId, displayName, i, accountCount);
    if (ws) {
      connections.push(ws);
    }
    
    // Add delay between account creations to avoid rate limiting
    if (i < accountCount - 1) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  if (connections.length > 0) {
    console.log();
    logger.success(`Successfully connected ${connections.length} accounts to the meeting!`);
    console.log(`${colors.yellow}Press Ctrl+C to exit${colors.reset}`);
    
    process.on('SIGINT', () => {
      console.log();
      logger.warn('Closing all WebSocket connections and exiting...');
      connections.forEach(ws => ws.close());
      logger.success('Thanks for using Huddle Testnet Auto Bot! ??');
      process.exit();
    });
  } else {
    logger.error('Failed to connect any accounts to the meeting');
    process.exit(1);
  }
};

startBot();
