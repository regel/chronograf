import {toString} from './ast'

const InfluxQL = ast => ({
    // select: () =>
    toString: () => toString(ast),
  })

export default InfluxQL
