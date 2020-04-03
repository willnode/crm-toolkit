import React from 'react';
import { Link } from 'react-router-dom';

export default function () {
	return (
		<>
		<li className="nav-item dropdown">
			<a className="nav-link dropdown-toggle" href="/#" role="button" data-toggle="dropdown">
				E-Kasir
			</a>
			<div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" >
				<Link className="dropdown-item" to="/admin/">
					<i className="fas fa-home fa-sm fa-fw mr-2 text-gray-400"></i>
					Kasir
				</Link>
				<div className="dropdown-divider"></div>
				<Link className="dropdown-item" to="/admin/barang/">
					<i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
					Barang
				</Link>
				<Link className="dropdown-item" to="/admin/transaksi/">
					<i className="fas fa-money-bill fa-sm fa-fw mr-2 text-gray-400"></i>
					History
				</Link>
				<Link className="dropdown-item" to="/admin/transaksi/laporan/harian">
					<i className="fas fa-money-bill fa-sm fa-fw mr-2 text-gray-400"></i>
					Laporan
				</Link>
			</div>
			</li>
		</>
	)
}