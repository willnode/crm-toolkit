import React from 'react';
import Page, { SEO } from '../widget/page';
import GitHubIcon from '@material-ui/icons/GitHub'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import {publicUrl} from '../main/Config';

export default function Home() {

	return (<Page>
		<SEO
		title="Welcome to CRM Toolkit!"
		image={publicUrl + '/assets/splash.png'}
		description="CRM Toolkit is your starting template for bootstrapping any web application project."
		/>
		<h1>Welcome to CRM Toolkit!</h1>
		<p>CRM Toolkit is your starting template for bootstrapping any web application project.</p>
		<p>To begin exploring, login with username <code>admin</code> or <code>user</code>. The password
		for both account is equal with corresponding username.</p>
		<p>Check out our repo: <Button href="http://github.com/willnode/crm-toolkit" target="_blank"
			rel="noopener noreferrer"><GitHubIcon/> <Box marginLeft={1}>GitHub</Box></Button></p>
	</Page>)
}
