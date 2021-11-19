import { useCallback, useEffect, useState, useRef } from 'react';
import { getSpinsAlpacaWheel, GameApi } from 'api/casino-games';
import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import BaseContainerWithNavbar from 'components/BaseContainerWithNavbar';
import PlaceBet from 'components/PlaceBet';
import PlaceBetCasino from 'components/PlaceBetCasino';
import BackLink from 'components/BackLink';
import Spins from 'components/Spins';
import GameAnimation from 'components/PlinkoGameAnimation';
import GameBets from 'components/GameBets';
import Chat from 'components/Chat';
import useRosiData from 'hooks/useRosiData';
import styles from './styles.module.scss';
import { AlertActions } from '../../store/actions/alert';
import { RosiGameActions } from '../../store/actions/rosi-game';
import ContentFooter from 'components/ContentFooter';
import ChatMessageType from 'components/ChatMessageWrapper/ChatMessageType';
import { ChatActions } from 'store/actions/chat';
import Share from '../../components/Share';
import PopupTheme from 'components/Popup/PopupTheme';
import Icon from 'components/Icon';
import IconType from 'components/Icon/IconType';
import IconTheme from 'components/Icon/IconTheme';
import { PopupActions } from 'store/actions/popup';
import TabOptions from '../../components/TabOptions';
import Routes from 'constants/Routes';
import { getGameById } from '../../helper/Games';
import { GAMES } from '../../constants/Games';
import EventActivitiesTabs from 'components/EventActivitiesTabs'
import {
  trackAlpacaWheelPlaceBetGuest,
  trackAlpacaWheelPlaceBet,
  trackAlpacaWheelCashout,
} from '../../config/gtm';
import { UserActions } from 'store/actions/user';

const PLINKO_GAME_EVENT_ID = GAMES.plinko.id

