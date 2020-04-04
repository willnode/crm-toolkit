import React from 'react';
import session from '../main/Session';
import { Link, Redirect, useParams } from 'react-router-dom';

function controlError() {
	return ''; //TODO
}
/**
 * Internal usage; Add label && validation error message before it.
 */
function controlLabel(attr) {
	return (
		<>
			{controlError(attr.name || '')}
			<label className="col-md-3 position-relative mb-2 mt-3 my-md-auto"
				htmlFor={attr.name || ''}>{attr.label || ''}</label>
		</>
	)
}

/**
 * Internal usage; Exp&& HTML attributes with additional checks
 */
function controlAttrs(attr) {
	attr.name && !attr.id && (attr.id = attr.name);
	attr.className = attr.class || (attr.class = 'form-control');
	attr.value && (attr.defaultValue = attr.value);
	attr.checked && (attr.defaultChecked = attr.checked);
	delete attr.label;
	delete attr.class;
	delete attr.value;
	delete attr.checked;
	attr.modalValue && (attr.value = attr.modalValue);
	attr.modalChecked && (attr.value = attr.modalChecked);
	delete attr.modalValue;
	delete attr.modalChecked;
	return attr;
}

function controlAttrsData(attr) {
	let a = {};
	Object.entries(attr).forEach(([k, v]) => a['data-' + k] = v);
	return a;
}

/**
 * Readonly, unsubmittable form input
 */
function controlDiv(attr) {
	const value = attr.value;
	delete attr.value;
	return <div className="form-group row">
		{controlLabel(attr)}
		<div className="col-md-9">
			<div {...controlAttrs(attr)}>{value}</div>
		</div>
	</div>
}

/**
 * General form <input>
 */
function controlInput(attr) {
	if (!attr.type || attr.type === 'text' ) {
		attr.maxLength = 255;
	}
	return (<div className="form-group row">
		{controlLabel(attr)}
		<div className="col-md-9">
			<input {...controlAttrs(attr)} />
		</div>
	</div>)
}


function controlToggle(attr) {
	const label = attr.label;
	return (<div className="form-group row togglebutton">
		<div className="col-md-3">
		</div>
		<div className="col-md-9">
			<label>
				<input type="checkbox"{...controlAttrs(attr)} />
				<span className="toggle"></span>
				{label}
			</label>
		</div>
	</div>)
}

/**
 * Form submit button
 */
function controlSubmit() {
	return controlInput({ name: 'form_submit', type: 'submit', class: 'form-control btn btn-primary', value: "Submit" });
}

/**
 * Form submit button
 */
function controlBack() {
	return controlDiv({
		class: ' ', value:
			<button onClick={session.history.goBack} className="btn btn-secondary form-control ">Kembali</button>
	});
}

/**
 * General form <textarea>
 */
function controlTextarea(attr) {
	return (<div className="form-group row">
		{controlLabel(attr)}
		<div className="col-md-9">
			<textarea {...controlAttrs(attr)} />
		</div>
	</div >)
}

function controlOption(attr) {
	const { value, options, optionKey, optionValue } = attr;
	delete attr.options;
	delete attr.optionKey;
	delete attr.optionValue;
	delete attr.value;
	return <div className="form-group row">
		{controlLabel(attr)}

		<div className="col-md-9">
			<select {...controlAttrs(attr)} defaultValue={value}>
				{
					options.map(v => <option key={v[optionKey]} value={v[optionKey]}>
						{v[optionValue]}</option>)
				}
			</select>
		</div >
	</div >
}

/**
 * Input file with download button if file actually exist.
 * (proper h&&ling for backend should be done with controlFile_upload)
 */
