import type { Address } from 'viem';

enum ContractType {
  ROUTER = 'ROUTER',
  HELPER = 'HELPER',
  RESOLVER = 'RESOLVER',
  VAULT = 'VAULT',
}
type ContractAddress = {
  [key in ContractType]: Address;
};
export const CONTRACT_ADDRESS: ContractAddress = {
  ROUTER: '0x6aC8Bab8B775a03b8B72B2940251432442f61B94',
  HELPER: '0x89E4bE1F999E3a58D16096FBe405Fc2a1d7F07D6',
  RESOLVER: '0x535c5fdf31477f799366df6e4899a12a801cc7b8',
  VAULT: '0x4ca9fb1f302b6bd8421bad9debd22198eb6ab723',
};
