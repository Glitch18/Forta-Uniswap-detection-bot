import {
  Finding,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType,
  getEthersProvider,
} from "forta-agent";
import { isUniSwapPool, SWAP_EVENT } from "./utils";

export function provideHandleTransaction(swapEvent: string): HandleTransaction {
  return async (txEvent: TransactionEvent) => {
    const findings: Finding[] = [];

    // filter the transaction logs for createAgent functions from Forta contract
    const swapEvents = txEvent.filterLog(swapEvent);

    swapEvents.forEach(async (sEvent) => {
      // Verify that the Swap happened on UniSwap
      // by checking weather the Pool was deployed by UniSwapV3Factory
      const result = await isUniSwapPool(sEvent.address);
    });

    return findings;
  };
}

export default {
  handleTransaction: provideHandleTransaction(SWAP_EVENT),
};
