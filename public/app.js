import { ColumnChart } from '../src'
import predictedWorldPopulation from './data/predictedWorldPopulation.json'
import sales from './data/sales.json'
import minMax from './data/minMax.json'

new ColumnChart({
  title: 'Predicted world population (millions) in 2050',
  data: predictedWorldPopulation,
  size: {
    height: 250,
    width: 500,
  },
}).mount(document.querySelector('.chart-container'))

new ColumnChart({
  title: 'Sales, $',
  data: sales,
  size: {
    height: 250,
    width: 500,
  },
}).mount(document.querySelector('.chart-container'))

new ColumnChart({
  title: 'Min/Max Chart',
  data: minMax,
  size: {
    height: 250,
    width: 500,
  },
}).mount(document.querySelector('.chart-container'))
