export const selectHasStarted = state => state.rosiGame.hasStarted;
export const selectTimeStarted = state => state.rosiGame.timeStarted;
export const selectUserBet = state => state.rosiGame.userBet;
export const selectNextGameAt = state => state.rosiGame.nextGameAt;
export const selectLastCrash = state => state.rosiGame.lastCrashes[0];
export const betInQueue = state => state.rosiGame.placedBetInQueue;
export const isCashedOut = state => state.rosiGame.isCashedOut;
export const selectLastCrashes = state =>
  state.rosiGame.lastCrashes.slice(0, 10);
export const selectInGameBets = ({ rosiGame }) => {
  if (rosiGame.hasStarted) {
    const currentCrashFactor =
      (Date.now() - new Date(rosiGame.timeStarted).getTime()) / 1000;
    return rosiGame.inGameBets.filter(
      bet => bet.crashFactor > currentCrashFactor
    );
  } else {
    return rosiGame.inGameBets;
  }
};

export const selectCashedOut = ({ rosiGame }) => {
  if (rosiGame.hasStarted) {
    return rosiGame.cashedOut;
    // const currentCrashFactor =
    //   (Date.now() - new Date(rosiGame.timeStarted).getTime()) / 1000;
    // return rosiGame.inGameBets
    //   .filter(bet => bet.crashFactor <= currentCrashFactor)
    //   .map(bet => ({
    //     ...bet,
    //     amount: Number((bet.amount * bet.crashFactor).toFixed(2)),
    //   }));
  } else {
    return rosiGame.cashedOut;
  }
};

export const selectDisplayBetButton = ({ rosiGame }) => {
  if (rosiGame.hasStarted && rosiGame.userBet) {
    return false;
  }
  if (
    rosiGame.hasStarted &&
    rosiGame.isCashedOut &&
    rosiGame.placedBetInQueue
  ) {
    return false;
  }
  if (rosiGame.hasStarted && rosiGame.isCashedOut) {
    return true;
  }
  if (rosiGame.hasStarted && rosiGame.placedBetInQueue) {
    return false;
  }
  if (
    rosiGame.hasStarted &&
    !rosiGame.placedBetInQueue &&
    rosiGame.isCashedOut
  ) {
    return true;
  }
  if (!rosiGame.hasStarted && !!rosiGame.userBet) {
    return false;
  }
  return true;
};
