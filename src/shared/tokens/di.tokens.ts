export const DI_TOKENS = {
  THIRDWEB_API_GATEWAY: Symbol("ThirdwebApiGateway"),
  MORALIS_API_GATEWAY: Symbol("MoralisApiGateway"),
  ERC20_ADAPTER: Symbol("Erc20Adapter"),
  REGISTRY_ADAPTER: Symbol("RegistryAdapter"),
  SPONSOR_ADAPTER: Symbol("SponsorAdapter"),
  TOKEN_DEPLOYMENT_REPOSITORY: Symbol("TokenDeploymentRepository")
} as const;
