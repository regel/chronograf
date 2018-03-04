import React, {PropTypes} from 'react'

import SideNav from 'src/side_nav'
import Notifications from 'shared/components/Notifications'

const App = ({children}) =>
  <div className="chronograf-root">
    <Notifications />
    <SideNav />
    {children}
  </div>

const {node} = PropTypes

App.propTypes = {
  children: node.isRequired,
}

export default App
