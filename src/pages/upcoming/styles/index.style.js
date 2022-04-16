import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    // maxWidth: 'auto'
    width: '100%',
    margin: '30px 0',
    backgroundColor: 'transparent'
    // margin: '0 20px',
  },
  main: {
    // width: '100%',
    padding: '0 89px'
  },
  table: {
    // width: '100%'
  },
  container: {
    backgroundColor: 'transparent'
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: 3,
    alignItems: 'flex-start',
    marginBottom: 20,
    margin: '0 89px',
    [theme.breakpoints.down('sm')]: {
      margin: '0 20px',
      marginBottom: 20
    }
  },
  headerTitle: {
    color: '#FFF'
  },
  pageTitle: {
    color: '#FFF'
  },
  headerDiscription: {
    color: 'rgb(197,197,224)'
  }
}))
export default useStyles
