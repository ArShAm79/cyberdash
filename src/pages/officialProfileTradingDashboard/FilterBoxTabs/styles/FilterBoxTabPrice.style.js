import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(() => ({
  root: {
    padding: '29px 26px 36px 19px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgb(11, 30, 57)',
    borderRadius: '0 0 10px 10px',
    justifyContent: 'space-between'
  },
  title: {
    color: '#D1D1D1',
    font: 'normal normal normal 16px/19px Roboto',
    marginRight: 76
  },
  textField: {
    color: '#FFF',
    width: 220,
    height: 52,
    marginRight: 54,
    '& label.Mui-focused': {
      color: '#FFF'
    },
    '& .MuiInputLabel-outlined': {
      color: '#FFF'
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#FFF'
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: '14px !important',
      '& fieldset': {
        borderColor: '#FFF'
      },
      '&:hover fieldset': {
        borderColor: '#FFF'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#FFF'
      }
    },
    '& .MuiOutlinedInput-input': {
      //   padding: '16.5px 14px'
    }
  },

  textFieldInput: {
    color: '#FFF'
  },
  andText: {
    color: '#D1D1D1',
    font: 'normal normal normal 16px/19px Roboto',
    marginRight: 56
  },
  textFieldMax: {
    marginRight: 73
  },
  saveButton: {
    width: 241,
    height: 53,
    backgroundColor: '#1956E2',
    color: '#FFF',
    font: 'normal normal bold 16px/19px Roboto',
    borderRadius: 27,
    '&:hover': {
      backgroundColor: 'rgba(25, 86, 226,0.7)'
    }
  }
}))
export default useStyles
