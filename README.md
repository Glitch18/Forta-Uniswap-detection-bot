# UniSwap Swap Detection Bot

## Description

This bot detects Swaps happening on UniSwap

## Supported Chains

- Ethereum

## Alerts

Describe each of the type of alerts fired by this agent

- USWP-1
  - Fired when a Swap happens on UniSwap
  - Has severity of "Info"
  - Has type of "Info"
  - Includes the following metadata:
    - sender
    - amount0
    - amount1
    - pool
    - token0
    - token1
    - fee

## Test Data

The agent behaviour can be verified with the following transactions:

- [0x0753d99d5195d90991493b5596e49ba03b6defc6b5fe1881f8aa6feca875b801](https://etherscan.io/tx/0x0753d99d5195d90991493b5596e49ba03b6defc6b5fe1881f8aa6feca875b801)
- More examples can be found [here](https://info.uniswap.org/#/pools).
