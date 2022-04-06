## CubanSea

#### Local setup

To run this project locally for development, follow these steps.

1. Clone the project locally, change into the directory, and install the dependencies:

```sh
git clone https://github.com/parenthesislab/cubansea.git

cd cubansea

# install using NPM or Yarn
npm install

# or

yarn
```

2. Start the local Hardhat node

```sh
npx hardhat node
```

3. With the network running, deploy the contracts to the local network in a separate terminal window

```sh
npx hardhat run scripts/deploy.js --network localhost
```

4. Start the app

```sh
npm run dev
```

#### Tech Stack *(Talk Nerdy To Me)*
- Built on [Next.js](https://nextjs.org/)
- Using:
  - [Hardhat](https://hardhat.org/) for Ethereum development environment
  - [Infura](https://infura.io/) for Ethereum & IPFS APIs connection
    - Currently developing on top of the [Polygon (MATIC)](https://polygon.technology/) - [Testnet (Mumbai)](https://mumbai.polygonscan.com/) blockchain network 
  - [OpenZeppelin](https://openzeppelin.com/contracts/) for smart contracts
  - [The Graph Hosted Service](https://thegraph.com/hosted-service/) to index data from smart contracts and perform [GraphQL queries](https://thegraph.com/docs/en/developer/graphql-api/) for easier data fetching and filtering
  - [URQL](https://formidable.com/open-source/urql/) for GraphQL queries
  - [Axios](https://axios-http.com/) for NFT tokens metadata feching from IPFS
  - [Prisma ORM](https://www.prisma.io/) with [Heroku Postgres](https://www.heroku.com/postgres) database to create user profiles for connected wallet addresses
  - [React Icons](https://react-icons.github.io/react-icons) for some icons
  - [React-toastify](https://fkhadra.github.io/react-toastify) for some toast notifications
  - [Web3Modal](https://github.com/Web3Modal/web3modal) for wallet connection and management for multiple providers
  - [Tailwind CSS](https://tailwindcss.com/) for frontend interface components and styling
- Hosted on [Vercel](https://vercel.com/)

PD: Just for fun and learning purposes about Web3 development :)
![residente-rene](https://user-images.githubusercontent.com/3847077/162064580-b2e617af-92b0-4cb2-a1af-7341aef97895.gif)
