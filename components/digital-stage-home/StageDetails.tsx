/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import {
  jsx, Button, Grid, Heading, Text,
} from 'theme-ui';
import Icon from '../base/Icon';
import Chip from '../base/Chip';

const StageDetails = (props: {
  stage: {
    title: string,
    image: string,
    online: boolean,
    users: {
      userPhoto: string
    }[]
  }
}) => {
  const {
    stage: {
      title, image, users,
    },
  } = props;
  return (
    <Grid>
      <Grid item>
        <img width="160" height="160" src={image} alt={image} />
        <Text sx={{ color: 'primary' }}>Stage</Text>
        <Heading as="h2">{title}</Heading>
        <Text sx={{ color: 'primary' }}>Created by info@digital-stage.org</Text>
        <Chip label="Favourite" />
        <Heading as="h6">Groups</Heading>
        <Grid
          container
          justify="space-between"
        >
          <Icon name="choir-bass" width={32} height={32} circled iconColor="#fff" sx={{ display: 'block !important' }} />
          <Text sx={{ color: 'primary' }}>Bass</Text>
          <Icon name="choir-alto" width={32} height={32} circled iconColor="#fff" />
          <Icon name="choir-sopran" width={32} height={32} circled iconColor="#fff" />
          <Icon name="choir-tenor" width={32} height={32} circled iconColor="#fff" />
          <Icon name="orchestra-conductor" width={32} height={32} circled iconColor="#fff" />
        </Grid>
        <Grid
          container
          justify="space-between"
        >
          <Button type="submit">Start</Button>
          <Button variant="white" type="submit">Copy invitation</Button>
          <Button variant="white" type="submit">Edit</Button>

        </Grid>
      </Grid>
      <Grid item>
        <Heading as="h3" sx={{ color: 'primary' }}>Users</Heading>
        <Text sx={{ color: 'primary' }}>
          {users.length}
          {' '}
          users
        </Text>
        {users.map((el, i) => (
          <img key={i} src={el.userPhoto} alt={el.userPhoto} width="40px" height="40px" />
        ))}
      </Grid>
    </Grid>
  );
};

export default StageDetails;
