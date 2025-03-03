import './styles.module.scss';
import AlertBox from './components/AlertBox';
import Bet from './screens/Bet';
import Home from './screens/Home';
import Logout from './screens/Logout';
import Popup from './components/Popup';
import PrivacyPolicy from './screens/PrivacyPolicy';
import Routes from './constants/Routes';
import configStore from './store';
import TermsAndConditions from './screens/TermsAndConditions';
import EmailVerification from './screens/EmailVerification';
import { ConnectedRouter } from 'connected-react-router';
import { history } from './store';
import { Provider } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router-dom';
import Navbar from 'components/Navbar';
import NavbarFooter from 'components/NavbarFooter';
import NavbarFooterAction from 'components/NavbarFooterAction';
import IconType from 'components/Icon/IconType';
import Events from './screens/Events';
import LiveEvents from './screens/LiveEvents';
import RosiGame from './screens/RosiGame';
import Blog from './screens/Blog';
import BlogItem from './components/BlogItem';
import { PersistGate } from 'redux-persist/integration/react';
import Games from './screens/Games';
import Activities from './screens/Activities';
import ResetPassword from './screens/ResetPassword';
import UserProfile from './screens/UserProfile';
import { initTagManager } from './config/gtm';
import AudioContent from './components/AudioContent';
import ScrollToTop from 'utils/ScrollToTop';
import DisclaimerPopupContainer from 'components/DisclaimerPopupContainer';
import PageTracker from 'components/PageTracker';
import useHideMobileScrollingMenu from 'hooks/useHideMobileScrollingMenu';

const { store, persistor } = configStore();

initTagManager();

const App = () => {
  const { onScroll, hideNavbar } = useHideMobileScrollingMenu();

  return (
    <div onScroll={onScroll}>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ConnectedRouter history={history}>
          <PageTracker />
          <ScrollToTop />
          <Navbar skipRoutes={[]} />
          <AlertBox />
          <Popup />
          <AudioContent />
          <DisclaimerPopupContainer />
          <Switch>
            <Route exact path={Routes.logout} component={Logout} />
            <Route
              exact
              path={Routes.termsAndConditions}
              component={TermsAndConditions}
            />
            <Route
              exact
              path={Routes.privacyPolicy}
              component={PrivacyPolicy}
            />
            <Route exact path={Routes.home} component={Home} />
            <Route exact path={Routes.bet} component={Bet} />
            <Route exact path={Routes.betApproveDirect} component={Home} />
            <Route exact path={Routes.liveEvents} component={LiveEvents} />
            <Route exact path={Routes.events} component={Events} />
            <Route exact path={Routes.rosiGame} component={RosiGame} />
            <Route
              path={Routes.blog}
              render={({ match: { url } }) => (
                <>
                  <Route path={`${url}/`} component={Blog} exact />
                  <Route path={`${url}/:slug`} component={BlogItem} />
                </>
              )}
            />
            <Route exact path={Routes.activities} component={Activities} />
            <Route path={Routes.verify} component={EmailVerification} />
            <Route path={Routes.games} component={Games} />
            <Route path={Routes.resetPassword} component={ResetPassword} />
            <Route exact path={Routes.user} component={UserProfile} />
            {/* <PrivateRoute path={Routes.rewards} component={Rewards} /> */}
            <Redirect to={Routes.home} />
          </Switch>
          <NavbarFooter 
            hideVisibility={hideNavbar}
            skipRoutes={[Routes.bet, Routes.verify]}
          >
            <NavbarFooterAction
              route={Routes.home}
              iconType={IconType.home}
              text="Home"
              trackingId="mobile-menu-home"
            />
            <NavbarFooterAction
              route={`/live-events`}
              iconType={IconType.camera}
              text="Live Stream"
              trackingId="mobile-menu-live-events"
            />
            <NavbarFooterAction
              route={`/events`}
              iconType={IconType.bet2}
              text="Events"
              trackingId="mobile-menu-events"
            />
            <NavbarFooterAction
              route={Routes.games}
              iconType={IconType.shuttle}
              text="Games"
              trackingId="mobile-menu-games"
            />
          </NavbarFooter>
        </ConnectedRouter>
      </PersistGate>
    </Provider>
    </div>
  );
};

// Recalculating after resizing screen
window.addEventListener('resize', () => {
  let vh = window.innerHeight * 0.01;

  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

export default App;
