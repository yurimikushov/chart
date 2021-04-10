import { ColumnChart } from '../src'
import predictedWorldPopulation from './data/predictedWorldPopulation.json'

new ColumnChart(document.querySelector('.chart-container'), {
  title: 'Predicted world population (millions) in 2050',
  data: predictedWorldPopulation,
  size: {
    height: 400,
    width: 600,
  },
})
