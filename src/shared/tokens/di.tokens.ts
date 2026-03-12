export const DI_TOKENS = {
  FIREBASE_CLIENT: Symbol("FirebaseClient"),
  APP_CHECK_ADAPTER: Symbol("AppCheckAdapter"),
  ERC20_ADAPTER: Symbol("Erc20Adapter"),
  REGISTRY_ADAPTER: Symbol("RegistryAdapter"),
  SPONSOR_ADAPTER: Symbol("SponsorAdapter"),
  THIRDWEB_GATEWAY: Symbol("ThirdwebGateway"),
  MORALIS_GATEWAY: Symbol("MoralisGateway"),
  TOKEN_DEPLOYMENT_REPOSITORY: Symbol("TokenDeploymentRepository")
} as const;
