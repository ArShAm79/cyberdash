import { Typography } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import SwitchSelector from 'react-switch-selector'
import CustomButton from '../../components/CustomButton'
import CustomInput from '../../components/CustomInput'
import useStyles from './styles/index.styles'
import TransactionModal from './TransactionModal'
import { MetaMask } from '../../libs/wallets'

const MintFunction = () => {
  const [provider, setProvider] = useState({})

  useEffect(() => {
    setProvider(window.ethereum)
  }, [])

  const metaMask = new MetaMask(provider)

  const I_UNDERSTAND_CLICK_EVENT = async () => {
    const resMetaMask = await metaMask.onClickConnect()
    if (resMetaMask.status == 400) return resMetaMask.content.message

    const etherAddress = resMetaMask.content.address
    const resSignTx = await metaMask.signTx(
      etherAddress,
      'VALUE',
      'GAS LIMIT',
      'MAX FEE PER GAS',
      'MAX PRIORITY FEE PER GAS',
      'CONTRACT ADDRESS',
      'MINT ABI',
      'FLAG ABI',
      'MINT INPUT DATA'
    )
    if (resSignTx.status == 400) return resSignTx.content?.message

    LOOP_FOR_LOADING(resSignTx.content.rawTx)
  }

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const FLAG_LOAD = true

  const LOOP_FOR_LOADING = async (signedRawTx) => {
    while (FLAG_LOAD) {
      delay(1000)

      const resCheckFlag = await metaMask.checkFlag(
        'FLAG ABI',
        'CONTRACT ADDRESS'
      )
      if (resCheckFlag.status == 200 && resCheckFlag.content.result) {
        const resTx = await metaMask.flashbotSendSignedTx(signedRawTx)
        // SHOW TO KARBAR
        return resTx
      }
    }
  }

  const [transactionModalIsOpen, settransactionModalIsOpen] = useState(false)
  const [selectedFlaqApi, setselectedFlaqApi] = useState(undefined)
  const [selectedMintAbi, setselectedMintAbi] = useState(undefined)
  const [isConnect, setisConnect] = useState(sessionStorage.getItem('key'))
  const [data, setdata] = useState({
    maxPriority: '',
    maxFee: '',
    gasLimit: ''
  })
  const location = useLocation()
  const history = useHistory()

  const flagAbi = location?.state?.flagAbi

  const mintAbi = location?.state?.mintAbi
  useEffect(() => {
    if (!location.state) {
      history.replace('/contract')
    } else {
      setselectedMintAbi(
        !!mintAbi.defaultMintFunction
          ? mintAbi.allMintFunctions.findIndex(
              (item) => item.name === mintAbi.defaultMintFunction.name
            )
          : undefined
      )
      setselectedFlaqApi(
        !!flagAbi.defaultFlagFunction
          ? flagAbi.allFlagFunctions.findIndex(
              (item) => item.name === flagAbi.defaultFlagFunction.name
            )
          : undefined
      )
    }
  }, [])

  const classes = useStyles()
  return (
    <div className={classes.root}>
      <div className={classes.switchContainer}>
        <SwitchSelector
          fontSize={16}
          options={[
            {
              selectedBackgroundColor: '#1956E2',
              label: 'test1',
              value: 'test1'
            },
            {
              selectedBackgroundColor: '#1956E2',
              label: 'test2',
              value: 'test2'
            }
          ]}
          border="1px solid #1956E2"
          optionBorderRadius={27}
          fontColor="#fff"
          backgroundColor="transpart"
          wrapperBorderRadius={27}
        />
      </div>
      <div
        className={[
          classes.contractInfo,
          isConnect
            ? classes.contractInfoIsConnect
            : classes.contractInfoIsNotConnect
        ].join(' ')}>
        <Typography className={classes.contractText}>
          Contract Status
        </Typography>
        <div
          className={[
            classes.contractValue,
            isConnect
              ? classes.contractValueIsConnect
              : classes.contractValueIsNotConnect
          ].join(' ')}
        />
      </div>
      <div className={classes.inputContainer}>
        <CustomInput
          value={
            selectedFlaqApi
              ? flagAbi?.allFlagFunctions[selectedFlaqApi].name
              : undefined
          }
          placholder="Select flagAbi"
          isSelector
          selectorOptions={
            flagAbi?.allFlagFunctions
              .filter((item) => item.name)
              .map((item) => item.name) || []
          }
          toolTip="The Nansen NFT indexes present a reliable way of navigating the NFT markets. This update raises the bar for quality financial infrastructure that supports the growing depth of the NFT industry."
          onChange={(event) => {
            setselectedFlaqApi(
              flagAbi?.allFlagFunctions.findIndex(
                (item) => item.name === event.target.value
              )
            )
            setdata({
              ...data,
              selectedFlaqApi: event.target.value,
              flaqApi: undefined
            })
          }}
        />
        {selectedFlaqApi &&
          flagAbi?.allFlagFunctions[selectedFlaqApi].inputs.map(
            (item, index) => {
              return (
                <CustomInput
                  key={item.internalType + item.name}
                  label={item.name}
                  toolTip="The Nansen NFT indexes present a reliable way of navigating the NFT markets. This update raises the bar for quality financial infrastructure that supports the growing depth of the NFT industry."
                  onChange={(event) =>
                    setdata({
                      ...data,
                      flagAbi: {
                        ...data.flagAbi,
                        [item.name]: event.target.value
                      }
                    })
                  }
                />
              )
            }
          )}
        <CustomInput
          value={
            selectedMintAbi
              ? mintAbi.allMintFunctions[selectedMintAbi].name
              : undefined
          }
          placholder="Select mintAbi"
          isSelector
          selectorOptions={
            mintAbi?.allMintFunctions
              .filter((item) => item.name)
              .map((item) => item.name) || []
          }
          toolTip="The Nansen NFT indexes present a reliable way of navigating the NFT markets. This update raises the bar for quality financial infrastructure that supports the growing depth of the NFT industry."
          onChange={(event) => {
            setselectedMintAbi(
              mintAbi?.allMintFunctions.findIndex(
                (item) => item.name === event.target.value
              )
            )
            setdata({
              ...data,
              selectedMintAbi: event.target.value,
              mintAbi: undefined
            })
          }}
        />
        {selectedMintAbi &&
          mintAbi?.allMintFunctions[selectedMintAbi].inputs.map(
            (item, index) => {
              return (
                <CustomInput
                  key={item.internalType + item.name}
                  label={item.name}
                  toolTip="The Nansen NFT indexes present a reliable way of navigating the NFT markets. This update raises the bar for quality financial infrastructure that supports the growing depth of the NFT industry."
                  onChange={(event) =>
                    setdata({
                      ...data,
                      mintAbi: {
                        ...data.mintAbi,
                        [item.name]: event.target.value
                      }
                    })
                  }
                />
              )
            }
          )}
        <CustomInput
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={data.maxFee}
          label="Max Fee Per Gas"
          onChange={(event) =>
            setdata({
              ...data,
              maxFee: event.target.validity.valid
                ? event.target.value
                : data.maxFee
            })
          }
          toolTip="The Nansen NFT indexes present a reliable way of navigating the NFT markets. This update raises the bar for quality financial infrastructure that supports the growing depth of the NFT industry."
        />
        <CustomInput
          label="Max Priority Fee Per Gas"
          inputMode="numeric"
          type="text"
          pattern="[0-9]*"
          value={data.maxPriority}
          onChange={(event) =>
            setdata({
              ...data,
              maxPriority: event.target.validity.valid
                ? event.target.value
                : data.maxPriority
            })
          }
          toolTip="The Nansen NFT indexes present a reliable way of navigating the NFT markets. This update raises the bar for quality financial infrastructure that supports the growing depth of the NFT industry."
        />
        <CustomInput
          label="Gas Limit"
          type="text"
          pattern="[0-9]*"
          value={data.gasLimit}
          onChange={(event) =>
            setdata({
              ...data,
              gasLimit: event.target.validity.valid
                ? event.target.value
                : data.gasLimit
            })
          }
          toolTip="The Nansen NFT indexes present a reliable way of navigating the NFT markets. This update raises the bar for quality financial infrastructure that supports the growing depth of the NFT industry."
        />
      </div>
      <div className={classes.buttonContianer}>
        <CustomButton
          title="Pre-Sign TX"
          onClick={() => settransactionModalIsOpen(true)}
          disabled={
            !data.gasLimit ||
            !data.maxFee ||
            !data.maxPriority ||
            !selectedFlaqApi ||
            !selectedMintAbi
          }
          // onClick={() => console.log(data)}
        />
      </div>
      <TransactionModal
        isOpen={transactionModalIsOpen}
        onClose={() => settransactionModalIsOpen(false)}
        data={data}
      />
    </div>
  )
}
export default MintFunction
