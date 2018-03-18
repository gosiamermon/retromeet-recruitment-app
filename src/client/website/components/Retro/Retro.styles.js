import { cardWidth } from '../../theme/dimensions';

const styles = theme => ({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignContent: 'flex-start',
    width: '100%'
  },
  columns: {
    display: 'flex',
    width: '100%',
    flexFlow: 'row wrap',
    padding: '0 4%'
  },
  users: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  avatar: {
    width: 64,
    height: 64,
    margin: theme.spacing.unit
  },
  badge: {
    margin: theme.spacing.unit * 2
  },
  messageCard: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.unit * 2,
    width: cardWidth,
    maxWidth: '100%',
    margin: theme.spacing.unit * 2
  },
  hidden: {
    display: 'none'
  },
  switch: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: '5%'
  },
  colSelectionButton: {
    fontSize: '35px'
  },
  searchbox: {
    marginLeft: '2%',
    marginTop: '2%'
  }
});

export default styles;
