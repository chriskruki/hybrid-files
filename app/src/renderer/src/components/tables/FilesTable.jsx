import { Fragment } from 'react'
import HyTable, { HyRow, StyledTableCell, StyledTableRow } from './HyTable'

export default function FilesTable({ fileList, dropdownElems }) {
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

  return <HyTable dataList={fileList} header={tableHeader} body={tableBody} />
}
