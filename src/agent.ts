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

    // filter the transaction logs for Swap event
    const swapEvents = txEvent.filterLog(swapEvent);

    for (const sEvent of swapEvents) {
      if (await isUniSwapPool(sEvent.address)) {
        console.log("In condition");
      }
    }

    return findings;
  };
}

export default {
  handleTransaction: provideHandleTransaction(SWAP_EVENT),
};
