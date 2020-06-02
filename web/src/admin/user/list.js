import React from 'react';
import { getAvatarUrl } from '../../main/Helper';
import { RemoteTable, actionColumns } from '../../widget/table';

export default function () {
  return <RemoteTable
    options={{
      title: "Users",
      actions: ['back', 'create'],
    }}
    columns={{
      avatar: {
        title: 'Avatar',
        render: ({ value }) => (
          <img alt={value}
            style={{ height: 40, borderRadius: '50%' }}
            src={getAvatarUrl(value)}
          />
        ),
        className: 'table-column-dense',
      },
      name: 'Name',
      email: 'Email',
      login_id: actionColumns(['detail', 'edit', 'delete'], 'User'),
    }} />
}
