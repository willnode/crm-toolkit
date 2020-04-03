import React, { useState } from 'react';
import session from '../Session';
import { controlPost } from '../widget/controls';

function ListBarang({ data, idx, setQty }) {
	return <div className="card my-2">
		<input type="hidden" name={`struk[${idx}][barang_id]`} defaultValue={data.barang_id} />
		<input type="hidden" name={`struk[${idx}][struk_modal_barang]`} defaultValue={data.barang_modal} />
		<input type="hidden" name={`struk[${idx}][struk_harga_barang]`} defaultValue={data.barang_harga} />
		<div className="row no-gutters">
			<div className="col-md-6 form-control px-2">
				{data.barang_nama}
			</div>
			<div className="col-md-3 col-sm-6 form-control px-2">
				{session.formatRupiah(data.barang_harga)}
			</div>
			<div className="col-md-3 col-sm-6">
				<input type="number" className="form-control" name={`struk[${idx}][struk_qty]`} value={data.struk_qty} onChange={setQty} />
			</div>
		</div>
	</div>
}
export default function () {
	const [data, setData] = useState([]);
	const [fill, setFill] = useState("");
	return (
		<form onSubmit={controlPost('transaksi', null)}>
			<h1>Kasir</h1>
			{
				data.map((v, i) => <ListBarang key={v.barang_kode} idx={i} data={v} setQty={(e) => {
					data[i].struk_qty = e.target.value;
					setData([...data]);
				}} />)
			}
			<input type="text" className="form-control" value={fill} onChange={(e) => setFill(e.target.value)} onKeyDown={(e) => {
				if (e.key === 'Enter') {
					e.preventDefault();
					const flag1 = data.findIndex((v) => v.barang_kode === e.target.value);
					if (flag1 !== -1) {
						data[flag1].struk_qty++;
					}
					else {
						const pos = data.length;
						data.push({
							barang_kode: e.target.value,
							status: 'Loading',
							struk_qty: 1,
						});
						session.getByRole('barang?search=' + encodeURIComponent(e.target.value)).then(d => {
							if (d.rows.length === 0) {
								data.pop();
							} else {
								let flag2 = data.findIndex((v) => v.barang_id === d.rows[0].barang_id);
								if (flag2 !== -1) {
									data[flag2].struk_qty++;
									data.pop();
								} else {
									data[pos] = {
										...data[pos],
										...d.rows[0],
									}
									data[pos].status = 'OK';
								}
							}
							setData([...data]);
						});
					}
					setData([...data]);
					setFill("");
				}
			}} />
			<input type="submit" value="Checkout" className="my-2 btn btn-block btn-primary"/>
		</form>
	)
}