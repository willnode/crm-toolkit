import React from 'react';
import MaterialTable from 'material-table';
import { controlDelete } from '../../widget/controls';
import { history, getAvatarUrl, serverGet } from '../../main/Helper';

export default class Table extends React.Component {
	componentDidMount() {
		this.mounted = true;
	}
	componentWillUnmount() {
		this.mounted = false;
	}
	render() {
		return <MaterialTable
			title="Users"
			actions={[
				{
					icon: 'add',
					tooltip: 'Add User',
					isFreeAction: true,
					onClick: (event) => {
						history().push('/admin/user/create');
					}
				}, {
					icon: 'edit',
					tooltip: 'Edit User',
					onClick: (event, rowData) => {
						history().push('/admin/user/edit/' + rowData.login_id);
					}
				}, {
					icon: 'delete',
					tooltip: 'Delete User',
					onClick: (event, rowData) => {
						if (window.confirm("Are you sure?")) {
							controlDelete('/admin/user/' + rowData.login_id);
						}
					}
				}
			]}
			columns={[
				{
					title: 'Avatar',
					field: 'avatar',
					render: rowData => (
						<img alt={rowData.name}
							style={{ height: 36, borderRadius: '50%' }}
							src={getAvatarUrl(rowData.avatar)}
						/>
					),
					width: '1%',
				},
				{ title: 'Name', field: 'name' },
				{ title: 'Email', field: 'email' },
			]}//.map(({ cellStyle, ...x}) => ({ ...x, cellStyle: { padding: '4px', ...(cellStyle || {}) }}))}
			data={query => new Promise((resolve, reject) => {
				let url = '/admin/user/?' + new URLSearchParams(query).toString();
				serverGet(url).then(r => this.mounted && resolve(r));
			})}
			options={{
				actionsColumnIndex: -1
			}}
		/>
	}
}
