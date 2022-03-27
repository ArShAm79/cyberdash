import { CircularProgress, Typography } from '@material-ui/core'
import { useEffect, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import SwitchSelector from 'react-switch-selector'
import CustomButton from '../../components/CustomButton'
import CustomInput from '../../components/CustomInput'
import useStyles from './styles/index.styles'
import TransactionModal from './TransactionModal'
import { Form, Formik } from 'formik'

import { MetaMask } from '../../libs/wallets'
import mintFunctionValidation from './validation'
import SuccessModal from './SuccessModal'
import FailedModal from './FailedModal'
import MoreInfoModal from './MoreInfoModal'

const toolTipMessage =
  'The Nansen NFT indexes present a reliable way of navigating the NFT markets. This update raises the bar for quality financial infrastructure that supports the growing depth of the NFT industry.'
const MintFunction = () => {
  const [provider, setProvider] = useState({})

  useEffect(() => {
    setProvider(window.ethereum)
  }, [])

  const [transactionModalIsOpen, settransactionModalIsOpen] = useState(false)
  const [successModalIsOpen, setsuccessModalIsOpen] = useState(false)
  const [failedModalIsOpen, setFailedModalIsOpen] = useState(true)
  const [moreInfoModalIsOpen, setMoreInfoModalIsOpen] = useState(false)
  const [isLooping, setisLooping] = useState(false)
  const [isConnect, setisConnect] = useState(false)
  const [isSign, setisSign] = useState(false)
  const [MinimumEther, setMinimumEther] = useState('')
  const [sucessfullModaAddress, setsucessfullModaAddress] = useState('')
  const [failedModalMessage, setfailedModalMessage] = useState('')
  const stopWhileRef = useRef()

  const [data, setdata] = useState({})

  const location = useLocation()
  const flagAbi = location?.state?.flagAbi
  const mintAbi = location?.state?.mintAbi
  const initialValues = {
    flagFunction: !!mintAbi.defaultMintFunction
      ? mintAbi.allMintFunctions.findIndex(
          (item) => item.name === mintAbi.defaultMintFunction.name
        )?.name
      : '',
    mintFunction: !!mintAbi.defaultMintFunction
      ? mintAbi.allMintFunctions.findIndex(
          (item) => item.name === mintAbi.defaultMintFunction.name
        )?.name
      : '',
    args: [''],
    temp: [],
    maxPriorityFeePerGas: '',
    maxFeePerGas: '',
    gasLimit: '',
    value: ''
  }
  const history = useHistory()
  const contractAddress = location?.state?.contractAddress

  const metaMask = new MetaMask(provider)

  const calculateMinimumEther = async (
    value,
    maxFeePerGas,
    maxPriorityFeePerGas,
    gasLimit
  ) => {
    const resCalculate = await metaMask.calculateEtherValue(
      value,
      maxFeePerGas,
      maxPriorityFeePerGas,
      gasLimit
    )
    setMinimumEther(resCalculate)
  }

  const checkValidateMintInputs = (mintAbi, inputsData) => {
    try {
      let mintInputsType = []

      for (let i = 0; i < mintAbi.inputs.length; i++) {
        mintInputsType.push(mintAbi.inputs[i].type)
      }

      if (mintInputsType.length !== inputsData.length)
        return {
          status: 400,
          content: { message: 'Invalid Inputs Item Length' }
        }

      for (let k = 0; k < mintInputsType.length; k++) {
        if (String(mintInputsType[k]).toLowerCase().includes('bool')) {
          if (
            inputsData[k].toLowerCase() === 'false' ||
            inputsData[k].toLowerCase() === true
          )
            inputsData[k] = Boolean(inputsData[k])
          else
            return {
              status: 400,
              content: { message: 'Invalid Type of Boolean' }
            }
        }
        if (String(mintInputsType[k]).toLowerCase().includes('int')) {
          if (String(inputsData[k]).match(/^[0-9]+$/) == null)
            return {
              status: 400,
              content: { message: 'Invalid Type uint256' }
            }

          inputsData[k] = parseInt(inputsData[k])
        }
        if (String(mintInputsType[k]).toLowerCase().includes('byte')) {
          inputsData[k] = String(inputsData[k])
        }
      }

      return {
        status: 200,
        content: { inputData: inputsData }
      }
    } catch (e) {
      return {
        status: 400,
        content: { message: e.message }
      }
    }
  }

  const SIGN_CLICK = async () => {
    const resMetaMask = await metaMask.onClickConnect()
    if (resMetaMask.status === 400) return resMetaMask

    const serializeMintInputsData = checkValidateMintInputs(
      mintAbi.allMintFunctions.find((item) => item.name === data.mintFunction),
      data.args
    )

    if (serializeMintInputsData.status === 400) return serializeMintInputsData

    settransactionModalIsOpen(false)
    setisLooping(true)
    LOOP_FOR_LOADING('send', serializeMintInputsData.content.inputData)
  }

  const I_UNDERSTAND_CLICK_EVENT = async () => {
    const resMetaMask = await metaMask.onClickConnect()
    if (resMetaMask.status === 400) return resMetaMask

    const serializeMintInputsData = checkValidateMintInputs(
      mintAbi.allMintFunctions.find((item) => item.name === data.mintFunction),
      data.args
    )

    if (serializeMintInputsData.status === 400) return serializeMintInputsData

    const etherAddress = resMetaMask.content.address

    const resSignTx = await metaMask.signTx(
      etherAddress,
      parseFloat(data.value),
      parseInt(data.gasLimit),
      parseInt(data.maxFeePerGas),
      parseInt(data.maxPriorityFeePerGas),
      data.contractAddress,
      mintAbi.allMintFunctions.find((item) => item.name === data.mintFunction),
      flagAbi.allFlagFunctions.find((item) => item.name === data.flagFunction),
      serializeMintInputsData.content.inputData
    )

    if (resSignTx.status === 400) return resSignTx
    settransactionModalIsOpen(false)
    setisLooping(true)
    setMoreInfoModalIsOpen(true)
    LOOP_FOR_LOADING(
      resSignTx.content.rawTx,
      serializeMintInputsData.content.inputData
    )
  }

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const LOOP_FOR_LOADING = async (signedRawTx, serializeMintInputs) => {
    try {
      while (true) {
        if (stopWhileRef.current) break

        await delay(1000)
        let mainAddress = sessionStorage.getItem('key')

        const selectedFlagAbiFunction = flagAbi.allFlagFunctions.find(
          (item) => item.name === data.flagFunction
        )

        if (
          !String(selectedFlagAbiFunction.name).toLowerCase().includes('main')
        ) {
          const resCheckFlag = await metaMask.checkFlag(
            flagAbi.allFlagFunctions.find(
              (item) => item.name === data.flagFunction
            ),
            data.contractAddress
          )

          if (resCheckFlag.status === 200 && resCheckFlag.content.result) {
            let resTx
            if (signedRawTx == 'send') {
              resTx = await metaMask.sendTx(
                mainAddress,
                parseFloat(data.value),
                parseInt(data.gasLimit),
                parseInt(data.maxFeePerGas),
                parseInt(data.maxPriorityFeePerGas),
                data.contractAddress,
                mintAbi.allMintFunctions.find(
                  (item) => item.name === data.mintFunction
                ),
                serializeMintInputs
              )
            } else {
              resTx = await metaMask.flashbotSendSignedTx(signedRawTx, false)
            }

            if (resTx.status === 200) {
              setisConnect(true)
              setisLooping(false)
              setsuccessModalIsOpen(true)
              setsucessfullModaAddress(resTx.content.data)
              return {
                status: 200,
                content: {
                  txId: resTx.content.data
                }
              }
            } else if (resTx.status === 400) {
              setisLooping(false)
              setfailedModalMessage(resTx.content.message)
              setFailedModalIsOpen(true)
              // toast(resTx.content.message, { type: 'error' })
              return {
                status: 400,
                content: {
                  message: resTx.content.message
                }
              }
            }
          }
        } else {
          const resCheckEstimateGas = await metaMask.estimateGas(
            mainAddress,
            data.contractAddress
          )

          if (
            resCheckEstimateGas.status == 200 &&
            resCheckEstimateGas.content?.result == true
          ) {
            let resSentTx
            if (signedRawTx == 'send') {
              resSentTx = await metaMask.sendTx(
                mainAddress,
                parseFloat(data.value),
                parseInt(data.gasLimit),
                parseInt(data.maxFeePerGas),
                parseInt(data.maxPriorityFeePerGas),
                data.contractAddress,
                mintAbi.allMintFunctions.find(
                  (item) => item.name === data.mintFunction
                ),
                serializeMintInputs
              )
            } else {
              resSentTx = await metaMask.flashbotSendSignedTx(
                signedRawTx,
                false
              )
            }

            if (resSentTx.status === 200) {
              setisConnect(true)
              setisLooping(false)
              setsuccessModalIsOpen(true)
              setsucessfullModaAddress(resSentTx.content.data)
              return {
                status: 200,
                content: {
                  txId: resSentTx.content.data
                }
              }
            }
          }
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  const customButtonFunction = (values) => {
    if (isLooping) {
      setisLooping(false)
      stopWhileRef.current = true
    } else {
      settransactionModalIsOpen(true)
      setdata({ ...data, ...values })
    }
  }
  useEffect(() => {
    stopWhileRef.current = false
  }, [])
  useEffect(() => {
    if (!location.state || !sessionStorage.getItem('key')) {
      history.replace('/contract')
    } else {
      setdata({ ...data, contractAddress })
    }
  }, [])
  const classes = useStyles()
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={mintFunctionValidation}
        onSubmit={customButtonFunction}>
        {({
          values,
          setFieldValue,
          errors,
          touched,
          handleBlur,
          isSubmitting,
          handleChange
        }) => {
          return (
            <Form>
              <div className={classes.root}>
                <div className={classes.switchContainer}>
                  <SwitchSelector
                    fontSize={16}
                    disabled={isLooping}
                    options={[
                      {
                        selectedBackgroundColor: '#1956E2',
                        label: 'Pre-Sign',
                        value: 'Pre-Sign'
                      },
                      {
                        selectedBackgroundColor: '#1956E2',
                        label: 'Sign',
                        value: 'Sign'
                      }
                    ]}
                    onChange={(event) => {
                      setisSign(!isSign)
                    }}
                    border="1px solid #1956E2"
                    optionBorderRadius={27}
                    fontColor="#fff"
                    backgroundColor="transpart"
                    wrapperBorderRadius={27}
                  />
                </div>
                {isLooping && (
                  <div className={classes.waitingFlagContainer}>
                    <CircularProgress size={45} />
                    <Typography className={classes.waitingFlagText}>
                      Waiting for flag ...
                    </Typography>
                  </div>
                )}
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
                    name="flagFunction"
                    label="Select Flag Function"
                    value={values.flagFunction}
                    error={touched.flagFunction && !!errors.flagFunction}
                    helperText={touched.flagFunction ? errors.flagFunction : ''}
                    onBlur={handleBlur}
                    disabled={isLooping}
                    onChange={(event) => {
                      setFieldValue('flagFunction', event.target.value)
                      setFieldValue(
                        'temp',
                        flagAbi?.allFlagFunctions
                          .find((item) => item.name === event.target.value)
                          ?.inputs.map(() => '')
                      )
                      handleChange(event)
                    }}
                    placholder="Select Flag Function"
                    isSelector
                    selectorOptions={
                      flagAbi?.allFlagFunctions
                        .filter((item) => item.name)
                        .map((item) => item.name) || []
                    }
                    toolTip={toolTipMessage}
                  />
                  {values.flagFunction &&
                    flagAbi?.allFlagFunctions
                      .find((item) => item.name === values.flagFunction)
                      .inputs.map((item, index) => {
                        return (
                          <CustomInput
                            key={item.internalType + item.name}
                            label={item.name}
                            // type="number"
                            name={`temp[${index}]`}
                            value={values.temp[index]}
                            error={
                              touched.temp &&
                              touched.temp[index] &&
                              errors.temp &&
                              Boolean(errors.temp[index])
                            }
                            helperText={
                              touched.temp &&
                              touched.temp[index] &&
                              errors.temp &&
                              errors.temp[index]
                                ? errors.temp[index]
                                : ''
                            }
                            onBlur={handleBlur}
                            disabled={isLooping}
                            onChange={(event) => {
                              setFieldValue(
                                `temp[${index}]`,
                                event.target.value
                              )
                            }}
                          />
                        )
                      })}
                  <CustomInput
                    name="mintFunction"
                    label="Select Mint Function"
                    value={values.mintFunction}
                    error={touched.mintFunction && Boolean(errors.mintFunction)}
                    helperText={
                      touched.mintFunction && errors.mintFunction
                        ? errors.mintFunction
                        : ''
                    }
                    onBlur={handleBlur}
                    disabled={isLooping}
                    onChange={(event) => {
                      setFieldValue('mintFunction', event.target.value)
                      setFieldValue(
                        'args',
                        mintAbi?.allMintFunctions
                          .find((item) => item.name === event.target.value)
                          ?.inputs.map(() => '')
                      )
                      setFieldValue(
                        'inputs',
                        mintAbi?.allMintFunctions
                          .find((item) => item.name === event.target.value)
                          ?.inputs.map((item) => item.name)
                      )
                    }}
                    placholder="Select Mint Function"
                    isSelector
                    selectorOptions={
                      mintAbi?.allMintFunctions
                        .filter((item) => item.name)
                        .map((item) => item.name) || []
                    }
                    toolTip={toolTipMessage}
                  />
                  {values.mintFunction &&
                    mintAbi?.allMintFunctions
                      .find((item) => item.name === values.mintFunction)
                      ?.inputs.map((item, index) => {
                        return (
                          <CustomInput
                            key={item.name}
                            label={item.name}
                            id={`args[${index}]`}
                            // type="number"
                            name={`args[${index}]`}
                            value={values.args[index]}
                            error={
                              touched.args &&
                              touched.args[index] &&
                              errors.args &&
                              Boolean(errors.args[index])
                            }
                            helperText={
                              touched.args &&
                              touched.args[index] &&
                              errors.args &&
                              errors.args[index]
                                ? errors.args[index]
                                : ''
                            }
                            onBlur={handleBlur}
                            disabled={isLooping}
                            onChange={(event) => {
                              setFieldValue(
                                `args[${index}]`,
                                event.target.value
                              )
                            }}
                          />
                        )
                      })}
                  <CustomInput
                    label="Value"
                    type="number"
                    step="0.01"
                    name="value"
                    value={values.value}
                    error={touched.value && !!errors.value}
                    helperText={touched.value ? errors.value : ''}
                    onBlur={handleBlur}
                    disabled={isLooping}
                    onChange={(event) => {
                      setFieldValue('value', event.target.value)
                    }}
                    toolTip={toolTipMessage}
                  />
                  <CustomInput
                    name="maxFeePerGas"
                    type="number"
                    label="Max Fee Per Gas"
                    value={values.maxFeePerGas}
                    error={touched.maxFeePerGas && !!errors.maxFeePerGas}
                    helperText={
                      touched.maxFeePerGas ? errors.maxFeePerGas : undefined
                    }
                    onBlur={handleBlur}
                    disabled={isLooping}
                    onChange={(event) => {
                      setFieldValue('maxFeePerGas', event.target.value)
                    }}
                    toolTip={toolTipMessage}
                  />
                  <CustomInput
                    label="Max Priority Fee Per Gas"
                    inputMode="numeric"
                    value={values.maxPriorityFeePerGas}
                    name="maxPriorityFeePerGas"
                    error={
                      touched.maxPriorityFeePerGas &&
                      !!errors.maxPriorityFeePerGas
                    }
                    helperText={
                      touched.maxPriorityFeePerGas
                        ? errors.maxPriorityFeePerGas
                        : undefined
                    }
                    onBlur={handleBlur}
                    disabled={isLooping}
                    onChange={(event) => {
                      setFieldValue('maxPriorityFeePerGas', event.target.value)
                    }}
                    type="number"
                    toolTip={toolTipMessage}
                  />
                  <CustomInput
                    label="Gas Limit"
                    inputMode="numeric"
                    step="1"
                    value={values.gasLimit}
                    type="number"
                    name="gasLimit"
                    error={touched.gasLimit && !!errors.gasLimit}
                    helperText={touched.gasLimit ? errors.gasLimit : undefined}
                    onBlur={handleBlur}
                    disabled={isLooping}
                    onChange={(event) => {
                      setFieldValue('gasLimit', event.target.value)
                    }}
                    toolTip={toolTipMessage}
                  />
                </div>
                {
                  !(
                    errors.value ||
                    errors.gasLimit ||
                    errors.maxFeePerGas ||
                    errors.maxPriorityFeePerGas
                  ) &&
                    values.value && (
                      <div className={classes.requiredEmountContainer}>
                        <Typography className={classes.requiredEmount}>{`${
                          calculateMinimumEther(
                            values.value,
                            values.maxFeePerGas,
                            values.maxPriorityFeePerGas,
                            values.gasLimit
                          ) && MinimumEther
                        } eth required in wallet`}</Typography>
                      </div>
                    )
                  // ))
                }
                <div className={classes.buttonContianer}>
                  <CustomButton
                    className={isLooping ? classes.cancelButton : ''}
                    title={
                      isLooping
                        ? 'Cancel'
                        : isSign
                        ? 'Confirm TX'
                        : 'Pre-Sign TX'
                    }
                    type="submit"
                  />
                </div>
              </div>
            </Form>
          )
        }}
      </Formik>
      <TransactionModal
        isOpen={transactionModalIsOpen}
        onClose={() => settransactionModalIsOpen(false)}
        data={data}
        onClickFunction={I_UNDERSTAND_CLICK_EVENT}
      />
      <SuccessModal
        isOpen={successModalIsOpen}
        onClose={() => setsuccessModalIsOpen(false)}
        data={sucessfullModaAddress}
      />
      <FailedModal
        isOpen={failedModalIsOpen}
        onClose={() => setFailedModalIsOpen(false)}
        message={failedModalMessage}
      />
      <MoreInfoModal
        isOpen={moreInfoModalIsOpen}
        onClose={() => setMoreInfoModalIsOpen(false)}
      />
    </>
  )
}
export default MintFunction
