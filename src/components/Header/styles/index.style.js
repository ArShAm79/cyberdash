import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    background: '#0B1E39',
    padding: '0 93px 0 94px',
    [theme.breakpoints.down('sm')]: {
      padding: '0 10px 0 10px'
    }
  },
  mobileSize: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%'
    }
  },
  connectWallet: {
    height: 50,
    color: '#fff',
    borderColor: '#fff',
    borderRadius: 27,
    fontSize: 16
  },
  headerButton: {
    color: '#fff',
    fontSize: 16,
    textTransform: 'none'
  },
  headerButtonContainer: {
    // width: '100%',
    display: 'flex',
    // alignItems: 'center',
    justifyContent: 'center',
    flex: 3
  },
  mediaContiner: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: 6,
    flex: 1
  },
  creditContainer: {
    display: 'flex',
    alignItems: 'center',
    columnGap: 7,
    justifyContent: 'center',
    // marginRight: 20
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      flex: 'none',
      marginRight: 10
    }
  },
  creditValue: {
    fontSize: 14,
    color: '#fff'
  }
}))
export default useStyles
