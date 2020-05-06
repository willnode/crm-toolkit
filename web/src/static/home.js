import React from 'react';
import { Page, SEO } from '../widget/page';
import GitHubIcon from '@material-ui/icons/GitHub'
import Button from '@material-ui/core/Button';
import { publicUrl, appTitle } from '../main/Config';

export default function Home() {
  return (<Page className="paper center" maxWidth="md">
    <SEO
      title={`Welcome to ${appTitle}!`}
      image={publicUrl + '/assets/splash.png'}
      description="CRM Toolkit is your starting template for bootstrapping any web application project."
    />
    <h1>Welcome to {appTitle}!</h1>
    <p>CRM Toolkit is your starting template for bootstrapping any web application project.</p>
    <p>To begin exploring, login with username <code>admin</code> or <code>user</code>. The password
		for both account is equal with corresponding username.</p>
    <p>Check out our repo: <Button href="http://github.com/willnode/crm-toolkit" target="_blank"
      rel="noopener noreferrer"><GitHubIcon /> <span style={{ marginLeft: '0.5em' }}>GitHub</span></Button></p>
  </Page>)
}
