import React from 'react';
import { Grid, Loader } from 'semantic-ui-react';

const Loading = () => {
  return (
    <Grid.Row>
      <Loader indeterminate active inline="centered">
        Loading Posts
      </Loader>
    </Grid.Row>
  );
};

export default Loading;
