import React from 'react';
import { controlTable, controlButtons, controlDelete } from '../../widget/controls';
import session from '../../Session';

export default function () {
	return <div>
		{controlTable({
			url: 'user',
			toolbar: controlButtons([{
				href: 'create',
				title: 'New User',
				icon: 'fa fa-plus',
				style: 'btn btn-success ml-2',
			}])
		}, [{
			field: 'user_nama',
			title: 'Nama',
		}, {
			field: 'user_modal',
			title: 'Modal',
			formatter: session.formatRupiah,
		}, {
			field: 'user_harga',
			title: 'Harga',
			formatter: session.formatRupiah,
		}, {
			field: 'user_id',
			title: 'Action',
			formatter: (value) => (controlButtons([{
				href: `edit/${value}`,
				style: 'btn btn-sm btn-warning',
				icon: 'fa fa-edit',
			}, {
				href: controlDelete('user', value),
				key: 'del'+value,
				style: 'btn btn-sm btn-danger',
				icon: 'fa fa-trash',
				confirm: 'Yakin?'
			}]))
		}])
		}
	</div>
}
