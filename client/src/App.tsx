import React from 'react';
import { Link, Route, Router, Switch } from 'react-router-dom';
import { Grid, Menu, Segment } from 'semantic-ui-react';

import Auth from './auth/Auth';
import ActionPost from './components/ActionPost';
import NotFound from './components/NotFound';
import Posts from './components/Posts';
import PostDetail from './components/PostDetail';
import MyPosts from './components/MyPosts';

interface IApp {
  auth: Auth;
  history: any;
}

const App = ({ auth, history }: IApp) => {
  const handleLogin = () => {
    auth.login();
  };

  const handleLogout = () => {
    auth.logout();
  };

  const handleMyPostsClick = () => {
    history.push('/my-posts');
  };

  const logInLogOutButton = () => {
    if (auth.isAuthenticated()) {
      return (
        <>
          <Menu.Item name="logout" onClick={handleMyPostsClick}>
            My Feed
          </Menu.Item>
          <Menu.Item name="logout" onClick={handleLogout}>
            Sign Out
          </Menu.Item>
        </>
      );
    } else {
      return (
        <Menu.Item name="login" onClick={handleLogin}>
          Sign In
        </Menu.Item>
      );
    }
  };

  const generateMenu = () => (
    <Menu>
      <Menu.Item name="home">
        <Link to="/">Home</Link>
      </Menu.Item>

      <Menu.Menu position="right">{logInLogOutButton()}</Menu.Menu>
    </Menu>
  );

  const generateCurrentPage = () => {
    return (
      <Switch>
        <Route
          path="/"
          exact
          render={(props) => <Posts {...props} auth={auth} />}
        />
        <Route
          path="/my-posts"
          exact
          render={(props) => <MyPosts {...props} auth={auth} />}
        />
        <Route
          path="/posts/:postId"
          exact
          render={(props) => <ActionPost {...props} auth={auth} />}
        />
        <Route
          path="/posts/:postId/detail"
          render={(props) => <PostDetail {...props} auth={auth} />}
        />
        <Route component={NotFound} />
      </Switch>
    );
  };

  return (
    <div>
      <Segment style={{ padding: '8em 0em' }} vertical >
        <Grid container stackable verticalAlign="middle">
          <Grid.Row>
            <Grid.Column width={16}>
              <Router history={history}>
                {generateMenu()}
                {generateCurrentPage()}
              </Router>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </div>
  );
};

export default App;
