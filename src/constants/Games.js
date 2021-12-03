import IconType from '../components/Icon/IconType';
import RosiImg from '../data/backgrounds/games/elon-game-banner.png';
import First from '../data/backgrounds/games/game1-bg.png';
import Second from '../data/backgrounds/games/game2-bg.png';
import Third from '../data/backgrounds/games/game3-bg.png';
import Fourth from '../data/backgrounds/games/game4-bg.png';
import Fifth from '../data/backgrounds/games/game5-bg.png';
import Sixth from '../data/backgrounds/games/game6-bg.png';
import Seventh from '../data/backgrounds/games/game7-bg.png';
import Eight from '../data/backgrounds/games/game8-bg.png';
import AlpacaWheel from '../data/backgrounds/games/game-alpacawheel.png';
import Plinko from '../data/backgrounds/games/game-plinko.png';
import PumpDump from '../data/backgrounds/games/game-pump-dump.png';
import Routes from './Routes';

import gameCardElon from '../data/images/house-games/card-elon.png';
import gameCard1 from '../data/images/house-games/card-1.png';
import gameCard5 from '../data/images/house-games/card-5.png';
import gameCardPumpDump from '../data/images/house-games/card-pumpdump.png';
import gameCard4 from '../data/images/house-games/card-4.png';
import gameCardMines from '../data/images/house-games/card-mines.png';
import gameCardAlpacannon from '../data/images/house-games/card-alpacannon-soon.png';

export const CASINO_GAMES = [
  {
    background: RosiImg,
    title: '',
    subtitle: '',
    description: '',
    active: true,
    linkTo: Routes.elonGame,
    infoIcon: {
      iconType: IconType.info,
      content: (
        <div>
          <p>
            <strong>What is Elon Game?</strong>
          </p>
          <p>&nbsp;</p>
          <p>
            The Elon Game is a crash game which promises pure fun and
            excitement, every fall counts!
          </p>
          <p>
            When you start playing it you enter a bet amount. The crash coin
            will go up till it crashes at some random time.
          </p>
          <p>
            In Elon Game, the longer the coin flies, the higher the chance that
            it will crash. If you cash out before the coin explodes, your bet
            will be multiplied by the current number the graph has by the time
            you cash out. If you do not cash out before the graph crashes, you
            will lose your bet.
          </p>
        </div>
      ),
    },
  },
];

export const NEW_SLOTS_GAMES = [
  {
    background: gameCardElon,
    title: `Elon Game`,
    subtitle: '',
    active: true,
    linkTo: '/games/elon-game',
  },
  {
    background: gameCardPumpDump,
    title: `Pump and Dump`,
    subtitle: '',
    active: true,
    linkTo: '/games/pump-dump',
  },
  {
    background: gameCardMines,
    title: `Mines`,
    subtitle: '',
    active: true,
    linkTo: '/games/mines',
  },
  {
    background: gameCard4,
    title: 'Plinko',
    subtitle: '',
    description: '',
    active: true,
    linkTo: '/games/plinko',
  },
  {
    background: gameCard1,
    title: 'Alpaca Wheel',
    subtitle: '',
    description: '',
    active: true,
    linkTo: '/games/alpaca-wheel',
  },
  {
    background: gameCard5,
    title: `Oil Rush`,
    subtitle: '',
    active: false,
    linkTo: '/games/oilrush',
  },
  {
    background: gameCardAlpacannon,
    title: `AlpaCannon`,
    subtitle: '',
    active: false,
    linkTo: '/games/alpacannon',
  },
  /*,
  {
    background: Fourth,
    title: 'Financial Poker',
    subtitle: '',
    description:
      'Bring your poker face and portfolio management skills to live financial poker',
    active: false,
    linkTo: '',
  },
  {
    background: Fifth,
    title: 'Candle Stick',
    subtitle: '',
    description:
      'Game and learn candlestick trading strategy in this jackpot tournament',
    active: false,
    linkTo: '',
  },
  {
    background: First,
    title: 'Midas Trader',
    subtitle: '',
    description: 'Market 1X2 – you know where the prices are going? Prove it!',
    active: false,
    linkTo: '',
  },*/
];

export const SLOTS_GAMES = [
  {
    background: Second,
    title: 'Treasure Island',
    subtitle: '',
    description: 'Market top and flop jackpot tournament',
    active: false,
    linkTo: '',
  },
  {
    background: Third,
    title: 'Market Runner',
    subtitle: '',
    description:
      'Jump and run on each price tick, are you heading north, south or staying put?',
    active: false,
    linkTo: '',
  },
  {
    background: Fourth,
    title: 'Financial Poker',
    subtitle: '',
    description:
      'Bring your poker face and portfolio management skills to live financial poker',
    active: false,
    linkTo: '',
  },
  {
    background: Fifth,
    title: 'Candle Stick',
    subtitle: '',
    description:
      'Game and learn candlestick trading strategy in this jackpot tournament',
    active: false,
    linkTo: '',
  },
  {
    background: First,
    title: 'Midas Trader',
    subtitle: '',
    description: 'Market 1X2 – you know where the prices are going? Prove it!',
    active: false,
    linkTo: '',
  },
];

