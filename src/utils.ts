import { getEthersProvider, ethers } from "forta-agent";
import { Contract } from "ethers";
import LRU from "lru-cache";
import { UNISWAP_POOL_ABI } from "./abis/poolAbi";

export const SWAP_EVENT =
  "event Swap (address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)";
export const UNISWAP_V3_FACTORY = "0x1F98431c8aD98523631AE4a59f267346ea31F984";

type PoolInfo = {
  token0: string;
  token1: string;
  fee: number;
};

class PoolContract {
  readonly pool: Contract;
  static infoCache: LRU<string, PoolInfo> = new LRU<string, PoolInfo>({ max: 100 });
  static factoryCache: LRU<string, string> = new LRU<string, string>({ max: 100 });
  readonly poolAddress;

  constructor(poolAddress: string) {
    this.pool = new ethers.Contract(poolAddress, UNISWAP_POOL_ABI, getEthersProvider());
    this.poolAddress = poolAddress;
  }

  async getInfo(): Promise<PoolInfo> {
    // Check if cache has the value for key
    if (PoolContract.infoCache.has(this.poolAddress)) {
      return PoolContract.infoCache.get(this.poolAddress) as PoolInfo;
    }

    // Key not present in cache, calculate new value
    let token0: string;
    let token1: string;
    let fee: number;

    try {
      token0 = await this.pool.token0();
      token1 = await this.pool.token1();
      fee = await this.pool.fee();
    } catch {
      throw new Error("Invalid Pool");
    }

    // Add new value into cache
    PoolContract.infoCache.set(this.poolAddress, { token0, token1, fee });
    return { token0, token1, fee };
  }

  async getFactoryAddress(): Promise<string> {
    // Check if cache has the value for key
    if (PoolContract.factoryCache.has(this.poolAddress)) {
      return PoolContract.factoryCache.get(this.poolAddress) as string;
    }

    // Value not present in cache, calculating new value
    let factoryAddress: string;
    try {
      factoryAddress = await this.pool.factory();
    } catch {
      throw new Error("Invalid Contract");
    }

    PoolContract.factoryCache.set(this.poolAddress, factoryAddress);
    return factoryAddress;
  }
}

export async function isUniSwapPool(poolAddress: string) {
  const poolObj = new PoolContract(poolAddress);
  const factoryAddress = await poolObj.getFactoryAddress();
  return factoryAddress === UNISWAP_V3_FACTORY;
}

export async function getPoolInfo(poolAddress: string) {
  const poolObj = new PoolContract(poolAddress);
  const poolInfo = await poolObj.getInfo();
  return poolInfo;
}
