import { Fragment } from 'react'
import HyTable, { HyRow, StyledTableCell, StyledTableRow } from './HyTable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'

export default function FilesTable(props) {
  const { fileList, dropdownElems, tableConfig, updateTableConfig, getFiles } = props
  const mainBody = (row) => (
    <Fragment>
      <StyledTableCell>{row.file_id}</StyledTableCell>
      <StyledTableCell>{row.name}</StyledTableCell>
      <StyledTableCell>{String.raw`${row.path}`}</StyledTableCell>
      <StyledTableCell>{row.extension}</StyledTableCell>
      <StyledTableCell>{row.size}</StyledTableCell>
      <StyledTableCell>
        {new Date(row.date_created).toLocaleString('en-US', { timeZone: 'UTC' })}
      </StyledTableCell>
      <StyledTableCell>
        {new Date(row.date_modified).toLocaleString('en-US', { timeZone: 'UTC' })}
      </StyledTableCell>
      <StyledTableCell>
        {new Date(row.date_ingested).toLocaleString('en-US', { timeZone: 'UTC' })}
      </StyledTableCell>
      <StyledTableCell sx={{ width: '75px' }}>{dropdownElems(row)}</StyledTableCell>
    </Fragment>
  )

  const tableHeader = (
    <StyledTableRow>
      <StyledTableCell>ID</StyledTableCell>
      <StyledTableCell>Name</StyledTableCell>
      <StyledTableCell>Path</StyledTableCell>
      <StyledTableCell>Extension</StyledTableCell>
      <StyledTableCell>Size</StyledTableCell>
      <StyledTableCell>Created</StyledTableCell>
      <StyledTableCell>Modified</StyledTableCell>
      <StyledTableCell>Ingested</StyledTableCell>
      <StyledTableCell></StyledTableCell>
    </StyledTableRow>
  )

  const tableBody =
    fileList && fileList.map((row) => <HyRow key={row.user_id} row={row} mainBody={mainBody} />)
  const lowerBound = (tableConfig.page - 1) * tableConfig.rows + 1
  const toRowsPotential = (tableConfig.page - 1) * tableConfig.rows + tableConfig.rows
  const upperBound =
    toRowsPotential >= tableConfig.totalRows ? tableConfig.totalRows : toRowsPotential

  const nextPage = (e) => {
    e.preventDefault()
    const nextPageNum = tableConfig.page + 1
    // If no more rows to paginate, keep
    if ((nextPageNum - 1) * tableConfig.rows > tableConfig.totalRows || tableConfig.totalRows === 0) {
      return
    }
    updateTableConfig('page', nextPageNum)
  }

  const prevPage = (e) => {
    e.preventDefault()
    if (tableConfig.page <= 1 || tableConfig.totalRows === 0) {
      return
    }
    updateTableConfig('page', tableConfig.page - 1)
  }

  return (
    <div className="flex flex-col gap-1 h-full w-full">
      <HyTable dataList={fileList} header={tableHeader} body={tableBody} />
      <div className="p-1 w-full flex justify-start gap-2">
        <button
          onClick={prevPage}
          className="rounded-xl border border-gray-900 hover:bg-gray-900 transition-all px-2"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <button
          onClick={nextPage}
          className="rounded-xl border border-gray-900 hover:bg-gray-900 transition-all px-2"
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
        <div>
          {lowerBound} - {upperBound} of {tableConfig.totalRows}
        </div>
      </div>
    </div>
  )
}
