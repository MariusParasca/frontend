import AllIcon from '../data/icons/events-all-icon.svg';
import VegasIcon from '../data/icons/vegas.svg';

export const ACTIVITIES_TO_TRACK = [
  {
    value: 'all',
    category: 'All',
    image: AllIcon,
  },
  {
    value: 'bets',
    category: 'Bets',
    image: VegasIcon,
    eventsCats: [
      'Notification/EVENT_ONLINE',
      'Notification/EVENT_OFFLINE',
      'Notification/EVENT_NEW',
      'Notification/EVENT_NEW_BET',
      'Notification/EVENT_BET_PLACED',
      'Notification/EVENT_BET_CASHED_OUT',
      'Notification/EVENT_BET_RESOLVED',
      'Notification/EVENT_BET_CANCELED',
      'Notification/EVENT_BET_EVALUATED',
    ],
  },
  {
    value: 'users',
    category: 'Users',
    image: VegasIcon,
    eventsCats: [
      `Notification/EVENT_USER_SIGNED_IN`,
      `Notification/EVENT_USER_SIGNED_UP`,
      'Notification/EVENT_USER_REWARD',
      'Notification/EVENT_USER_UPLOADED_PICTURE',
      'Notification/EVENT_USER_CHANGED_USERNAME',
      'Notification/EVENT_USER_CHANGED_NAME',
      'Notification/EVENT_USER_CHANGED_ABOUT_ME',
    ],
  },
  {
    value: 'elongame',
    category: 'Elon game',
    image: VegasIcon,
    eventsCats: ['Casino/CASINO_PLACE_BET', 'Casino/CASINO_CASHOUT'],
  },
];
