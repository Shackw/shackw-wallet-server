export const DI_TOKENS = {
  QUOTE_TOKEN_SECRET: Symbol("QUOTE_TOKEN_SECRET"),
  FIREBASE_CLIENT: Symbol("FirebaseClient"),
  APP_CHECK_ADAPTER: Symbol("AppCheckAdapter"),
  ERC20_ADAPTER: Symbol("Erc20Adapter"),
  REGISTRY_ADAPTER: Symbol("RegistryAdapter"),
  SPONSOR_ADAPTER: Symbol("SponsorAdapter"),
  THIRDWEB_GATEWAY: Symbol("ThirdwebGateway"),
  MORALIS_GATEWAY: Symbol("MoralisGateway"),
  TOKEN_DEPLOYMENT_REPOSITORY: Symbol("TokenDeploymentRepository")
} as const;
