import { ColumnChart } from '../src'
import predictedWorldPopulation from './data/predictedWorldPopulation.json'
import sales from './data/sales.json'

new ColumnChart({
  title: 'Predicted world population (millions) in 2050',
  data: predictedWorldPopulation,
  size: {
    height: 400,
    width: 600,
  },
}).mount(document.querySelector('.chart-container'))

new ColumnChart({
  title: 'Sales, $',
  data: sales,
  size: {
    height: 400,
    width: 600,
  },
}).mount(document.querySelector('.chart-container'))
