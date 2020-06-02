import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Edit from './edit';
import List from './list';
import Detail from './detail';

export default ({ match }) => (
	<Switch>
		<Route exact path={match.url+'/'} component={List}/>
		<Route exact path={match.url+'/create'}  component={Edit} />
		<Route exact path={match.url+'/edit/:id'} component={Edit} />
		<Route exact path={match.url+'/detail/:id'} component={Detail} />
	</Switch>
)