import * as React from 'react';
import Auth from '../auth/Auth';
import { Button } from 'semantic-ui-react';

interface LogInProps {
  auth: Auth;
}

const LogIn = ({ auth }: LogInProps) => {
  const onLogin = () => {
    auth.login();
  };

  return (
    <div>
      <h1>Please sign in</h1>

      <Button onClick={onLogin} size="huge" color="olive">
        Sign in
      </Button>
    </div>
  );
};

export default LogIn;
