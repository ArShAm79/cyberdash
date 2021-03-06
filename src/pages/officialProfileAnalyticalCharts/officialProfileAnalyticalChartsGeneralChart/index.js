import useStyles from './styles/index.style'
import { useEffect, useState } from 'react'
import OfficialProfileAnalyticalChartsGeneralChartTopPart from './OfficialProfileAnalyticalChartsGeneralChartTopPart'
import { Typography } from '@material-ui/core'
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip
} from 'chart.js'
import { Chart } from 'react-chartjs-2'
ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip
)
const label = ['January', 'February', 'March', 'April', 'May', 'June', 'July']
const labels = [...label, ...label, ...label, ...label]
const data = {
  labels,
  datasets: [
    {
      type: 'line',
      label: 'Dataset 1',
      borderColor: 'rgb(255, 99, 132)',
      borderWidth: 2,
      fill: false,
      data: labels.map(() => Math.floor(Math.random() * 100)),
      yAxisID: 'y',
      xAxisID: 'x'
    },
    {
      type: 'line',
      label: 'Dataset 2',
      backgroundColor: 'rgb(75, 192, 192)',
      data: labels.map(() => Math.floor(Math.random() * 100 + 10)),
      borderColor: 'white',
      borderWidth: 2,
      yAxisID: 'y',
      xAxisID: 'x'
    },
    {
      yAxisID: 'y',
      xAxisID: 'x',
      type: 'bar',
      label: 'Dataset 3',

      backgroundColor: 'rgb(53, 162, 235)',
      data: labels.map(() => Math.floor(Math.random() * 100))
    }
  ]
}
const OfficialProfileAnalyticalChartsGeneralChart = ({ isSmallScreen }) => {
  const classes = useStyles()
  const [dayValue, setdayValue] = useState('1y')
  const [timeValue, settimeValue] = useState('5m')
  const [floorVar, setfloorVar] = useState(0)
  const [
    floorVarSelectorContainerIsActive,
    setfloorVarSelectorContainerIsActive
  ] = useState(false)
  const [showChart, setshowChart] = useState(true)
  useEffect(() => {
    setshowChart(false)
    setTimeout(() => setshowChart(true), 5)
  }, [isSmallScreen])

  return (
    <div className={classes.root}>
      <OfficialProfileAnalyticalChartsGeneralChartTopPart
        dayValue={dayValue}
        setdayValue={setdayValue}
        timeValue={timeValue}
        settimeValue={settimeValue}
        floorVar={floorVar}
        setfloorVar={setfloorVar}
        floorVarSelectorContainerIsActive={floorVarSelectorContainerIsActive}
        setfloorVarSelectorContainerIsActive={
          setfloorVarSelectorContainerIsActive
        }
      />
      <div className={classes.chartContainer}>
        <Typography className={classes.ETHPriceText}>ETH Price</Typography>
        {showChart && (
          <Chart
            type="bar"
            data={data}
            // style={{ minHeight: 250, width: 'auto' }}
            height={isSmallScreen ? 120 : 20}
            width={'100%'}
            options={{
              responsive: true,
              // maintainAspectRatio: false,
              elements: {},
              scales: {
                y: {
                  display: true,
                  beginAtZero: true,
                  grid: {
                    color: '#244677'
                  },
                  categorySpacing: 0.4
                },
                x: {
                  display: true,
                  beginAtZero: true,
                  grid: {
                    display: false
                  },
                  categorySpacing: 0.4
                }
              }
            }}
          />
        )}
      </div>
    </div>
  )
}
export default OfficialProfileAnalyticalChartsGeneralChart
