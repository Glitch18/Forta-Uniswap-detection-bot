import { Finding, HandleTransaction, TransactionEvent, FindingSeverity, FindingType } from "forta-agent";
import { isUniSwapPool, getPoolInfo, SWAP_EVENT } from "./utils";

export function provideHandleTransaction(swapEvent: string): HandleTransaction {
  return async (txEvent: TransactionEvent) => {
    const findings: Finding[] = [];

    // filter the transaction logs for Swap event
    const swapEvents = txEvent.filterLog(swapEvent);

    for (const sEvent of swapEvents) {
      if (await isUniSwapPool(sEvent.address)) {
        const { sender, amount0, amount1 } = sEvent.args;
        const { token0, token1, fee } = await getPoolInfo(sEvent.address);
        // const { token0, token1, fee } = { token0: "1", token1: "2", fee: 3 };

        findings.push(
          Finding.fromObject({
            name: "UniSwap Swap Event",
            description: `UniSwap Swap detected at Pool ${sEvent.address}`,
            alertId: "USWP-1",
            severity: FindingSeverity.Info,
            type: FindingType.Info,
            metadata: {
              sender: sender,
              amount0: amount0.toString(),
              amount1: amount1.toString(),
              pool: sEvent.address,
              token0: token0,
              token1: token1,
              fee: fee.toString(),
            },
          })
        );
      }
    }

    return findings;
  };
}

export default {
  handleTransaction: provideHandleTransaction(SWAP_EVENT),
};
