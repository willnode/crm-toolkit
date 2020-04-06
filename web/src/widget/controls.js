import React from 'react';
import { Redirect } from 'react-router-dom';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MUISelect from '@material-ui/core/Select';
import MUICheckbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import Box from '@material-ui/core/Box';
import { setMessage, setError, login, serverDelete, serverPost, history, extractForm } from '../main/Helper';
import { Context } from '../main/Contexts';

function controlDelete(url) {
	return (_) => {
		(serverDelete(url)
			.then(() => setMessage('Successfully deleted'))
			.catch((e) => setError(e))
		)
	}
}

function controlPost(url, redirect) {
	return (e) => {
		const data = extractForm(e);
		(serverPost(url, data)
			.then((d) => {
				setMessage('Successfully saved');
				if (redirect) redirect(data, d)
			}).catch((e) => setError(e))
		)
	}
}

function CheckRole({ role, children }) {
	return !login() || login().role !== role ? <Redirect to="/login" /> : children;
}

const Input = ({ name, value, id, autoComplete, ...props }) => (
	<TextField
		name={name}
		id={id || name}
		fullWidth
		defaultValue={value}
		autoComplete={autoComplete || name}
		margin='normal'
		{...props} />
)


const Select = ({ name, label, id, options, value, ...props }) => (
	<FormControl margin='normal' fullWidth>
		<InputLabel id={name+'-label'}>{label}</InputLabel>
		<MUISelect
			name={name}
			id={id || name}
			labelId={name+'-label'}
			defaultValue={value}
			label={label}
			{...props}
		>
			{
				Object.entries(options).map(([k, v]) => <MenuItem key={k} value={k}>{v}</MenuItem>)
			}
		</MUISelect>
	</FormControl>
)

const Form = ({ action, redirect, onSubmit, children }) => {
	return (
		<Box width="100%" marginTop={1} clone>
			<form onSubmit={onSubmit || controlPost(action, redirect)}>
				{children}
			</form>
		</Box>)
}

const Submit = ({ label, color, variant, ...props }) => (
	<Button
		style={{
			marginTop: 8,
			marginBottom: 8,
			width: '100%',
		}}
		type="submit"
		variant={variant || "contained"}
		color={color || "primary"}
		disabled={Context.get('fetching')}
		{...props}
	>{Context.get('fetching') ? 'Sending...' : label || "Submit"}</Button>
)

const Checkbox = ({ name, id, checked, value, color, label, ...props }) => (
	<Box textAlign="left" marginY={1} width="100%" clone>
		<FormControlLabel
			control={<MUICheckbox
				name={name}
				id={id || name}
				defaultChecked={checked}
				value={value || "y"}
				color={color || "primary"}
				{...props}
			/>}
			label={label}
		/>
	</Box>
)

const BackButton = ({ label, color, variant, ...props }) => (
	<Button
		style={{
			marginTop: 8,
			marginBottom: 8,
			width: '100%',
		}}
		type="button"
		variant={variant || "contained"}
		color={color || "secondary"}
		disabled={Context.get('fetching')}
		onClick={() => history().goBack()}
		{...props}
	>{label || "Go Back"}</Button>
)


export {
	controlPost,
	controlDelete,
	CheckRole,
	Input,
	Select,
	Form,
	Submit,
	Checkbox,
	BackButton,
}