const PlinkoGame = ({
  showPopup,
  connected,
  userId,
  token,
  refreshHighData,
  updateUserBalance
}) => {

  const Api = new GameApi(GAMES.plinko.url, token);
  const dispatch = useDispatch();
  const {
    lastCrashes,
    inGameBets,
    cashedOut,
    hasStarted,
    isEndgame,
  } = useRosiData();
  const [audio, setAudio] = useState(null);
  const [spins, setSpins] = useState([]);
  const [risk, setRisk] = useState(1);
  const [bet, setBet] = useState({pending: true, ball: 0});
  const [amount, setAmount] = useState(50);
  const [activityTabIndex, setActivityTabIndex] = useState(0);

  const isMiddleOrLargeDevice = useMediaQuery('(min-width:769px)');
  const [chatTabIndex, setChatTabIndex] = useState(0);
  const chatTabOptions = [{ name: 'CHAT', index: 0 }];

  const handleHelpClick = useCallback(event => {
    showPopup(PopupTheme.explanation);
  }, []);

  const GAME_TYPE_ID = GAMES.plinko.id;

  useEffect(() => {
    /*
    getSpinsAlpacaWheel(PLINKO_GAME_EVENT_ID)
      .then(response => {
        console.log("response", response)
        const lastSpins = response?.data.lastCrashes;
        setSpins(lastSpins.map((spin)=> {
          if(spin.profit > 0) {
            return {
              type: 'win',
              value: '+' + spin.profit
            };
          } else {
            return {
              type: 'loss',
              value: spin.profit
            };
          }
        }))

      })
      .catch(error => {
        dispatch(AlertActions.showError(error.message));
      });
      */

  }, [])

  useEffect(() => {
    dispatch(ChatActions.fetchByRoom({ roomId: PLINKO_GAME_EVENT_ID }));
    //refreshHighData();
    //refreshLuckyData();

  }, [dispatch, connected]);

  const handleChatSwitchTab = option => {
    setChatTabIndex(option.index);
  };

  const hasAcceptedTerms = () => {
    return localStorage.getItem('acceptedTerms') || false;
  };

  const isPopupDisplayed = () => {
    return localStorage.getItem('gameHowDoesItWorkTip') || false;
  };
  async function handleBet(payload) {
    audio.playBetSound();
    if (!payload) return;
    try {
      if(payload.demo) {
        const array = Array.from({length: 12}, ()=> Math.round(Math.random()))
        /*
        let winMultiplier = 6
        for(let number of array){
          number === 1 ? winMultiplier -1 : winMultiplier + 1
        }
        */
        setBet((bet)=>{return{...payload, ball: bet.ball+1, path: array }})
        //trackAlpacaWheelPlaceBetGuest({ amount: payload.amount, multiplier: risk });
      } else {
        const { data } = await Api.createTradePlinko(payload);
        setBet((bet)=>{return{...payload, ball: bet.ball+1, path: data.path, profit: data.profit, winMultiplier: data.winMultiplier}});
        updateUserBalance(userId);
        //trackAlpacaWheelPlaceBet({ amount: payload.amount, multiplier: risk });
        //trackAlpacaWheelCashout({ amount: data.reward, multiplier: data.winMultiplier, result: data.gameResult });
        return data;
      }
    } catch (e) {
      dispatch(
        AlertActions.showError({
          message: 'Plinko: Place Bet failed',
        })
      );
    }
  }

  const renderActivities = () => (
    <Grid item xs={12} md={6}>
      <EventActivitiesTabs
          activitiesLimit={50}
          className={styles.activitiesTrackerGamesBlock}
          preselectedCategory={'game'}
          gameId={GAME_TYPE_ID}></EventActivitiesTabs>
    </Grid>
  );

  const renderChat = () => (
    <Grid item xs={12} md={6}>
      <div className={styles.chatWrapper}>
        <TabOptions options={chatTabOptions} className={styles.tabLayout}>
          {option => (
            <div
              className={
                option.index === chatTabIndex
                  ? styles.tabItemSelected
                  : styles.tabItem
              }
              onClick={() => handleChatSwitchTab(option)}
            >
              {option.name}
            </div>
          )}
        </TabOptions>
        <Chat
          roomId={PLINKO_GAME_EVENT_ID}
          className={styles.chatContainer}
          chatMessageType={ChatMessageType.game}
        />
      </div>
    </Grid>
  );

  const renderBets = () => (
    <GameBets
      label="Cashed Out"
      bets={[
        ...inGameBets.map(b => ({
          ...b,
          cashedOut: false,
        })),
        ...cashedOut.map(b => ({
          ...b,
          cashedOut: true,
        })),
      ]}
      gameRunning={hasStarted}
      endGame={isEndgame}
    />
  );

  const renderWallpaperBanner = () => {
    return (
      <Link data-tracking-id="alpacawheel-wallpaper" to={Routes.elonWallpaper}>
        <div className={styles.banner}></div>
      </Link>
    );
  };


  const handleNewSpin = (newSpin)=> {
    setSpins([newSpin, ...spins])
  }
  return (
    <BaseContainerWithNavbar withPaddingTop={true}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.headlineWrapper}>
            <BackLink to="/games" text="Plinko" />
            <Share popupPosition="right" className={styles.shareButton} />
            <Icon
              className={styles.questionIcon}
              iconType={IconType.question}
              iconTheme={IconTheme.white}
              height={25}
              width={25}
              onClick={handleHelpClick}
            />
            {/*}
            <span
              onClick={handleHelpClick}
              className={styles.howtoLink}
              data-tracking-id="alpacawheel-how-does-it-work"
            >
              How does it work?
            </span>
            */}
          </div>

          <div className={styles.mainContainer}>
            <div className={styles.leftContainer}>
              <GameAnimation
                setSpins={handleNewSpin}
                inGameBets={inGameBets}
                risk={risk}
                bet={bet}
                amount={amount}
                setBet={setBet}
                onInit={audio => setAudio(audio)}
              />
              {false && <Spins text="My Spins" spins={spins} />}
            </div>
            <div className={styles.rightContainer}>
              <div className={styles.placeContainer}>
                <PlaceBetCasino
                  gameName={'plinko'}
                  connected={connected}
                  setAmount={setAmount}
                  amount={amount}
                  setRisk={setRisk}
                  risk={risk}
                  onBet={handleBet}
                  bet={bet}
                />
                {/*isMiddleOrLargeDevice ? renderBets() : null*/}
              </div>
            </div>
          </div>
          {/*isMiddleOrLargeDevice ? null : renderBets()*/}
          {isMiddleOrLargeDevice ? (
            <div className={styles.bottomWrapper}>
              {renderChat()}
              {renderActivities()}
            </div>
          ) : null}
          {/*isMiddleOrLargeDevice && renderWallpaperBanner()*/}

        </div>
      </div>
    </BaseContainerWithNavbar>
  );
};

const mapStateToProps = state => {
  return {
    connected: state.websockets.connected,
    userId: state.authentication.userId,
    token: state.authentication.token,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    hidePopup: () => {
      dispatch(PopupActions.hide());
    },
    showPopup: (popupType, options) => {
      dispatch(
        PopupActions.show({
          popupType,
          options,
        })
      );
    },
    updateUserBalance: (userId) => {
      dispatch(UserActions.fetch({ userId, forceFetch: true }));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlinkoGame);
