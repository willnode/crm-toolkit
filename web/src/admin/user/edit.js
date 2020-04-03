import React, { useState } from 'react';
import Page from '../../widget/page';
import {
	controlInput, controlSubmit, controlBack, controlPost
} from '../../widget/controls';
import { useParams } from 'react-router-dom';


export default function ({ id }) {
	if (id === null || id === undefined) {
		id = useParams().id;
	}
	const [d, setData] = useState(null);
	const data = (d && d.data);
	return (
		<Page src={'user/' + id} dataCallback={setData}>
			{!data ? '' : (
			<form onSubmit={controlPost('user', id)}>
				{controlInput({name: 'user_nama', label: 'Nama', value: data.user_nama, required: true})}
				{controlInput({name: 'user_kode', label: 'Kode', value: data.user_kode, required: true})}
				{controlInput({name: 'user_modal', label: 'Harga Beli', value: data.user_modal, required: true, type: 'number'})}
				{controlInput({name: 'user_harga', label: 'Harga Jual', value: data.user_harga, required: true, type: 'number'})}
				{controlSubmit()}
			</form>)}
			{controlBack()}
		</Page>)
}
