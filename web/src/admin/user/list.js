import React from 'react';
import { RemoteTable } from '../../widget/controls';
import { getAvatarUrl } from '../../main/Helper';

export default function () {
	return <RemoteTable
		title="Users"
		src="admin/user"
		itemKey="login_id"
		itemLabel="User"
		predefinedActions={['add', 'edit', 'delete']}
		columns={{
			avatar: {
				title: 'Avatar',
				render: row => (
					<img alt={row.name}
						style={{ height: 40, borderRadius: '50%' }}
						src={getAvatarUrl(row.avatar)}
					/>
				),
				width: '1%',
			},
			name: 'Name',
			email: 'Email',
		}} />
}
