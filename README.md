#  Vaults Dapp

A Next.js application that allows deposit vaults on Arbitrum.

## Visuals and deployment

1. Install all dependencies `pnpm install`
1. Copy pase `.env.example` and rename it to `.env` and set proper env variables
1. Run project `pnpm run dev`
```

## Environment Variables

Required environment variables:
```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### Approval and Deposit Process

### Deposit Token
1. User connects wallet
2. Select vault and enters deposit amount in a calucated ratio

### Token Approval Process
1. Checks existing allowance against vault contract
2. If allowance insufficient, user need to increase allowance by clicing a button


### Deposit Process
1. Both token approvals must be completed
2. Deposit executed through Arrakis vault contract
3. Uses `addLiquidity` function with parameters:
   ```typescript
   {
     amount0Max: string      // max. deposit amount token0
     amount1Max: string      // max. deposit amount token1
     amount0Min: string      // min. deposit amount token0
     amount1Min: string      // min. deposit amount token1
     amountSharesMin: string // Minimum shares to receive
     vault: address          // Vault contract address
     receiver: address       // Address receiving the LP tokens - (User address)
     gauge: address          // zero address
   }
   ```


## The app was build using Arbitrum Smart Contract Addresses:
-  helper: 0x89E4bE1F999E3a58D16096FBe405Fc2a1d7F07D6 
-  router: 0x6aC8Bab8B775a03b8B72B2940251432442f61B94
-  resolver: 0x535c5fdf31477f799366df6e4899a12a801cc7b8

Arbitrum vault: 
0x4ca9fb1f302b6bd8421bad9debd22198eb6ab723, 
0xf06fda2664d1f88d19919e37034b92bf26896c61
