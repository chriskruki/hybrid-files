import { Fragment } from 'react'
import HyTable, { HyRow, StyledTableCell, StyledTableRow } from './HyTable'

export default function GroupsTable({ groupList, dropdownElems }) {
  const tableHeader = (
    <StyledTableRow>
      {/* <StyledTableCell /> */}
      <StyledTableCell>ID</StyledTableCell>
      <StyledTableCell>Name</StyledTableCell>
      <StyledTableCell>Description</StyledTableCell>
      <StyledTableCell></StyledTableCell>
    </StyledTableRow>
  )

  const mainRow = (row) => (
    <Fragment>
      <StyledTableCell component="th" scope="row">
        {row.group_id}
      </StyledTableCell>
      <StyledTableCell>{row.name}</StyledTableCell>
      <StyledTableCell>{row.description}</StyledTableCell>
      <StyledTableCell sx={{ width: '75px' }}>{dropdownElems(row)}</StyledTableCell>
    </Fragment>
  )

  const tableBody = groupList.map((row) => (
    <HyRow key={row.group_id} row={row} mainRow={mainRow} />
  ))

  return <HyTable dataList={groupList} header={tableHeader} body={tableBody} />
}
