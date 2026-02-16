export const DI_TOKENS = {
  HTTP_CLIENT: Symbol("HttpClient"),
  THIRDWEB_CONTRACT_EVENTS_GATEWAY: Symbol("ThirdwebContractEventsGateway"),
  MORALIS_TOKEN_TRANSFERS_GATEWAY: Symbol("MoralisTokenTransfersGateway"),
  TOKEN_DEPLOYMENT_REPOSITORY: Symbol("TokenDeploymentRepository"),
  ERC20_ADAPTER: Symbol("Erc20Adapter"),
  REGISTRY_ADAPTER: Symbol("RegistryAdapter"),
  SPONSOR_ADAPTER: Symbol("SponsorAdapter")
} as const;