function controlFile(attr, image = false) {
	const file = session.baseUrl(`uploads/${attr.folder}/${attr.value}`);
	const value = attr.value;
	const name = attr.name || '';
	const readonly = attr.readonly && attr.readonly !== false;
	delete attr.value;
	return <div className="form-group row">
		{controlLabel(attr)}
		<div className="col-md-9">
			{
				!readonly ? <input type="file" {...controlAttrs(attr)} /> : ''
			}
			{
				value ? (<div className="form-control mt-2 p-2 h-auto">
					{
						image ?
							<img src={file} alt="" className="mb-2 d-block" style={{ maxHeight: `200px`, maxWidth: '100%' }} />
							: ''
					}
					{controlButtons([{
						title: 'Download',
						icon: 'fa fa-download',
						style: 'btn btn-outline-success',
						value: file,
						type: 'download'
					}])}
					{
						!readonly ? controlButtons([{
							name: name + '_delete',
							title: 'Delete',
							icon: 'fa fa-trash',
							style: 'btn btn-outline-danger',
							confirm: 'Are you sure?'
						}]) : ''
					}

					<span>{value}</span>
				</div>) : ''
			}
		</div>
	</div>

}

/**
 * Input file, but for image
 */
function controlImage(attr) {
	return controlFile(attr, true);
}

/**
* Input behaviors via button (like alternative submit for specific action or other UX behaviours)
*/
function controlButtons(buttons, style = 'btn-group') {
	return <div className={style + " d-inline-flex no-wrap"}>
		{
			buttons.map(button => {
				const name = button.name ? button.name : '';
				const title = button.title ? <span className="ml-2">{button.title}</span> : '';
				const icon = button.icon ? button.icon : "fa fa-info";
				const style = button.style ? button.style : "btn btn-outline-primary";
				const conf = button.confirm ? () => window.confirm(button.confirm) : () => true;
				let value;
				let type;
				if (button.href) {
					value = button.href;
					type = button.type ? button.type : (button.href instanceof Function ? 'button' : 'link');
					console.log(type);
				} else {
					value = button.value ? button.value : 'y';
					type = button.type ? button.type : 'submit';
				}
				const id = button.key || name + value;

				switch (type) {
					case 'submit':
						return <div key={id} onClick={(e) => {if(conf()) {var f = window.$(e.target).parents('form')[0];
							f[name].checked=true;f.dispatchEvent(new Event('submit', { bubbles: true}));}}}
							className={style} style={{cursor: 'pointer'}}><i className={icon}></i>
							<input type="checkbox" hidden name={name} value={value} />{title}</div>
					case 'download':
						return <a key={id} onClick={() => conf()} href={value} target="_blank" rel="noopener noreferrer" className={style} download>
							<i className={icon}></i>{title}</a>
					case 'link':
						return <Link key={id} onClick={() => conf()} to={value} className={style}>
							<i className={icon}></i>{title}</Link>
					case 'button':
						window.callbacks[id] = () => conf() ? value() : '';
						return <button key={id} onClick={window.callbacks[id]} data-onclick={id} className={style}>
							<i className={icon}></i>{title}</button>
					case 'copy':
						return <button key={id} onClick={() => {if(conf()) prompt('Copy this text (Ctrl+C):', value); return false}} className={style}>
							<i className={icon}></i>{title}</button>
					default:
						return '';
				}
			})
		}
	</div>
}

function controlDelete(url,id) {
	return (_) => {
		(session.deleteByRole(url+'/'+id)
		.then(() => session.setMessage('Successfully deleted'))
		.catch((e) => session.setError(e))
		)
	}
}

function controlPost(url,id) {
	return (e) => {
		(session.postByRole(id ? url+'/' + id : url, session.extract(e))
		.then(() => id === 0 ? (session.message = 'Successfully saved' && session.history.goBack()) : session.setMessage('Successfully Saved'))
		.catch((e) => session.setError(e))
		)
	}
}

function CheckRole ({role, children}) {
	return !session.login || session.login.role !== role ? <Redirect to="/login" /> : children;
}

function AssignID({ component }) {
	const id = useParams('id');
	return React.createElement(component, {id: id});
}

export {
	controlError,
	controlAttrs,
	controlAttrsData,
	controlDiv,
	controlInput,
	controlToggle,
	controlSubmit,
	controlBack,
	controlTextarea,
	controlOption,
	controlFile,
	controlImage,
	controlButtons,
	controlPost,
	controlDelete,
	CheckRole,
	AssignID,
}