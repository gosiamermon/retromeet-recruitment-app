const styles = theme => ({
  cardsGroup: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignSelf: 'center',
    padding: theme.spacing.unit,
    margin: `${theme.spacing.unit / 2}px 0`,
    boxShadow: '0 9px 0 -2px rgba(0,0,0,0.05), 0 2px rgba(0,0,0,.1)',
    borderRadius: '4px'
  },
  text: {
    paddingBottom: theme.spacing.unit,
    whiteSpace: 'pre-wrap'
  },
  line: {
    visibility: 'hidden'
  },
  cardWrapper: {
    display: 'flex'
  },
  textWrapper: {
    width: '95%',
    display: 'flex',
    alignItems: 'center'
  },
  removeCardWrapper: {
    width: '5%',
    display: 'flex',
    alignItems: 'center'
  }
});

export default styles;
