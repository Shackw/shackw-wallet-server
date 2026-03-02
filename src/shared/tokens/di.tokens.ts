export const DI_TOKENS = {
  THIRDWEB_GATEWAY: Symbol("ThirdwebGateway"),
  MORALIS_GATEWAY: Symbol("MoralisGateway"),
  ERC20_ADAPTER: Symbol("Erc20Adapter"),
  REGISTRY_ADAPTER: Symbol("RegistryAdapter"),
  SPONSOR_ADAPTER: Symbol("SponsorAdapter"),
  TOKEN_DEPLOYMENT_REPOSITORY: Symbol("TokenDeploymentRepository")
} as const;
