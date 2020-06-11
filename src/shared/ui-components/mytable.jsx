import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import VisibilityIcon from '@material-ui/icons/Visibility';

const useStyles = makeStyles({
    table: {
        minWidth: 200, position: 'stickey'
    },
    tableHeader: {
        display: 'flex'
    },
    tableColumn: {
        flex: 1
    },
    container: {
        maxHeight: '440px',
    }
});

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const OrderTable = ({ rows, headers, columns, actions, onSelect }) => {
    const classes = useStyles();

    const onRowSelect = (row) => {
        console.log(row);
        onSelect(row)
    };

    return (
        <TableContainer classsName={classes.container} component={Paper} >
            <Table stickyHeader aria-label="sticky table" className={classes.table} >
                <TableHead>
                    <TableRow>
                        {headers && headers.map(item => {
                            return <StyledTableCell align="center">{item}</StyledTableCell>
                        })}
                        {actions && actions.view && <StyledTableCell align="center" />
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows && rows.map((row) => (
                        <StyledTableRow key={row.name}>
                            {columns && columns.map(item => {
                                return <StyledTableCell align="center" >{row[item]}</StyledTableCell>
                            })}
                            {actions && actions.view && <StyledTableCell align="center" >
                                <div onClick={()=>{onRowSelect(row)}}><VisibilityIcon /></div>
                            </StyledTableCell>
                            }
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default OrderTable;
