import React from 'react';
import session from '../main/Session';
import { useLocation } from 'react-router-dom';

function useQuery() {
	return new URLSearchParams(useLocation().search);
}

export default function Offline() {
	let reason = useQuery().get('reason');
	return <div>
		<div className="container text-center">
			<div className="h2 my-5">Error :(</div>
			<p>Sorry we have encontered problem</p>
			<button className="btn btn-lg btn-secondary my-4" onClick={() => session.history.goBack()}>Go Back</button>
			<p className="text-muted small">{reason}</p>
		</div>
	</div>
}