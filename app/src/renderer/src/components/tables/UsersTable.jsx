import { Fragment } from 'react'
import HyTable, { HyRow, StyledTableCell, StyledTableRow } from './HyTable'

export default function UsersTable({ userList, dropdownElems }) {
  const subHeader = (
    <StyledTableRow>
      <StyledTableCell>Group ID</StyledTableCell>
      <StyledTableCell>Name</StyledTableCell>
      <StyledTableCell>Description</StyledTableCell>
    </StyledTableRow>
  )

  const subBody = (row) => {
    return row.groups.map((user_group) => (
      <StyledTableRow key={`group-${user_group.group_id}`}>
        <StyledTableCell>{user_group.group_id}</StyledTableCell>
        <StyledTableCell>{user_group.group_name}</StyledTableCell>
        <StyledTableCell>{user_group.group_description}</StyledTableCell>
      </StyledTableRow>
    ))
  }

  const mainBody = (row) => (
    <Fragment>
      <StyledTableCell component="th" scope="row">
        {row.user_id}
      </StyledTableCell>
      <StyledTableCell>{row.username}</StyledTableCell>
      <StyledTableCell>{row.password}</StyledTableCell>
      <StyledTableCell sx={{ width: '75px' }}>{dropdownElems(row)}</StyledTableCell>
    </Fragment>
  )

  const tableHeader = (
    <StyledTableRow>
      <StyledTableCell />
      <StyledTableCell>User ID</StyledTableCell>
      <StyledTableCell>Username</StyledTableCell>
      <StyledTableCell>Password</StyledTableCell>
      <StyledTableCell>Action</StyledTableCell>
    </StyledTableRow>
  )

  const tableBody =
    userList &&
    userList.map((row) => (
      <HyRow
        key={row.user_id}
        row={row}
        mainBody={mainBody}
        subLabel={'User Groups'}
        subHeader={subHeader}
        subBody={subBody}
      />
    ))
  return <HyTable dataList={userList} header={tableHeader} body={tableBody} />
}
