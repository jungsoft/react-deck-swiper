import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  centerContent: {
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    display: 'flex',
  },
  marginTop5: {
    marginTop: theme.spacing(5),
  },
  marginTop2: {
    marginTop: theme.spacing(2),
  },
}));

export default useStyles;
