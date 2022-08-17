locals {
  vault_url = "https://primary-dev.vault.9871e6c3-b0b9-479a-b392-eb69322d192a.aws.hashicorp.cloud:8200"
  MONGO_DB_NAME = "app"
  MONGO_DB_HOSTNAME = "primary-pri.ahxui.mongodb.net"

  rairnode_configmap = {
    PRODUCTION: "true",
    PINATA_KEY: "aaa581a498f99ed85279",
    ADMIN_NETWORK: "matic",
    ADMIN_CONTRACT: "0xbA947797AA2f1De2cD101d97B1aE6b04182fF3e6",
    INFURA_PROJECT_ID: "92a88973a28d41318792f77451db4c5b",
    SERVICE_HOST: "new-dev.rair.market",
    DEFAULT_PRODUCT_COVER: "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW",
    GCP_PROJECT_ID: "dev-rair-market",
    GCP_IMAGE_BUCKET_NAME: "rair-market-dev-rair-files",
    GCP_VIDEO_BUCKET_NAME: "rair-market-dev-rair-files",
    GCP_GATEWAY: "https://storage.googleapis.com",
    IPFS_SERVICE: "pinata",
    IPFS_GATEWAY: "http://rairipfs:8080/ipfs",
    PINATA_GATEWAY: "https://rair.mypinata.cloud/ipfs",
    BINANCE_FACTORY_ADDRESS: "0xb173E2F7eD8Bb697e70b02Ed38faaa2319dB3C23",
    BINANCE_MINTER_ADDRESS: "0xcBA6014452e82eBF98fA2748BBD46f1733a13AdD",
    GOERLI_FACTORY_ADDRESS: "0xF9DC1787179c1404910adE194A5087cEbD5c4717",
    GOERLI_MINTER_ADDRESS: "0x14ef15A945b6Cae28f4FA3862E41d74E484Cd3B5",
    MATIC_MUMBAI_FACTORY_ADDRESS: "0xB8083810Fa33e7Ebd777c8cd6eBB453948aFd354",
    MATIC_MUMBAI_MINTER_ADDRESS: "0x4594D508cDa05D016571082d467889f4629e1f56",
    MATIC_MAINNET_FACTORY_ADDRESS: "0x9bB24e68d952Ab872b0421297E0cda8D89B2390B",
    MATIC_MAINNET_MINTER_ADDRESS: "0x781F15a23506CF28539EA057e3f33008E6339E49",
    ETHEREUM_MAINNET_FACTORY_ADDRESS: "0xC9eF9902fa24923A17326aDdb7da0E67fF46692a",
    ETHEREUM_MAINNET_MINTER_ADDRESS: "0x0Ce668D271b8016a785Bf146e58739F432300B12",
    MATIC_TESTNET_RPC: "https://polygon-mumbai.infura.io/v3/92a88973a28d41318792f77451db4c5b",
    MATIC_MAINNET_RPC: "https://polygon-mainnet.infura.io/v3/92a88973a28d41318792f77451db4c5b",
    ETHEREUM_MAINNET_RPC: "https://mainnet.infura.io/v3/92a88973a28d41318792f77451db4c5b",
    ETHEREUM_TESTNET_GOERLI_RPC: "https://goerli.infura.io/v3/92a88973a28d41318792f77451db4c5b",
    BINANCE_TESTNET_RPC: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    BINANCE_MAINNET_RPC: "https://bsc-dataseed.binance.org/",
    MONGO_LOG_COLLECTION: "Log",
    LOG_LEVEL: "debug",
    MORALIS_SERVER_TEST: "https://ldz2lkdhowt1.usemoralis.com:2053/server",
    MORALIS_SERVER_MAIN: "https://y14jhwis7uao.moralishost.com:2053/server",
    MORALIS_API_KEY_TEST: "1fwzRnhKfABUG6v8PBgsQlRmbdKsgjLKqvmPMZEn",
    MORALIS_MASTER_KEY_TEST: "P3bQyDqkU5NU80xt2lTg3jGDaFP2KN0XkbtxpNV5",
    MORALIS_MASTER_KEY_TEST: "P3bQyDqkU5NU80xt2lTg3jGDaFP2KN0XkbtxpNV5",
    SESSION_SECRET: "testsecret",
    SESSION_TTL: "12"
    GENERATE_MONGO_URI_WITH_VAULT_CREDENTIAL_UTIL: true
    MONGO_DB_HOSTNAME: local.MONGO_DB_HOSTNAME,
    MONGO_DB_NAME: local.MONGO_DB_NAME,
    USE_X509_CERT_AUTH: true,
    GCP_PROJECT_ID: local.gcp_project_id,
    VAULT_URL: local.vault_url,
    REDISHOST: "redis-primary",
    REDISPORT: 80,
    SESSION_SECRET: "test-secret",
    SESSION_TTL: 15,
  }

  minting_network_configmap = {
    REACT_APP_SENTRY_ENABLED: "true",
    REACT_APP_SENTRY_IO_ENDPOINT: "https://b1b9b63c8d484d35a7f47235c681201b@o1004167.ingest.sentry.io/5965143",
    REACT_APP_SENTRY_IO_TRACE_RATE: "1.0",
    REACT_APP_SENTRY_RELEASE: "unknown_development_build",
    REACT_APP_DISABLE_CREATOR_VIEWS: "false",
    REACT_APP_HOME_PAGE: "/",
    REACT_APP_GOOGLE_ANALYTICS: "/",
    REACT_APP_GA_NAME: "/"
  }

  blockchain_event_listener_configmap = {
    PRODUCTION: "true",
    PINATA_KEY: "aaa581a498f99ed85279",
    PINATA_GATEWAY: "https://rair.mypinata.cloud/ipfs",
    INFURA_PROJECT_ID: "92a88973a28d41318792f77451db4c5b",
    DEFAULT_PRODUCT_COVER: "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW",
    BINANCE_TESTNET_FACTORY_ADDRES: "0x2b5ed3C018DA72270C3C30003C8d5affdBB9F7f5",
    BINANCE_TESTNET_MINTER_ADDRESS: "0xcBA6014452e82eBF98fA2748BBD46f1733a13AdD",
    BINANCE_TESTNET_DIAMOND_FACTORY_ADDRESS: "0xA2c57691b8DF0D8479f5f888c69346363D23a49F",
    BINANCE_TESTNET_DIAMOND_MARKETPLACE_ADDRESS: "0xaCb13B4c527eD6237f7DB6E95Ef71929d1e13DD6",
    GOERLI_FACTORY_ADDRES: "0xe1BBd1d2B2B52042CC3B766Fb72AA2804e402B2e",
    GOERLI_MINTER_ADDRESS: "0x14ef15A945b6Cae28f4FA3862E41d74E484Cd3B5",
    GOERLI_DIAMOND_FACTORY_ADDRESS: "0xEF85370b8F136E2F28eA904bF0dA5acac3D1d74f",
    GOERLI_DIAMOND_MARKETPLACE_ADDRESS: "0x6B3c06b39Aa1ADe73c625b184326d4837c7a2b64",
    MATIC_MUMBAI_FACTORY_ADDRES: "0x2E8DC5Bc8523Bd129dc770908b41c5c2c22d4AdD",
    MATIC_MUMBAI_MINTER_ADDRESS: "0x4594D508cDa05D016571082d467889f4629e1f56",
    MATIC_MUMBAI_DIAMOND_FACTORY_ADDRESS: "0xbB236Ce48dDCb58adB8665E220FE976bA5d080a5",
    MATIC_MUMBAI_DIAMOND_MARKETPLACE_ADDRESS: "0x2c8BA9f098CD319a971cE2705F26723c81044Cb0",
    MATIC_MAINNET_FACTORY_ADDRES: "0x701931758cB94F9AA684e13f710F5e4B85Bb94F2",
    MATIC_MAINNET_MINTER_ADDRESS: "0x781F15a23506CF28539EA057e3f33008E6339E49",
    MATIC_MAINNET_DIAMOND_FACTORY_ADDRESS: "0x9498b23e964760364435C23c793e9352Ff4E2200",
    MATIC_MAINNET_DIAMOND_MARKETPLACE_ADDRESS: "0x51eA5316F2A9062e1cAB3c498cCA2924A7AB03b1",
    ETHEREUM_MAINNET_FACTORY_ADDRESS: "0xC9eF9902fa24923A17326aDdb7da0E67fF46692a",
    ETHEREUM_MAINNET_MINTER_ADDRESS: "0x0Ce668D271b8016a785Bf146e58739F432300B12",
    SYNC_CONTRACT_REPEAT_EVERY: "5",
    SYNC_CONTRACT_TASK_INTERVAL: "5",
    IPFS_SERVICE: "",
    IPFS_GATEWAY: "",
    IPFS_API: "",
    MONGO_LOG_COLLECTION: "",
    LOG_LEVEL: "",
    TEST_BSCSCAN_GATEWAY: "https://testnet.bscscan.com/token",
    TEST_POLYGONSCAN_GATEWAY: "https://mumbai.polygonscan.com/token",
    TEST_ETHERSCAN_GATEWAY: "https://goerli.etherscan.io/token",
    POLYGONSCAN_GATEWAY: "https://polygonscan.com/token",
    ETHERSCAN_GATEWAY: "https://etherscan.io/token",
    BSCSCAN_GATEWAY: "https://bscscan.com/token",
    MORALIS_SERVER_TEST: "",
    MORALIS_SERVER_MAIN: "https://y14jhwis7uao.moralishost.com:2053/server",
    MORALIS_API_KEY_TEST: "",
    MORALIS_API_KEY_MAIN: "1fwzRnhKfABUG6v8PBgsQlRmbdKsgjLKqvmPMZEn",
    MORALIS_MASTER_KEY_TEST: "",
    MORALIS_MASTER_KEY_MAIN: "",
    GENERATE_MONGO_URI_WITH_VAULT_CREDENTIAL_UTIL: true,
    MONGO_DB_HOSTNAME: local.MONGO_DB_HOSTNAME,
    MONGO_DB_NAME: local.MONGO_DB_NAME,
    USE_X509_CERT_AUTH: true,
    VAULT_URL: local.vault_url,
  }
   media_service_configmap = {
    PRODUCTION: "true",
    PINATA_KEY: "aaa581a498f99ed85279",
    ADMIN_NETWORK: "matic",
    ADMIN_CONTRACT: "0xe5a9efb29b82517166fcef23722452543b5f380f",
    INFURA_PROJECT_ID: "92a88973a28d41318792f77451db4c5b",
    SERVICE_HOST: "dev.rair.market",
    DEFAULT_PRODUCT_COVER: "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW",
    GCP_PROJECT_ID: "rair-market",
    GCP_IMAGE_BUCKET_NAME: "rair_images",
    GCP_VIDEO_BUCKET_NAME: "rair-videos",
    GCP_GATEWAY: "https://storage.googleapis.com",
    IPFS_SERVICE: "pinata",
    IPFS_GATEWAY: "http://rairipfs:8080/ipfs",
    PINATA_GATEWAY: "https://rair.mypinata.cloud/ipfs",
    BINANCE_FACTORY_ADDRESS: "0xb173E2F7eD8Bb697e70b02Ed38faaa2319dB3C23",
    BINANCE_MINTER_ADDRESS: "0xcBA6014452e82eBF98fA2748BBD46f1733a13AdD",
    GOERLI_FACTORY_ADDRESS: "0xF9DC1787179c1404910adE194A5087cEbD5c4717",
    GOERLI_MINTER_ADDRESS: "0x14ef15A945b6Cae28f4FA3862E41d74E484Cd3B5",
    MATIC_MUMBAI_FACTORY_ADDRESS: "0xB8083810Fa33e7Ebd777c8cd6eBB453948aFd354",
    MATIC_MUMBAI_MINTER_ADDRESS: "0x4594D508cDa05D016571082d467889f4629e1f56",
    MATIC_MAINNET_FACTORY_ADDRESS: "0x9bB24e68d952Ab872b0421297E0cda8D89B2390B",
    MATIC_MAINNET_MINTER_ADDRESS: "0x781F15a23506CF28539EA057e3f33008E6339E49",
    ETHEREUM_MAINNET_FACTORY_ADDRESS: "0xC9eF9902fa24923A17326aDdb7da0E67fF46692a",
    ETHEREUM_MAINNET_MINTER_ADDRESS: "0x0Ce668D271b8016a785Bf146e58739F432300B12",
    MATIC_TESTNET_RPC: "https://polygon-mumbai.infura.io/v3/92a88973a28d41318792f77451db4c5b",
    MATIC_MAINNET_RPC: "https://polygon-mainnet.infura.io/v3/92a88973a28d41318792f77451db4c5b",
    ETHEREUM_MAINNET_RPC: "https://mainnet.infura.io/v3/92a88973a28d41318792f77451db4c5b",
    ETHEREUM_TESTNET_GOERLI_RPC: "https://goerli.infura.io/v3/92a88973a28d41318792f77451db4c5b",
    BINANCE_TESTNET_RPC: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    BINANCE_MAINNET_RPC: "https://bsc-dataseed.binance.org/",
    MONGO_LOG_COLLECTION: "Log",
    LOG_LEVEL: "debug",
    MORALIS_SERVER_TEST: "https://ldz2lkdhowt1.usemoralis.com:2053/server",
    MORALIS_SERVER_MAIN: "https://y14jhwis7uao.moralishost.com:2053/server",
    MORALIS_API_KEY_TEST: "1fwzRnhKfABUG6v8PBgsQlRmbdKsgjLKqvmPMZEn",
    MORALIS_MASTER_KEY_TEST: "P3bQyDqkU5NU80xt2lTg3jGDaFP2KN0XkbtxpNV5",
    MORALIS_MASTER_KEY_TEST: "P3bQyDqkU5NU80xt2lTg3jGDaFP2KN0XkbtxpNV5",
    SESSION_SECRET: "testsecret",
    SESSION_TTL: "12"
    GENERATE_MONGO_URI_WITH_VAULT_CREDENTIAL_UTIL: true
    MONGO_DB_HOSTNAME: local.MONGO_DB_HOSTNAME,
    MONGO_DB_NAME: local.MONGO_DB_NAME,
    USE_X509_CERT_AUTH: true,
    VAULT_URL: local.vault_url,
    VAULT_BLOCKCHAIN_NETWORK_APP_ROLE_ID: "32c9d603-bba7-28e1-7e23-b8741f208dd9",
    VAULT_BLOCKCHAIN_NETWORK_APP_ROLE_SECRET_ID: "dcb29f8c-58c4-b5a0-a0eb-63624a594291"
  }
}