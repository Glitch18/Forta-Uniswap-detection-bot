import { getEthersProvider, ethers } from "forta-agent";
import { UNISWAP_POOL_ABI } from "./abis/poolAbi";

export const SWAP_EVENT =
  "event Swap (address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)";
export const UNISWAP_V3_FACTORY = "0x1F98431c8aD98523631AE4a59f267346ea31F984";

export async function isUniSwapPool(poolAddress: string) {
  const contract = new ethers.Contract(poolAddress, UNISWAP_POOL_ABI, getEthersProvider());

  let factoryAddress: string;

  try {
    factoryAddress = await contract.factory();
  } catch {
    throw new Error("Invalid Pool");
  }

  return factoryAddress === UNISWAP_V3_FACTORY;
}
