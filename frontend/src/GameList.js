import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import dayjs from 'dayjs';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  }
}));

const Database = require('./utils/db-fake');

function GameList() {
  const [data, setData] = useState({ games: [] });
  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      const client = new Database();
      const games = await client.getGames();
      console.log(games);

      setData({ games });
    };

    fetchData();
  }, []);

  function handleClick() {
    console.log('aasdfjals');
  }

  return (
    <List className={classes.root}>
      {data.games.map((game, index) => (
        <ListItem button key={index} onClick={handleClick}>
          <ListItemAvatar>
            <Avatar>
              <ImageIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`${dayjs(game.date).format('MMMM D')} ${game.time}`}
            secondary={game.facility}
          />
        </ListItem>
      ))}
    </List>
  );
}

export default GameList;
