import React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import MUISelect from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import MUICheckbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Redirect } from 'react-router-dom';

import {
  setMessage, setError, login, serverGet, history,
  serverDelete, serverPost, extractForm, popMessages, getQueryParam
} from '../main/Helper';
import { Context } from '../main/Contexts';
import { useRef } from 'react';
import { useHandleControlValidator, useHandlePropagateError } from './validators';
import { uploadsUrl } from '../main/Config';

function controlDelete(url, redirect) {
  popMessages();
  return (_) => {
    (serverDelete(url)
      .then(() => {
        if (redirect) redirect(url)
        window.setTimeout(() => setMessage('Successfully deleted'));
      })
      .catch((e) => setError(e))
    )
  }
}

function controlPost(url, redirect) {
  return (e) => {
    const form = extractForm(e);
    popMessages();
    (serverPost(url, form)
      .then((json) => {
        if (redirect) redirect(json, form)
        json.message && window.setTimeout(() => setMessage(json.message));
      }).catch((e) => setError(e))
    )
  }
}


function CheckRole({ role, children }) {
  return !login() || login().role !== role ? <Redirect to={"/login/?redirect=" + encodeURIComponent(history().location.pathname)} /> : children;
}


const Input = ({ name, validator, onChange, ...props }) => {
  const ref = useRef();
  const propagateError = useHandlePropagateError(ref);
  useHandleControlValidator(validator, ref);
  return <TextField
    name={name}
    inputRef={ref}
    fullWidth
    autoComplete={name}
    error={validator && propagateError && !!validator[0]}
    helperText={validator && propagateError && validator[0]}
    onChange={(e) => [validator && validator[3].current(e), onChange && onChange(e)]}
    onFocus={(e) => [e.target.didHasFocus = true, validator && validator[2].current()]}
    variant="outlined"
    margin="normal"
    {...props} />
}

const Select = ({ name, label, options, validator, onChange, ...props }) => {
  const ref = useRef();
  const propagateError = useHandlePropagateError(ref);
  useHandleControlValidator(validator, ref);
  return <FormControl margin="normal" variant="outlined" fullWidth>
    <InputLabel
      error={validator && propagateError && !!validator[0]}
      id={name + '-label'}
    >{label}</InputLabel>
    <MUISelect
      name={name}
      labelId={name + '-label'}
      label={label}
      onChange={(e) => [validator && validator[3].current(e), onChange && onChange(e)]}
      onFocus={(e) => [e.target.didHasFocus = true, validator && validator[2].current()]}
      {...props}
    >
      {
        Object.entries(options).map(([k, v]) => (
          <MenuItem key={k} value={k}>{v}</MenuItem>
        ))
      }
    </MUISelect>
    <FormHelperText>{validator && propagateError && validator[0]}</FormHelperText>
  </FormControl>
}

const Form = ({ action, redirect, onSubmit, children, ...props }) => {
  return (
    <Box width="100%" marginTop={1} clone>
      <form action={action} onSubmit={onSubmit || controlPost(action, redirect)} {...props}>
        {children}
      </form>
    </Box>)
}

const Submit = ({ label, color, variant, disabled, ...props }) => (
  <Button
    style={{
      marginTop: 8,
      marginBottom: 8,
      width: '100%',
    }}
    type="submit"
    variant={variant || "contained"}
    color={color || "primary"}
    disabled={Context.get('fetching') || disabled}
    {...props}
  >{Context.get('fetching') ? 'Sending...' : label || "Submit"}</Button>
)

const Checkbox = ({ name, checked, value, color, label, ...props }) => (
  <Box textAlign="left" marginY={1} width="100%" clone>
    <FormControlLabel
      control={<MUICheckbox
        name={name}
        defaultChecked={checked}
        value={value || "y"}
        color={color || "primary"}
        {...props}
      />}
      label={label}
    />
  </Box>
)

const CommandButton = ({ name, value, label, color, variant, disabled }) => {
  const ref = useRef();
  return <Box margin={1}>
    <input name={name || 'action'} ref={ref} type="checkbox" value={value || 'y'} hidden />
    <Button type="submit" color={color || 'default'}
      variant={variant || 'outlined'}
      onClick={() => ref.current.checked = true}
      disabled={Context.get('fetching') || disabled}
    >{label}</Button>
  </Box>
}

const FlexGroup = ({ label, children, ...props }) => {
  return <Box display="flex" {...props}>
    <Box flexGrow={1} className="MuiInputBase-root">{label}</Box>
    {children}
  </Box>
}

const File = ({ name, label, defaultValue, folder, readOnly, required, ...props }) => {
  const delRef = useRef();
  const [file, hasFile] = React.useState(0);
  return (
    <FlexGroup label={label}>
      <input name={name + "_delete"} ref={delRef} hidden />
      {file > 0 && <Button type="button" variant="text">1 File</Button>}
      <ButtonGroup>
        {!readOnly && <Button
          disabled={readOnly}
          type="button"
          component="label">
          {file ? 'Change' : 'Upload'}
          <input
            name={name} type="file" hidden {...props}
            onChange={(e) => hasFile(e.target.files.length)}
            required={required && !defaultValue}
          />
        </Button>}
        {defaultValue && (
          <Button type="button"
            target="_blank" rel="noreferrer noopener" download
            href={`${uploadsUrl}/${folder || name}/${defaultValue}`}>
            View
          </Button>
        )}
        {defaultValue && !readOnly && !required && <Button type="submit"
          onClick={() => delRef.current.value = 'y'}
          disabled={Context.get('fetching')}
        >Delete</Button>}
      </ButtonGroup>
    </FlexGroup>
  )
}

const BackButton = ({ label, color, variant, ...props }) => (
  <Button
    style={{
      marginTop: 8,
      marginBottom: 8,
      width: '100%',
    }}
    type="button"
    variant={variant || "outlined"}
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
  CommandButton,
  FlexGroup,
  Input,
  Select,
  Form,
  File,
  Submit,
  Checkbox,
  BackButton,
}