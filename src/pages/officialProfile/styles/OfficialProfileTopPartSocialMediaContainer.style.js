import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    width: 'calc(100% - 114px)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    columnGap: 30,
    marginTop: 30,
    [theme.breakpoints.down('sm')]: {
      marginTop: 70,
      justifyContent: 'center',
      width: '100%'
    }
  },
  buttonBase: {
    borderRadius: 20
  },
  etherscan: {
    width: 20,
    height: 20,
    padding: 6
  },
  logomarkWhite:{
    width: 32,
    height: 32,
  },
  websiteIcon: {
    color: '#E2E8F0',
    padding: 4
  }
}))
export default useStyles
