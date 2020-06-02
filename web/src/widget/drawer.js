import React, { useState, useEffect } from 'react';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import Toolbar from '@material-ui/core/Toolbar';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from 'react-router-dom';
import { Context } from '../main/Contexts';

const DrawerListItem = ({ to, icon, label }) => (
  <ListItem component={Link} onClick={() => Context.set('drawerOpen', false)} button to={to}>
    <ListItemIcon>{React.createElement(icon)}</ListItemIcon>
    <ListItemText primary={label} />
  </ListItem>
)

function DrawerComponent({ children }) {
  let [drawerOpen, setDrawerOpen] = Context.bind('drawerOpen', useState(false));
  useEffect(() => (() => Context.unbind('drawerOpen')), [])
  let classes = { paper: 'drawer-paper' }
  return (
    <nav>
      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          classes={classes}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          ModalProps={{ keepMounted: true }}
        >
          <div className='drawer-container'>
            {children}
          </div>
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <div className="drawer-paper">
          {/* Dummy div for holding the fixed drawer */}
        </div>
        <Drawer
          classes={classes}
          variant="permanent"
          open
        >
          <Toolbar />
          <div className='drawer-container'>
            {children}
          </div>
        </Drawer>
      </Hidden>
    </nav>
  )
}

export {
  DrawerComponent, DrawerListItem
}