
import React from 'react';
import { useTable } from 'react-table';
import { Page } from './page';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Icon from '@material-ui/core/Icon';
import { history, doReload } from '../main/Helper';
import { controlDelete } from './controls';
import TablePagination from '@material-ui/core/TablePagination';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';

function guessEndpoint() {
  return window.location.pathname.replace(/^\/+|\/+$/g, '');
}

function fromUriQuery() {
  return Object.fromEntries(new URLSearchParams(window.location.search).entries());
}

function SearchBar({ search, setSearch }) {
  const [innerSearch, setInnerSearch] = React.useState(search);
  React.useEffect(() => {
    setInnerSearch(search);
  }, [search]);

  return <TextField value={innerSearch}
    onChange={(e) => setInnerSearch(e.target.value)}
    variant="outlined"
    size="small"
    InputProps={{
      className: 'table-search-bar',
      onKeyPress: (e) => e.key === 'Enter' && setSearch(innerSearch),
      placeholder: "Search...",
      endAdornment: search !== innerSearch ? (
        <InputAdornment position="end">
          <IconButton onClick={() => setSearch(innerSearch)}>
            <Icon>search</Icon>
          </IconButton>
        </InputAdornment>
      ) : (search !== '' &&
        <InputAdornment position="end">
          <IconButton onClick={() => setSearch('')}>
            <Icon>clear</Icon>
          </IconButton>
        </InputAdornment>
        )
    }}
    onBlur={() => setSearch(innerSearch)} />
}


function toolbarActions(actions, endpoint) {
  endpoint = endpoint || guessEndpoint();
  const renders = (actions || []).map((act) => {
    if (typeof act === 'string') {
      return [{
        key: 'archive',
        icon: () => getQueryParam('archived') ? <Icon>inbox</Icon> : <Icon>archive</Icon>,
        tooltip: 'Toggle Archive',
        onClick: () => history().replace(`?archived=${getQueryParam('archived') ? '' : '1'}`),
      }, {
        key: 'create',
        icon: () => <Icon>add</Icon>,
        tooltip: 'New',
        onClick: () => history().push(`/${endpoint}/create`)
      }].find((x) => x.key === act);
    } else return act;
  }).filter(x => !!x)

  return renders.map(({ key, icon: Icon, tooltip, onClick }) => (
    <IconButton key={key} title={tooltip} onClick={() => onClick()}><Icon /></IconButton>
  ))
}

function TableToolbar({ numSelected, title, searchable, search, setSearch, actions }) {
  return (
    <Toolbar disableGutters color={numSelected > 0 ? 'primary' : undefined}>
      {
        actions && actions.includes('back') && (
          <IconButton title="Go Back" onClick={() => history().goBack()}><Icon>arrow_back</Icon></IconButton>
        )
      }
      <div className="table-toolbar-gutters">
        {numSelected > 0 ? (
          <Typography className="table-title" color="inherit" variant="subtitle1" component="div">
            {numSelected} selected
          </Typography>
        ) : (
            <Typography className="table-title" variant="h6" component="h1">
              {title}
            </Typography>
          )}
        {!numSelected && (
          <>
            {searchable === false ? null : <SearchBar search={search} setSearch={setSearch} />}
            {actions && toolbarActions(actions)}
          </>
        )}
      </div>
    </Toolbar>
  );
}

function actionColumns(actions, label, title, endpoint) {
  title = title || 'Actions';
  endpoint = endpoint || guessEndpoint();
  const renders = (actions || []).map((act) => {
    if (typeof act === 'string') {
      return [{
        key: 'detail',
        icon: () => <Icon>input</Icon>,
        tooltip: 'Open ' + label,
        onClick: (id) => history().push(`/${endpoint}/detail/` + id),
      }, {
        key: 'edit',
        icon: () => <Icon>edit</Icon>,
        tooltip: 'Edit ' + label,
        onClick: (id) => history().push(`/${endpoint}/edit/` + id),
      }, {
        key: 'delete',
        icon: () => <Icon>delete</Icon>,
        tooltip: 'Delete ' + label,
        onClick: (id) => (
          window.confirm(`Are you sure you want to delete this ${label}?`) &&
          controlDelete(`${endpoint}/${id}`, (() => { doReload() }))()
        ),
      }].find((x) => x.key === act);
    } else return act;
  }).filter(x => !!x)

  return {
    title,
    render: ({ value }) => renders.map(({ key, icon: Icon, tooltip, onClick }) => (
      <IconButton key={key} title={tooltip} onClick={() => onClick(value)}><Icon /></IconButton>
    )),
    className: 'table-column-dense',
  }
}

function DataTable({ columns, data, options, totalCount, parameters, setParameters }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })

  // Render the UI for your table
  return (
    <TableContainer>
      <TableToolbar
        title={options.title}
        searchable={options.searchable}
        search={parameters.search}
        setSearch={(v) => setParameters({ ...parameters, search: v })}
        actions={options.actions}
      />
      <Table {...getTableProps(options.tableProps)}>
        <TableHead>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <TableCell {...column.getHeaderProps()}>{column.render('Header')}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <TableCell {...cell.getCellProps({
                    className: cell.column.className
                  })}>{cell.render('Cell')}</TableCell>
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={totalCount}
        rowsPerPage={parameters.pageSize}
        page={parameters.page}
        onChangePage={(e, p) => setParameters({ ...parameters, page: p })}
        onChangeRowsPerPage={(e) => setParameters({ ...parameters, pageSize: e.target.value })}
      />
    </TableContainer>
  )
}

function RemoteTable({ src, options, columns }) {

  // Get queried source path ------
  src = src || guessEndpoint();
  options = options || {};
  const [parameters, setParameters] = React.useState(() => ({
    page: 0,
    pageSize: 10,
    orderBy: null,
    orderDirection: 'asc',
    groupBy: null,
    search: '',
    archived: false,
    // For advanced filters, can use explicit or from GET query
    ...(options.filters || fromUriQuery()),
  }));
  const realsrc = React.useMemo(() => {
    let params = Object.fromEntries(
      Array.from(Object.entries(parameters)).filter(([k, v]) => v)
    );
    console.log(params);
    return src + '?' + new URLSearchParams(params).toString();
  }, [src, parameters])

  // Process column --------------
  columns = React.useMemo(() => {
    if (typeof columns === 'object') {
      return Object.entries(columns).map((([key, column]) => {
        if (typeof column === 'string') {
          return { Header: column, accessor: key };
        } else {
          const {
            title, render, accessor, ...props
          } = column;
          return {
            Header: title,
            accessor: accessor || key,
            Cell: render,
            ...props
          };
        }
      }));
    } else {
      return columns || [];
    }
  }, []); // Just always assume only get updated once

  // Fire the table ---------
  return <Page className="paper table" src={realsrc}>
    {({ totalCount, data }) => (
      <DataTable {...{ totalCount, data, columns, options, parameters, setParameters }} />
    )}
  </Page>
}

export { DataTable, RemoteTable, actionColumns }