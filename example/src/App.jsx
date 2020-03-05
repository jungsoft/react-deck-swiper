import * as React from 'react';
import { Swipeable, direction } from 'react-deck-swiper';
import classNames from 'classnames';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import CardButtons from './components/CardButtons';
import Card from './components/Card';
import useStyles from './styles';

const INITIAL_CARDS_STATE = [
  {
    id: 1,
    title: 'This is react deck swiper',
    url: 'https://images.unsplash.com/photo-1558420488-0ed4bebf615d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2978&q=80',
  },
  {
    id: 2,
    title: 'and it\'s awesome! 🚀',
    url: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1479&q=80',
  },
];

const App = () => {
  const classes = useStyles();

  const [lastSwipeDirection, setLastSwipeDirection] = React.useState(null);
  const [cards, setCards] = React.useState(INITIAL_CARDS_STATE);

  const handleOnSwipe = (swipeDirection) => {
    if (swipeDirection === direction.RIGHT) {
      setLastSwipeDirection('your right');
    }

    if (swipeDirection === direction.LEFT) {
      setLastSwipeDirection('your left');
    }

    setCards(cards.slice(1));
  };

  const renderButtons = ({
    right,
    left,
  }) => (
    <CardButtons
      right={right}
      left={left}
    />
  );

  return (
    <Grid container spacing={3} className={classes.centerContent}>
      <Grid item xs={12} className={classNames(classes.marginTop5, classes.centerContent)}>
        <Typography variant="h3">
          React Deck Swiper
          <span role="img" aria-label="awesome"> ⚛️</span>
        </Typography>
      </Grid>

      {
        cards.length > 0 && (
          <Grid item xs={12} className={classNames(classes.marginTop2, classes.centerContent)}>
            {
              lastSwipeDirection
                ? (
                  <Typography variant="body1">
                    {'Looks like you have just swiped to '}
                    {lastSwipeDirection}
                    ? 🔮
                  </Typography>
                )
                : (
                  <Typography variant="body1">
                    Try swiping the card below!
                  </Typography>
                )
            }
          </Grid>
        )
      }

      <Grid item xs={12} className={classNames(classes.marginTop2, classes.centerContent)}>
        {
          cards.length > 0
            ? (
              <Swipeable
                renderButtons={renderButtons}
                onSwipe={handleOnSwipe}
              >
                <Card item={cards[0]} />
              </Swipeable>
            )
            : (
              <Typography variant="body1">
                Looks like you have reached the end here =)
              </Typography>
            )
        }
      </Grid>
    </Grid>
  );
};

export default App;
