import React from 'react';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import { Page, SEO } from '../widget/page';
import GitHubIcon from '../media/icons/github.svg';
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
    <p>Check out our repo at <Button href="http://github.com/willnode/crm-toolkit" target="_blank"
      rel="noopener noreferrer"><Icon><svg className="embed"><use xlinkHref={GitHubIcon} /></svg></Icon>
      <span style={{ marginLeft: '0.5em' }}>GitHub</span></Button></p>
  </Page>)
}
