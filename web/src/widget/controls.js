import React, { useEffect, useMemo, useState } from 'react';
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
import {
	setMessage, setError, login, serverGet,
	serverDelete, serverPost, history, extractForm
} from '../main/Helper';
import { Context } from '../main/Contexts';
import MaterialTable from 'material-table';
import { useRef } from 'react';

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

function useHandleControlValidator(validator, ref) {
	if (validator) {
		validator[2].current = () => validator[1]({ target: ref.current });
	}
	useEffect(() => {
		if (validator)
			validator[2].current();
	}, []);
}

const Input = ({ name, autoComplete, validator, ...props }) => {
	const ref = useRef();
	useHandleControlValidator(validator, ref);
	return <TextField
		name={name}
		inputRef={ref}
		fullWidth
		autoComplete={autoComplete || name}
		error={validator && !!validator[0]}
		helperText={validator && validator[0]}
		onChange={validator && (e => validator[3].current(e))}
		margin='normal'
		{...props} />
}

const Select = ({ name, label, options, validator, ...props }) => {
	const ref = useRef();
	useHandleControlValidator(validator, ref);
	return <FormControl margin='normal' fullWidth>
		<InputLabel
			error={validator && !!validator[0]}
			helperText={validator && validator[0]}
			id={name + '-label'}
		>{label}</InputLabel>
		<MUISelect
			name={name}
			labelId={name + '-label'}
			label={label}
			onChange={validator && (e => validator[3].current(e))}
			{...props}
		>
			{
				Object.entries(options).map(([k, v]) => (
					<MenuItem key={k} value={k}>{v}</MenuItem>
				))
			}
		</MUISelect>
	</FormControl>
}

const Form = ({ action, redirect, onSubmit, children }) => {
	const builtinSubmit = e => {
		if (document && document.activeElement) document.activeElement.blur();
		controlPost(action, redirect)(e);
	}
	return (
		<Box width="100%" marginTop={1} clone>
			<form onSubmit={onSubmit ? (e) => onSubmit(e, builtinSubmit) : builtinSubmit}>
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

function RemoteTable({ src, itemKey, itemLabel, predefinedActions, title, actions, options, columns, data, ...props }) {
	let mounted = useRef(true);
	useEffect(() => (() => mounted.current = false), []);
	actions = useMemo(() => {
		return [...(actions || []), ...([
			{
				icon: 'add',
				tooltip: 'Add ' + itemLabel,
				isFreeAction: true,
				onClick: () => history().push(`/${src}/create`)
			}, {
				icon: 'detail',
				tooltip: 'Open ' + itemLabel,
				onClick: (e, row) => history().push(`/${src}/detail/` + row[itemKey]),
			}, {
				icon: 'edit',
				tooltip: 'Edit ' + itemLabel,
				onClick: (e, row) => history().push(`/${src}/edit/` + row[itemKey]),
			}, {
				icon: 'delete',
				tooltip: 'Delete ' + itemLabel,
				onClick: (e, row) => window.confirm(`Are you sure you want to delete this ${itemLabel}?`) && controlDelete(`${src}/${row[itemKey]}`)(),
			}
		].filter(x => (predefinedActions || []).includes(x.icon)))];
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []) // Always only updated once
	columns = useMemo(() => {
		if (typeof columns === 'object') {
			return Object.entries(columns).map((([field, column]) => {
				if (typeof column === 'string') {
					return { title: column, field };
				} else {
					return { ...column, field };
				}
			}));
		} else {
			return columns || [];
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Always only updated once
	data = data || (query => new Promise((resolve, reject) => {
		let url = src + '?' + new URLSearchParams(query).toString();
		serverGet(url).then(r => mounted.current && resolve(r));
	})); // Already sync with our server
	options = options || {};
	options.actionsColumnIndex = -1;
	props = { ...props, actions, columns, options, data, title }
	return <MaterialTable {...props} />
}


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
	RemoteTable,
}