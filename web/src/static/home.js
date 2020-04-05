import React from 'react';
import Page from '../widget/page';
import GitHubIcon from '@material-ui/icons/GitHub'

export default function Home() {

	return (<Page>
		<h1>Welcome to CRM Toolkit!</h1>
		<p><a href="http://github.com/willnode/crm-toolkit" target="_blank" rel="noopener noreferrer"><GitHubIcon /></a></p>
	</Page>)
}