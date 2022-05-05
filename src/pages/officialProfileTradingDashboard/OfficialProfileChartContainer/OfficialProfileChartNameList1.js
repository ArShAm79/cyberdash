import { MenuItem, Paper, Select, Typography } from '@material-ui/core'
import { useState } from 'react'
import useStyles from './styles/OfficialProfileChartNameList1.styles'
import { Scatter } from 'react-chartjs-2'
import 'chart.js/auto'

import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js'
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend)

const OfficialProfileChartNameList1 = () => {
  const classes = useStyles()
  const [timeFrameValue, settimeFrameValue] = useState(1)
  const [floorVar, setfloorVar] = useState(0)
  const [raity, setraity] = useState(0)
  return (
    <Paper className={classes.paper}>
      <div className={classes.topPart}>
        <div>
          <Typography className={classes.topPartTitle}>Time Frame</Typography>
          <Select
            value={timeFrameValue}
            variant="outlined"
            className={classes.selector}
            MenuProps={{
              PaperProps: { className: classes.menuPaper },
              getContentAnchorEl: null,
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left'
              }
            }}
            onChange={(e) => settimeFrameValue(e.target.value)}>
            {Array(5)
              .fill(null)
              .map((item, index) => (
                <MenuItem
                  value={index + 1}
                  className={classes.menuItem}
                  key={index.toString()}>
                  {`${index + 1} Hour`}
                </MenuItem>
              ))}
          </Select>
        </div>
        <div>
          <Typography className={classes.topPartTitle}>Floor Var</Typography>
          <Select
            value={floorVar}
            variant="outlined"
            className={classes.selector}
            MenuProps={{
              PaperProps: { className: classes.menuPaper },
              getContentAnchorEl: null,
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left'
              }
            }}
            onChange={(e) => setfloorVar(e.target.value)}>
            {Array(11)
              .fill(null)
              .map((item, index) => (
                <MenuItem
                  value={index * 10}
                  className={classes.menuItem}
                  key={index.toString()}>
                  {`${index * 10}%`}
                </MenuItem>
              ))}
          </Select>
        </div>
        <div>
          <Typography className={classes.topPartTitle}>Raity</Typography>
          <Select
            value={raity}
            variant="outlined"
            className={classes.selector}
            MenuProps={{
              PaperProps: { className: classes.menuPaper },
              getContentAnchorEl: null,
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left'
              }
            }}
            onChange={(e) => setraity(e.target.value)}>
            {Array(11)
              .fill(null)
              .map((item, index) => (
                <MenuItem
                  value={index * 10}
                  className={classes.menuItem}
                  key={index.toString()}>
                  {`${index * 10}x`}
                </MenuItem>
              ))}
          </Select>
        </div>
      </div>
      <Scatter
        height={75}
        width="100%"
        options={{
          // maintainAspectRatio: false,

          scales: {}
        }}
        data={{
          labels: ['6:55 AM', '9:55 AM', '10:55 AM', '11:55 AM', '12:55 AM'],
          datasets: [
            {
              label: '',
              data: [
                {
                  x: 2,
                  y: 0.5
                },
                {
                  x: 1,
                  y: 0.4
                },
                {
                  x: 0.5,
                  y: 0.2
                },
                {
                  x: 0.5,
                  y: 0
                }
              ],
              // showLine: false,
              backgroundColor: 'rgb(255, 99, 132)'
            }
          ]
        }}
      />
    </Paper>
  )
}
export default OfficialProfileChartNameList1
