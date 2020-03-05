import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import MaterialCard from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
});

export default function Card({
  item: {
    title,
    url,
  },
}) {
  const classes = useStyles();

  return (
    <MaterialCard className={classes.root}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={url}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="h3">
            {title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </MaterialCard>
  );
}
