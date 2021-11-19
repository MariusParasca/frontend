import cn from 'classnames';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector, connect } from 'react-redux';
import styles from './styles.module.scss';
import VolumeSlider from '../VolumeSlider';
import { AudioController } from '../AudioController';
import { AnimationController, BackgroundPlinko } from './AnimationController'
import GameAudioControlsLocal from '../GameAudioControlsLocal';
import { isMobile } from 'react-device-detect';

const colors = ["#d7393f", "#dd8549", "#e6e76a"]
const backgroundString = (backg) =>`conic-gradient(from 90deg at 50% 50%, ${colors[backg]} 0%,
  ${colors[backg]} 10%, ${colors[backg+1]} 10%,
  ${colors[backg+1]} 15%, ${colors[backg+2]} 15%,
  ${colors[backg+2]} 20%, ${colors[backg]} 20%,
  ${colors[backg]} 25%, ${colors[backg+1]} 25%,
  ${colors[backg+1]} 30%, ${colors[backg+2]} 30%,
  ${colors[backg+2]} 35%, ${colors[backg]} 35%,
  ${colors[backg]} 40%, ${colors[backg+1]} 40%,
  ${colors[backg+1]} 45%, ${colors[backg+2]} 45%,
  ${colors[backg+2]} 50%, ${colors[backg]} 50%,
  ${colors[backg]} 55%, ${colors[backg+1]} 55%,
  ${colors[backg+1]} 60%, ${colors[backg+2]} 60%,
  ${colors[backg+2]} 65%, ${colors[backg]} 65%,
  ${colors[backg]} 70%, ${colors[backg+1]} 70%,
  ${colors[backg+1]} 75%, ${colors[backg+2]} 75%,
  ${colors[backg+2]} 80%, ${colors[backg]} 80%,
  ${colors[backg]} 85%, ${colors[backg+1]} 85%,
  ${colors[backg+1]} 90%, ${colors[backg+2]} 90%,
  ${colors[backg+2]} 95%, ${colors[backg]} 95%,
  ${colors[backg]} 100%, ${colors[backg+1]} 100%)`

const PlinkoGameAnimation = ({
  connected,
  amount,
  onInit,
  risk,
  setBet,
  setSpins,
  bet
}) => {
  const dispatch = useDispatch();
  const backgroundRef = useRef(null);

  const [audio, setAudio] = useState(null);
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);
  const [backg, setBackg] = useState(0);
  const [backgr, setBackgr] = useState(backgroundString(0));
  const [flag, setFlag] = useState(false);
  const [ball, setBall] = useState(null);

  useEffect(() => {
    if(backgroundRef) {
      setWidth(backgroundRef.current.clientWidth)
      setHeight(backgroundRef.current.clientHeight)
    }
    const aud = new AudioController(1)
    setAudio(aud)
    aud.startBgm();
    onInit(aud)
    return () => {
      aud.stopBgm();
    }
  },[])
  useEffect(() => {
    setBackgr(backgroundString(backg))
  },[backg])

  useEffect(() => {
    if(bet && !bet.pending && bet.path) spin(bet);
  }, [bet]);

  const spin = async () => {
    setBall({ path: bet.path, winMultiplier: bet.winMultiplier })
    !bet.autobet && setBet((bet) => {return{ball: bet.ball, pending: true, amount: bet.amount, profit: bet.profit, reward: bet.reward}});
  }

  const changeBackground = (count) => {
    if(flag) return
    else setFlag(true)
    setBackg((backg) => backg === 2 ? 0 : backg + 1)
    setTimeout(() => {
      setBackg((backg) => backg === 2 ? 0 : backg + 1)
      count < 30 ? changeBackground(count + 1) : setFlag(false)
    }, 1000)
  }

  const handleEnd = (win) => {
    if(win) {
      audio.playWinSound()
      changeBackground(0)
    } else audio.playLoseSound();
    const spin = bet.profit > 0 ?
      { type: 'win', value: '+' + bet.profit } :
      bet.profit === 0 ? { type: 'even', value: '' + bet.profit } :
      { type: 'loss', value: bet.profit}
    setSpins((spins) => [spin].concat(spins))
    bet.autobet ?
     setBet((bet) => {return{ball: bet.ball-1, pending: true, amount: bet.amount, profit: bet.profit, reward: bet.reward}}) :
     setBet((bet) => {return{...bet, ball: bet.ball-1}})
  }
  return (
    <div ref={backgroundRef} style={{background: isMobile && backgr}} className={styles.animation}>
      {audio && <GameAudioControlsLocal game='plinko' audio={audio} />}
      {!isMobile && <BackgroundPlinko state={backg} size={Math.sqrt(width*width+height*height)*1.1} />}
      {width && height && <AnimationController risk={risk} amount={amount} ballValue={ball} audio={audio} onEnd={handleEnd} setBall={setBall} />}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    connected: state.websockets.connected,
  };
};

export default connect(mapStateToProps)(PlinkoGameAnimation);
