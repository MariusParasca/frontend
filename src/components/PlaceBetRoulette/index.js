import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import ReactTooltip from 'react-tooltip';
import { AlertActions } from 'store/actions/alert';
import {
  selectHasStarted,
  selectGameOffline,
} from 'store/selectors/rosi-game';
import styles from './styles.module.scss';
import { formatToFixed } from '../../helper/FormatNumbers';
import { selectUser } from 'store/selectors/authentication';
import { PopupActions } from 'store/actions/popup';
import TokenNumberInput from 'components/TokenNumberInput';
import PopupTheme from '../Popup/PopupTheme';
import Input from '../Input';
import { round } from 'lodash/math';
import _ from 'lodash';
/*import {
  selectDisplayBetButton,
} from '../../store/selectors/rosi-game';*/
import ReactCanvasConfetti from 'react-canvas-confetti';
import InfoBox from 'components/InfoBox';
import IconType from '../Icon/IconType';
import AuthenticationType from 'components/Authentication/AuthenticationType';
import Timer from '../RosiGameAnimation/Timer';
import { TOKEN_NAME } from 'constants/Token';

const PlaceBetRoulette = ({
  connected,
  onBet,
  bet,
  setAmount,
  amount,
  setRisk,
  risk,
}) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const userBalance = parseInt(user?.balance || 0, 10);

  const [nspin, setNspin] = useState(1);
  const [profit, setProfit] = useState(0);
  const [loss, setLoss] = useState(0);
  const [crashFactor, setCrashFactor] = useState('25.00');
  const [crashFactorDirty, setCrashFactorDirty] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [canBet, setCanBet] = useState(true);
  const [nuspin, setNuspin] = useState({nspin: 0});
  const gameOffline = false//useSelector(selectGameOffline);
  const [wincrease, setWincrease] = useState(0)
  const [lincrease, setLincrease] = useState(0)
  const [lossbutton, setLossbutton] = useState(false)
  const [winbutton, setWinbutton] = useState(false)
  const [spinlimit, setSpinlimit] = useState(false)
  const [accumulated, setAccumulated] = useState(0)

  const userUnableToBet = amount < 1 || !canBet || gameOffline;

  const numberOfDemoPlays = Number(localStorage.getItem('numberOfElonGameDemoPlays')) || 0;
  const onTokenNumberChange = number => {
    setAmount(number);
  };

  const onGuestAmountChange = event => {
    let value = _.get(event, 'target.value', 0);
    const amount = round(value, 0);
    setAmount(amount <= 10000 ? amount : 10000);
  };
  const onGuestNspinChange = event => {
    let value = _.get(event, 'target.value', 0);
    const amount = round(value, 0);
    setNspin(amount);
  };

  const onBetAmountChanged = multiplier => {
    const changedValue = _.floor(amount * multiplier, 0);
    if (changedValue > 10000) {
      setAmount(10000);
    } else if (changedValue < 1) {
      setAmount(1);
    } else {
      setAmount(changedValue);
    }
  };

  const placeABet = async () => {
    if (userUnableToBet) return;
    if (amount > userBalance) return;
    const payload = {
      amount,
      nspin: nspin - 1,
      riskFactor: risk
    }
    setNuspin(payload)
    const bet = await onBet(payload)
  }

  const placeAutoBet = async () => {
    if (userUnableToBet) return;
    if (amount > userBalance) return;
    const payload = {
      amount,
      autobet: true,
      profit: Number(profit),
      loss: Number(loss),
      wincrease: winbutton?0:Number(wincrease)/100,
      lincrease: lossbutton?0:Number(lincrease)/100,
      nspin: spinlimit?Number(nspin-1):null,
      riskFactor: risk
    };
    setAccumulated(0)
    setNuspin(payload)
    const bet = await onBet(payload)
  };



  const placeGuestBet = () => {
    if (numberOfDemoPlays === 3) {
      showLoginPopup();
      return;
    }

    if (userUnableToBet) return;
    const payload = {
      amount,
      demo: true,
      nspin: nspin-1,
      riskFactor: risk,
      winIndex:  Math.floor((Math.random() * 12) | 0)
    };
    onBet(payload)
    setNuspin(payload)
    if (numberOfDemoPlays < 3) {
      localStorage.setItem('numberOfElonGameDemoPlays', numberOfDemoPlays + 1);
    }
  };
  useEffect(async () => {
    if(bet?.pending && nuspin.nspin > 0) {
      setNuspin({...nuspin, nspin: nuspin.nspin -1})
      await onBet({...nuspin, nspin: nuspin.nspin -1});
    }else if(bet?.pending && nuspin.autobet){
      const acc = bet.profit + accumulated
      setAccumulated(acc)
      if(nuspin.nspin === 0){
        const newamount = bet.profit > 0 ? Math.floor(winbutton ? amount : nuspin.amount*(1+nuspin.wincrease)) : Math.floor(lossbutton ? amount : nuspin.amount*(1+nuspin.lincrease))
        setNuspin({nspin: 0, amount: newamount})
        return;
      }
      if(nuspin.profit >= 0 && nuspin.profit > acc && nuspin.loss >= 0 && nuspin.loss > -acc){
        const newamount = bet.profit > 0 ? Math.floor(winbutton ? amount : nuspin.amount*(1+nuspin.wincrease)) : Math.floor(lossbutton ? amount : nuspin.amount*(1+nuspin.lincrease))
        setNuspin({...nuspin, amount: newamount, nspin: nuspin.nspin ? nuspin.nspin -1 : nuspin.nspin})
        await onBet({...nuspin, amount: newamount, nspin: nuspin.nspin ? nuspin.nspin -1 : nuspin.nspin});
      }
      else{
        setNuspin({nspin: 0});
      }
    }
  }, [bet])

  const cancelBet = e => {
    e.preventDefault();
    e.stopPropagation();
    setNuspin({nspin: 0})
  };

  const showLoginPopup = () => {
    dispatch(
      PopupActions.show({
        popupType: PopupTheme.auth,
        options: {
          small: true,
          authenticationType: AuthenticationType.register,
        },
      })
    );
  };

  const renderButton = () => {
    if (!nuspin.autobet && nuspin?.nspin <= 0) {
      return (
        <span
          role="button"
          tabIndex="0"
          className={classNames(styles.button, {
            [styles.buttonDisabled]:
              !connected ||
              userUnableToBet ||
              !bet?.pending ||
              (amount > userBalance && user.isLoggedIn),
            [styles.notConnected]: !connected,
          })}
          onClick={!bet?.pending? null : user.isLoggedIn ? (selector === 'manual' ? placeABet : placeAutoBet) : placeGuestBet }
          data-tracking-id={
            user.isLoggedIn ? 'alpacawheel-place-bet' : 'alpacawheel-play-demo'
          }
        >
          {user.isLoggedIn ? (selector === 'manual' ? 'Place Bet' : 'Start autobet') : 'Play Demo'}
        </span>
      );
    } else {
      return (
        <>
          <span
            role="button"
            tabIndex="0"
            className={classNames(styles.button, styles.cancel)}
            onClick={cancelBet}
            data-tracking-id={
              user.isLoggedIn ? null : 'alpacawheel-showloginpopup'
            }
          >
            Cancel Bet
          </span>
        </>
      )
    }
  };
  const renderMessage = () => {
    if (gameOffline) {
      return (
        <div
          className={classNames([
            styles.betInfo,
            !user.isLoggedIn ? styles.guestInfo : [],
          ])}
        >
          Waiting for connection...
        </div>
      );
    }
    if (!user.isLoggedIn) {
      return (
        <div className={classNames([styles.betInfo, styles.guestInfo])}>
          This is a simulated version. Signin to start playing.
        </div>
      );
    }
  };
  const [selector, setSelector] = useState('manual')

  const switchButton = () => {
    return (
      <div className={styles.selector}>
        <span className={styles.top} style={{ marginLeft: selector === 'manual' ? 0 : '46%' }}></span>
        <div className={classNames(styles.tab, styles.selected)} onClick={() => setSelector('manual')} >
          <span>Manual Bet</span>
        </div>
        <div className={classNames(styles.tab)} onClick={() => setSelector('auto')} >
          <span>Auto Bet</span>
        </div>
      </div>
    )
  }

  const canvasStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 999,
  };

  return (
    <div className={classNames(styles.container)}>
      <ReactCanvasConfetti
        style={canvasStyles}
        fire={animate}
        particleCount={300}
        spread={360}
        origin={{ x: 0.4, y: 0.45 }}
      />
      <div className={styles.inputContainer}>
        {/*<div className={styles.placeBetContainer}>
          <h2 className={styles.placebidTitle}>Place Bet</h2>
        </div>*/}
        {switchButton(styles)}
        {selector === 'manual' ?
          <div className={styles.sliderContainer}>
            <label className={styles.label}>Bet Amount</label>
            {user?.isLoggedIn ? (
              <TokenNumberInput
                value={amount}
                currency={user?.currency}
                setValue={onTokenNumberChange}
                minValue={1}
                decimalPlaces={0}
                maxValue={formatToFixed(
                  user.balance > 10000 ? 10000 : user.balance
                )}
                dataTrackingIds={{
                  inputFieldHalf: 'alpacawheel-input-field-half',
                  inputFieldDouble: 'alpacawheel-input-field-double',
                  inputFieldAllIn: 'alpacawheel-input-field-allin',
                }}
              />
            ) : (
              <div
                className={classNames(
                  styles.cashedOutInputContainer,
                  styles.demoInput
                )}
              >
                <Input
                  className={classNames(styles.input)}
                  type={'number'}
                  value={amount}
                  onChange={onGuestAmountChange}
                  step={0.01}
                  min="1"
                  max={'10000'}
                />
                <span className={styles.eventTokenLabel}>
                  <span>{TOKEN_NAME}</span>
                </span>
                <div className={styles.buttonWrapper}>
                  <span
                    className={styles.buttonItem}
                    data-tracking-id="alpacawheel-input-field-half"
                    onClick={() => onBetAmountChanged(0.5)}
                  >
                    ½
                  </span>
                  <span
                    className={styles.buttonItem}
                    data-tracking-id="alpacawheel-input-field-double"
                    onClick={() => onBetAmountChanged(2)}
                  >
                    2x
                  </span>
                  <span
                    className={styles.buttonItem}
                    data-tracking-id="alpacawheel-input-field-allin"
                    onClick={() => setAmount(10000)}
                  >
                    Max
                  </span>
                </div>
              </div>
            )}
            <div className={styles.inputContainer}>
              <label
                className={classNames(
                  styles.label,
                )}
              >
                Choose Risk Level
              </label>
              <div className={styles.riskSelection}>
                <button
                  data-tracking-id="alpacawheel-change-risk-1"
                  style={{ background: risk === 1 && 'rgba(128, 128, 128, 0.14)' }}
                  onClick={() => setRisk(1)}
                >
                  1
                </button>
                <button
                  data-tracking-id="alpacawheel-change-risk-2"
                  style={{ background: risk === 2 && 'rgba(128, 128, 128, 0.14)' }}
                  onClick={() => setRisk(2)}
                >
                  2
                </button>
                <button
                  data-tracking-id="alpacawheel-change-risk-3"
                  style={{ background: risk === 3 && 'rgba(128, 128, 128, 0.14)' }}
                  onClick={() => setRisk(3)}
                >
                  3
                </button>
                <button
                  data-tracking-id="alpacawheel-change-risk-4"
                  style={{ background: risk === 4 && 'rgba(128, 128, 128, 0.14)' }}
                  onClick={() => setRisk(4)}
                >
                  4
                </button>
                <button
                  data-tracking-id="alpacawheel-change-risk-5"
                  style={{ background: risk === 5 && 'rgba(128, 128, 128, 0.14)' }}
                  onClick={() => setRisk(5)}
                >
                  5
                </button>
                <button
                  data-tracking-id="alpacawheel-change-risk-6"
                  style={{ background: risk === 6 && 'rgba(128, 128, 128, 0.14)' }}
                  onClick={() => setRisk(6)}
                >
                  6
                </button>
                <button
                  data-tracking-id="alpacawheel-change-risk-7"
                  style={{ background: risk === 7 && 'rgba(128, 128, 128, 0.14)' }}
                  onClick={() => setRisk(7)}
                >
                  7
                </button>
              </div>
            </div>
            <div className={styles.inputContainer}>
              <label
                className={classNames(
                  styles.label,
                )}
              >
                Number of Spins
              </label>
              <div
                className={classNames(
                  styles.cashedOutInputContainer,
                  styles.demoInput
                )}
              >
                <Input
                  className={classNames(styles.input)}
                  type={'number'}
                  value={nspin}
                  onChange={onGuestNspinChange}
                  step={1}
                  min="1"
                  max={'100'}
                />
                <span className={styles.eventTokenLabel}>
                  <span>Spins</span>
                </span>
                <div className={styles.buttonWrapper}>
                  <span
                    className={styles.buttonItem}
                    data-tracking-id="alpacawheel-change-spins-minus"
                    onClick={() => nspin > 0 && setNspin(nspin - 1)}
                  >
                    -
                  </span>
                  <span
                    className={styles.buttonItem}
                    data-tracking-id="alpacawheel-change-spins-plus"
                    onClick={() => nspin < 100 && setNspin(nspin + 1)}
                  >
                    +
                  </span>
                  <span
                    className={styles.buttonItem}
                    data-tracking-id="alpacawheel-change-spins-max"
                    onClick={() => setNspin(10)}
                  >
                    10
                  </span>
                </div>
              </div>
              {nuspin.nspin > 0 &&
                <div className={styles.spinsleft}>
                  {nuspin.nspin} spins left
                </div>
              }
            </div>
          </div>
          :
          <div className={styles.sliderContainer}>
            <label className={styles.label}>Bet Amount</label>
            {user?.isLoggedIn ? (
              <TokenNumberInput
                value={amount}
                currency={user?.currency}
                setValue={onTokenNumberChange}
                minValue={1}
                decimalPlaces={0}
                maxValue={formatToFixed(
                  user.balance > 10000 ? 10000 : user.balance
                )}
                dataTrackingIds={{
                  inputFieldHalf: 'alpacawheel-input-field-half',
                  inputFieldDouble: 'alpacawheel-input-field-double',
                  inputFieldAllIn: 'alpacawheel-input-field-allin',
                }}
              />
            ) : (
              <div
                className={classNames(
                  styles.cashedOutInputContainer,
                  styles.demoInput
                )}
              >
                <Input
                  className={classNames(styles.input)}
                  type={'number'}
                  value={amount}
                  onChange={onGuestAmountChange}
                  step={0.01}
                  min="1"
                  max={'10000'}
                />
                <span className={styles.eventTokenLabel}>
                  <span>{TOKEN_NAME}</span>
                </span>
                <div className={styles.buttonWrapper}>
                  <span
                    className={styles.buttonItem}
                    data-tracking-id="alpacawheel-input-field-half"
                    onClick={() => onBetAmountChanged(0.5)}
                  >
                    ½
                  </span>
                  <span
                    className={styles.buttonItem}
                    data-tracking-id="alpacawheel-input-field-double"
                    onClick={() => onBetAmountChanged(2)}
                  >
                    2x
                  </span>
                  <span
                    className={styles.buttonItem}
                    data-tracking-id="alpacawheel-input-field-allin"
                    onClick={() => setAmount(10000)}
                  >
                    Max
                  </span>
                </div>
              </div>
            )}
            <div className={styles.inputContainer}>
              <label
                className={classNames(
                  styles.label,
                )}
              >
                Choose Risk Level
              </label>
              <div className={styles.riskSelection}>
                <button
                  data-tracking-id="alpacawheel-change-risk-1"
                  style={{ background: risk === 1 && 'rgba(128, 128, 128, 0.14)' }}
                  onClick={() => setRisk(1)}
                >
                  1
                </button>
                <button
                  data-tracking-id="alpacawheel-change-risk-2"
                  style={{ background: risk === 2 && 'rgba(128, 128, 128, 0.14)' }}
                  onClick={() => setRisk(2)}
                >
                  2
                </button>
                <button
                  data-tracking-id="alpacawheel-change-risk-3"
                  style={{ background: risk === 3 && 'rgba(128, 128, 128, 0.14)' }}
                  onClick={() => setRisk(3)}
                >
                  3
                </button>
                <button
                  data-tracking-id="alpacawheel-change-risk-4"
                  style={{ background: risk === 4 && 'rgba(128, 128, 128, 0.14)' }}
                  onClick={() => setRisk(4)}
                >
                  4
                </button>
                <button
                  data-tracking-id="alpacawheel-change-risk-5"
                  style={{ background: risk === 5 && 'rgba(128, 128, 128, 0.14)' }}
                  onClick={() => setRisk(5)}
                >
                  5
                </button>
                <button
                  data-tracking-id="alpacawheel-change-risk-6"
                  style={{ background: risk === 6 && 'rgba(128, 128, 128, 0.14)' }}
                  onClick={() => setRisk(6)}
                >
                  6
                </button>
                <button
                  data-tracking-id="alpacawheel-change-risk-7"
                  style={{ background: risk === 7 && 'rgba(128, 128, 128, 0.14)' }}
                  onClick={() => setRisk(7)}
                >
                  7
                </button>
              </div>
            </div>
            {/*
            <div className={styles.inputContainer}>
            <label
              className={classNames(
                styles.label,
              )}
            >
              Stop on Spins
            </label>
            <div
              className={classNames(
                styles.cashedOutInputContainer,
                styles.demoInput
              )}
            >
              <div className={styles.toggleButton}>
                <span className={styles.toggleLabel} style={{marginLeft: !spinlimit?0:59, width: !spinlimit?63:63}}></span>
                <span
                  className={styles.buttonItem}
                  onClick={() => setSpinlimit(false)}
                >
                  Disable
                </span>
                <span
                  className={styles.buttonItem}
                  onClick={() => setSpinlimit(true)}
                >
                  Enable
                </span>
              </div>
              <Input
                className={classNames(styles.input, styles.increase)}
                type={'number'}
                value={nspin}
                onChange={onGuestNspinChange}
                step={1}
                min="1"
                max={'100'}
              />
              <span className={styles.eventTokenLabel}>
                <span>Spins</span>
              </span>
              <div className={styles.buttonWrapper}>
                <span
                  className={styles.buttonItem}
                  data-tracking-id="alpacawheel-change-spins-minus"
                  onClick={() => nspin > 0 && setNspin(nspin - 1)}
                >
                  -
                </span>
                <span
                  className={styles.buttonItem}
                  data-tracking-id="alpacawheel-change-spins-plus"
                  onClick={() => nspin < 100 && setNspin(nspin + 1)}
                >
                  +
                </span>
                <span
                  className={styles.buttonItem}
                  data-tracking-id="alpacawheel-change-spins-max"
                  onClick={() => setNspin(10)}
                >
                  10
                </span>
              </div>
            </div>*/}
            <div className={styles.inputContainer}>
            <label
              className={classNames(
                styles.label,
              )}
            >
              Stop on Profit
            </label>
            <div
              className={classNames(
                styles.cashedOutInputContainer,
                styles.demoInput
              )}
            >
              <Input
                className={classNames(styles.input)}
                type={'number'}
                value={profit}
                onChange={(e) => setProfit(e.target.value)}
                step={1}
                min="1"
                max={'100'}
              />
              <span className={styles.eventTokenLabel}>
                <span>PFAIR</span>
              </span>
              {/*
              <div className={styles.buttonWrapper}>
                <span
                  className={styles.buttonItem}
                  data-tracking-id="alpacawheel-input-field-half"
                  onClick={() => setProfit(profit*0.5)}
                >
                  ½
                </span>
                <span
                  className={styles.buttonItem}
                  data-tracking-id="alpacawheel-input-field-double"
                  onClick={() => setProfit(profit*2)}
                >
                  2x
                </span>
                <span
                  className={styles.buttonItem}
                  data-tracking-id="alpacawheel-input-field-allin"
                  onClick={() => setProfit(10000)}
                >
                  Max
                </span>
              </div>
              */}
            </div>
            <label
              className={classNames(
                styles.label,
              )}
            >
              Stop on Loss
            </label>
            <div
              className={classNames(
                styles.cashedOutInputContainer,
                styles.demoInput
              )}
            >
              <Input
                className={classNames(styles.input)}
                type={'number'}
                value={loss}
                onChange={(e) => setLoss(e.target.value)}
                step={1}
                min="1"
                max={'100'}
              />
              <span className={styles.eventTokenLabel}>
                <span>PFAIR</span>
              </span>
              {/*
              <div className={styles.buttonWrapper}>
                <span
                  className={styles.buttonItem}
                  data-tracking-id="alpacawheel-input-field-half"
                  onClick={() => setLoss(loss*0.5)}
                >
                  ½
                </span>
                <span
                  className={styles.buttonItem}
                  data-tracking-id="alpacawheel-input-field-double"
                  onClick={() => setLoss(loss*2)}
                >
                  2x
                </span>
                <span
                  className={styles.buttonItem}
                  data-tracking-id="alpacawheel-input-field-allin"
                  onClick={() => setProfit(10000)}
                >
                  Max
                </span>
              </div>
              */}
            </div>
            <label
              className={classNames(
                styles.label,
              )}
            >
              On Win
            </label>
            <div
              className={classNames(
                styles.cashedOutInputContainer,
                styles.demoInput
              )}
            >
              <div className={styles.toggleButton}>
                <span className={styles.toggleLabel} style={{ color: winbutton?'white':'#120e27', marginLeft: winbutton?4:53, width: winbutton?53:72}}></span>
                <span
                  className={styles.buttonItem}
                  style={{fontWeight: winbutton?'bold':'normal'}}
                  onClick={() => setWinbutton(true)}
                >
                  Reset
                </span>
                <span
                  className={styles.buttonItem}
                  style={{fontWeight: !winbutton?'bold':'normal'}}
                  onClick={() => setWinbutton(false)}
                >
                  Increase
                </span>
              </div>
              <Input
                className={classNames(styles.input)}
                type={'number'}
                value={wincrease}
                onChange={(e) => setWincrease(e.target.value)}
                step={1}
                min="0"
                max={'100'}
              />
              <span className={styles.eventTokenLabel}>
                <span>%</span>
              </span>
              {/*
              <div className={styles.buttonWrapper}>
                <span
                  className={styles.buttonItem}
                  data-tracking-id="alpacawheel-input-field-half"
                  onClick={() => setWincrease(wincrease-1)}
                >
                  -
                </span>
                <span
                  className={styles.buttonItem}
                  data-tracking-id="alpacawheel-input-field-double"
                  onClick={() => setWincrease(wincrease+1)}
                >
                  +
                </span>
                <span
                  className={styles.buttonItem}
                  data-tracking-id="alpacawheel-input-field-allin"
                  onClick={() => setWincrease(10)}
                >
                  10%
                </span>
              </div>
              */}
            </div>
            <label
              className={classNames(
                styles.label,
              )}
            >
              On Loss
            </label>
            <div
              className={classNames(
                styles.cashedOutInputContainer,
                styles.demoInput
              )}
            >
            <div className={styles.toggleButton}>
            <span className={styles.toggleLabel} style={{marginLeft: lossbutton?4:53, width: lossbutton?53:72}}></span>
              <span
                style={{fontWeight: lossbutton?'bold':'normal'}}
                className={styles.buttonItem}
                onClick={() => setLossbutton(true)}
              >
                Reset
              </span>
              <span
                style={{fontWeight: !lossbutton?'bold':'normal'}}
                className={styles.buttonItem}
                onClick={() => setLossbutton(false)}
              >
                Increase
              </span>
            </div>
              <Input
                className={classNames(styles.input)}
                type={'number'}
                value={lincrease}
                onChange={(e) => setLincrease(e.target.value)}
                step={1}
                min="0"
                max={'100'}
              />
              <span className={styles.eventTokenLabel}>
                <span>%</span>
              </span>
              {/*
              <div className={styles.buttonWrapper}>
                <span
                  className={styles.buttonItem}
                  data-tracking-id="alpacawheel-input-field-half"
                  onClick={() => setLincrease(lincrease-1)}
                >
                  -
                </span>
                <span
                  className={styles.buttonItem}
                  data-tracking-id="alpacawheel-input-field-double"
                  onClick={() => setLincrease(lincrease+1)}
                >
                  +
                </span>
                <span
                  className={styles.buttonItem}
                  data-tracking-id="alpacawheel-input-field-allin"
                  onClick={() => setLincrease(10)}
                >
                  10%
                </span>
              </div>
              */}
            </div>
              {nuspin.autobet &&
                <div className={styles.spinsleft}>
                  {Math.floor(accumulated)} PFAIR Accumulated
                </div>
              }
              {nuspin.autobet && nuspin.amount &&
                <div className={styles.spinsleft}>
                  Bet Amount {Math.floor(nuspin.amount)} PFAIR
                </div>
              }
              {nuspin.nspin > 0 &&
                <div className={styles.spinsleft}>
                  {nuspin.nspin} spins left
                </div>
              }
            </div>
          </div>
        }
      </div>
      {/*showCashoutWarning ? (
        <div className={styles.error}>
          <span>Betting less than 1 is not recommended. </span>
          <span
            data-for="rt"
            className={styles.why}
            data-tip="The multiplying factor defines your final reward.<br/>
             A multiplier of 2x means twice the reward, when the game ends.<br/>
              If the game ends before your multiplier,<br/> your amount invested is lost.<br/>"
          >
            Understand why.
          </span>
        </div>
      ) : null*/}
      <ReactTooltip
        id={'rt'}
        place="top"
        effect="solid"
        offset={{ bottom: 10 }}
        multiline
        className={styles.tooltip}
      />
      {renderButton()}
      {renderMessage()}
    </div>
  );
};

export default PlaceBetRoulette;