export const SPORTS_BETTING_GAMES = [
  {
    background: Fifth,
    title: 'Esports',
    subtitle: '',
    description: '',
    active: false,
    linkTo: '',
  },
  {
    background: Sixth,
    title: 'Baseball',
    subtitle: '',
    description: '',
    active: false,
    linkTo: '',
  },
  {
    background: Seventh,
    title: 'Football',
    subtitle: '',
    description: '',
    active: false,
    linkTo: '',
  },
  {
    background: Eight,
    title: 'Tennis',
    subtitle: '',
    description: '',
    active: false,
    linkTo: '',
  },
];
export const GAMES = {
  pumpDump: {
    id: '61817de6a9695acd029ffef3',
    slug: 'pump-dump',
    name: `Pump and Dump`,
    url: process.env.REACT_APP_CASINO_GAMES_BACKEND_URL
  },
  elonGame: {
    id: '614381d74f78686665a5bb76',
    slug: 'elon-game',
    name: `Elon Game`,
    url: process.env.REACT_APP_CASINO_GAMES_BACKEND_URL
  },
  alpacaWheel: {
    id: '618a81ded90fd22298859bc4',
    slug: 'alpaca-wheel',
    name: `Alpaca Wheel`,
    url: process.env.REACT_APP_CASINO_GAMES_BACKEND_URL,
    verificationTool: 'https://jsfiddle.net/fx1dev/ygtor6e4/show'
  },
  plinko: {
    id: '618a821bd90fd22298859bc5',
    slug: 'plinko',
    name: `Plinko`,
    url: process.env.REACT_APP_CASINO_GAMES_BACKEND_URL,
    verificationTool: 'https://jsfiddle.net/fx1dev/dgbh7p68/show'
  },
  mines: {
    id: '619cc432121e61d6f06338c9',
    slug: 'mines',
    name: `Mines`,
    url: process.env.REACT_APP_CASINO_GAMES_BACKEND_URL,
    verificationTool: 'https://jsfiddle.net/fx1dev/w5b6actu/show'
  },
  cannon: {
    id: '61a09b35121e61d6f06338ca',
    slug: 'cannon',
    name: 'cannon',
    url: process.env.REACT_APP_CASINO_GAMES_BACKEND_URL
  }
};


export const EXTERNAL_GAMES = [
  {
    GameCategory: 'JetX',
    GameName: 'JetX',
    intro: 'JetX is an innovative game created by SmartSoft. Despite the simplicity of the rules, the game is a very exciting. Once the player places the bet, the Jet starts to fly and the winning coefficient increases according to the altitude of the flight. The player can cash out at any time by clicking the "Collect” button. The win is determined by the multiplication of the bet made and the winning coefficient. If the jet explodes before the player collects the win, player loses. Players can make two parallel bets on one flight. The winnings may vary from 0 to infinity.',
  },
  {
    GameCategory: 'Games',
    GameName: 'Cappadocia',
    intro: 'Another amazing adventure to the perfect combination of ancient historical and unique cultural heritage. Cappadocia is waiting for you and you should take an opportunity for the breathtaking adventure - to fly over the  Khaki hills with hot-air balloons,  collect unforgettable memories, and unlimited winnings. A colorful journey to this magical place with the magical hot-air balloon is starting from now! This game is very special! Get ready for the new experience!',
  },
  {
    GameCategory: 'Games',
    GameName: 'Balloon',
  },
  {
    GameCategory: 'XGames',
    GameName: 'JetX3',
  },
  {
    GameCategory: 'Slots',
    GameName: 'Viking',
  },
  {
    GameCategory: 'Slots',
    GameName: 'Aztec',
  },
  {
    GameCategory: 'Slots',
    GameName: 'Birds',
  },
  {
    GameCategory: 'Slots',
    GameName: 'Casino',
  },
  {
    GameCategory: 'Slots',
    GameName: 'Galaxy',
  },
  {
    GameCategory: 'Slots',
    GameName: 'Cowboy',
  },
  {
    GameCategory: 'Slots',
    GameName: 'BookOfWin',
  },
  {
    GameCategory: 'Slots',
    GameName: 'Christmas',
  },
  {
    GameCategory: 'Slots',
    GameName: 'Sport',
  },
  {
    GameCategory: 'Slots',
    GameName: 'Dota',
  },
  {
    GameCategory: 'Slots',
    GameName: 'FunFruit',
  },
  {
    GameCategory: 'Slots',
    GameName: 'Pharaon',
  },
  {
    GameCategory: 'Slots',
    GameName: 'DonutCity',
  },

  {
    GameCategory: 'Slots',
    GameName: 'Samurai',
  },
  {
    GameCategory: 'Slots',
    GameName: 'Football',
  },
  {
    GameCategory: 'Slots',
    GameName: 'Argo',
  },
  {
    GameCategory: 'Slots',
    GameName: 'BankJob',
  },
  {
    GameCategory: 'Slots',
    GameName: 'MoonStone',
  },
  {
    GameCategory: 'Slots',
    GameName: 'Apollo',
  },
  {
    GameCategory: 'Slots',
    GameName: 'Evolution',
  }
];
