import { NetworkInfo } from '@/types';

const LOGO_FOLDER =
  'https://raw.githubusercontent.com/Koniverse/SubWallet-ChainList/master/packages/chain-list/src/logo';

export const SUPPORTED_NETWORKS: Record<string, NetworkInfo> = {
  rococo: {
    id: 'rococo',
    name: 'Rococo',
    logo: `${LOGO_FOLDER}/rococo.png`,
    provider: 'wss://rococo-rpc.polkadot.io',
    prefix: 42,
    symbol: 'ROC',
    decimals: 12,
    subscanUrl: 'https://rococo.subscan.io',
  },
  rococoAssetHub: {
    id: 'rococoAssetHub',
    name: 'Rococo Asset Hub',
    logo: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI3LjIuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA2NDAgNjQwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA2NDAgNjQwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6IzMyMUQ0Nzt9Cgkuc3Qxe2ZpbGw6I0ZGRkZGRjt9Cgkuc3Qye2ZpbGw6I0U2MDA3QTt9Cjwvc3R5bGU+CjxnPgoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTYzNy4zLDMxOS4zYzAsMTc1LjItMTQyLDMxNy4zLTMxNy4zLDMxNy4zUzIuNyw0OTQuNiwyLjcsMzE5LjNTMTQ0LjgsMi4xLDMyMCwyLjFTNjM3LjMsMTQ0LjEsNjM3LjMsMzE5LjN6IgoJCS8+Cgk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNDQ0LjIsMzkyLjRoLTY3LjZsLTEyLjctMzFoLTg1LjhsLTEyLjcsMzFoLTY3LjZsODAuOS0xODQuM2g4NC41TDQ0NC4yLDM5Mi40eiBNMzIxLjEsMjU2bC0yMi40LDU1aDQ0LjcKCQlMMzIxLjEsMjU2eiIvPgoJPGNpcmNsZSBjbGFzcz0ic3QyIiBjeD0iMzIxIiBjeT0iMTIyLjEiIHI9IjQ2LjkiLz4KCTxjaXJjbGUgY2xhc3M9InN0MiIgY3g9IjMyMSIgY3k9IjUxNy4xIiByPSI0Ni45Ii8+Cgk8Y2lyY2xlIGNsYXNzPSJzdDIiIGN4PSIxNDcuOCIgY3k9IjIxNiIgcj0iNDYuOSIvPgoJPGNpcmNsZSBjbGFzcz0ic3QyIiBjeD0iNDk0LjMiIGN5PSIyMTYiIHI9IjQ2LjkiLz4KCTxjaXJjbGUgY2xhc3M9InN0MiIgY3g9IjE0Ny44IiBjeT0iNDI0LjgiIHI9IjQ2LjkiLz4KCTxjaXJjbGUgY2xhc3M9InN0MiIgY3g9IjQ5NC4zIiBjeT0iNDI0LjgiIHI9IjQ2LjkiLz4KPC9nPgo8L3N2Zz4K',
    provider: 'wss://rococo-asset-hub-rpc.polkadot.io',
    prefix: 42,
    symbol: 'ROC',
    decimals: 12,
    subscanUrl: 'https://assethub-rococo.subscan.io',
  },
  westend: {
    id: 'westend',
    name: 'Westend',
    logo: `${LOGO_FOLDER}/westend.png`,
    provider: 'wss://westend-rpc.polkadot.io',
    prefix: 42,
    symbol: 'WND',
    decimals: 12,
    subscanUrl: 'https://westend.subscan.io',
  },
  westendAssetHub: {
    id: 'westendAssetHub',
    name: 'Westend Asset Hub',
    logo: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI3LjIuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA2NDAgNjQwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA2NDAgNjQwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6IzMyMUQ0Nzt9Cgkuc3Qxe2ZpbGw6I0ZGRkZGRjt9Cgkuc3Qye2ZpbGw6I0U2MDA3QTt9Cjwvc3R5bGU+CjxnPgoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTYzNy4zLDMxOS4zYzAsMTc1LjItMTQyLDMxNy4zLTMxNy4zLDMxNy4zUzIuNyw0OTQuNiwyLjcsMzE5LjNTMTQ0LjgsMi4xLDMyMCwyLjFTNjM3LjMsMTQ0LjEsNjM3LjMsMzE5LjN6IgoJCS8+Cgk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNDQ0LjIsMzkyLjRoLTY3LjZsLTEyLjctMzFoLTg1LjhsLTEyLjcsMzFoLTY3LjZsODAuOS0xODQuM2g4NC41TDQ0NC4yLDM5Mi40eiBNMzIxLjEsMjU2bC0yMi40LDU1aDQ0LjcKCQlMMzIxLjEsMjU2eiIvPgoJPGNpcmNsZSBjbGFzcz0ic3QyIiBjeD0iMzIxIiBjeT0iMTIyLjEiIHI9IjQ2LjkiLz4KCTxjaXJjbGUgY2xhc3M9InN0MiIgY3g9IjMyMSIgY3k9IjUxNy4xIiByPSI0Ni45Ii8+Cgk8Y2lyY2xlIGNsYXNzPSJzdDIiIGN4PSIxNDcuOCIgY3k9IjIxNiIgcj0iNDYuOSIvPgoJPGNpcmNsZSBjbGFzcz0ic3QyIiBjeD0iNDk0LjMiIGN5PSIyMTYiIHI9IjQ2LjkiLz4KCTxjaXJjbGUgY2xhc3M9InN0MiIgY3g9IjE0Ny44IiBjeT0iNDI0LjgiIHI9IjQ2LjkiLz4KCTxjaXJjbGUgY2xhc3M9InN0MiIgY3g9IjQ5NC4zIiBjeT0iNDI0LjgiIHI9IjQ2LjkiLz4KPC9nPgo8L3N2Zz4K',
    provider: 'wss://westend-asset-hub-rpc.polkadot.io',
    prefix: 42,
    symbol: 'ROC',
    decimals: 12,
    subscanUrl: 'https://assethub-westend.subscan.io',
  },
  polkadot: {
    id: 'polkadot',
    name: 'Polkadot',
    logo: `${LOGO_FOLDER}/polkadot.png`,
    provider: 'wss://rpc.polkadot.io',
    prefix: 0,
    symbol: 'DOT',
    decimals: 10,
    subscanUrl: 'https://polkadot.subscan.io',
  },
  kusama: {
    id: 'kusama',
    name: 'Kusama',
    logo: `${LOGO_FOLDER}/kusama.png`,
    provider: 'wss://kusama-rpc.polkadot.io',
    prefix: 2,
    symbol: 'KSM',
    decimals: 12,
    subscanUrl: 'https://kusama.subscan.io',
  },
  astar: {
    id: 'astar',
    name: 'Astar',
    logo: `${LOGO_FOLDER}/astar-network.png`,
    provider: 'wss://rpc.astar.network',
    prefix: 5,
    symbol: 'ASTR',
    decimals: 18,
    subscanUrl: 'https://astar.subscan.io',
  },
};
