import {
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Paper,
  Slide,
  Typography
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { useState } from 'react'
import { toast } from 'react-toastify'
import useStyles from './styles/TransactionModal.styles'
import TransactionModalItems from './TransactionModalItems'

const TransactionModal = ({ isOpen, onClose, data, onClickFunction }) => {
  const [isLoading, setisLoading] = useState(false)
  const classes = useStyles()
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Slide in={isOpen} direction="down">
        <Paper className={classes.modal}>
          <div className={classes.titleContainer}>
            <Typography className={classes.title}>
              Pre-sign Transaction
            </Typography>
            <IconButton size="medium" onClick={onClose}>
              <CloseIcon className={classes.closeButton} />
            </IconButton>
          </div>
          <div className={classes.descriptionContainer}>
            <Typography className={classes.description}>
              The Nansen NFT indexes present a reliable way of navigating the
              NFT markets. This update raises the bar for quality financial
              infrastructure that supports the growing depth of the NFT
              industry.
            </Typography>
          </div>
          <div className={classes.itemContainer}>
            {data.mintFunction &&
              data.inputs.map((item, index) => (
                <TransactionModalItems
                  lable={`${item}:`}
                  value={data.args[index]}
                  key={item}
                />
              ))}
            {data.contractAddress && (
              <TransactionModalItems
                lable="Contract Address:"
                value={data.contractAddress}
              />
            )}
            <TransactionModalItems lable="Value:" value={`${data.value} ETH`} />
            <TransactionModalItems
              lable="Max Fee:"
              value={`${data.maxFeePerGas} GWEI`}
            />
            <TransactionModalItems
              lable="Priority Fee:"
              value={`${data.maxPriorityFeePerGas} GWEI`}
            />
            <TransactionModalItems lable="Gas limit:" value={data.gasLimit} />
          </div>
          <div className={classes.buttonContainer}>
            <Button
              fullWidth
              disabled={isLoading}
              onClick={() => {
                setisLoading(true)
                onClickFunction().then((item) => {
                  if (item)
                    if (item.status === 200) {
                      toast(item.txId.message, { type: 'success' })
                    } else {
                      toast(item.content.message, { type: 'error' })
                    }
                  setisLoading(false)
                })
              }}
              variant="contained"
              className={classes.containedButton}>
              {isLoading ? (
                <CircularProgress
                  size={30}
                  className={classes.circularProgress}
                />
              ) : (
                <Typography className={classes.containedButtonText}>
                  I UNDERSTAND
                </Typography>
              )}
            </Button>
            <Button
              onClick={onClose}
              fullWidth
              variant="outlined"
              className={classes.outlinedButton}>
              CANCEL
            </Button>
          </div>
        </Paper>
      </Slide>
    </Modal>
  )
}
export default TransactionModal
