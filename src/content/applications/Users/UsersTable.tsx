import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import KeyboardReturnTwoToneIcon from '@mui/icons-material/KeyboardReturn';
import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import Modal from '@mui/material/Modal';
import PropTypes from 'prop-types';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Users } from 'src/models/users';
import { findAll, remove } from 'src/services/users';

// const getStatusLabel = (clientStatus: ClientStatus): JSX.Element => {
//   const map = {
//     active: {
//       text: 'Ativo',
//       color: 'success',
//     },
//     inactive: {
//       text: 'Inativo',
//       color: 'error',
//     },
//   };

//   const { text, color }: any = map[clientStatus];

//   return <Label color={color}>{text}</Label>;
// };

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 150,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
};

const applyPagination = (
  clients: Users[],
  page: number,
  limit: number
): Users[] => {
  return clients.slice(page * limit, page * limit + limit);
};

const UsersTable = () => {
  const [users, setUsers] = useState<Users[]>([]);

  const fetchUsers = useCallback(async () => {
    const users = await findAll();
    setUsers(users);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [selectedClients] = useState<string[]>([]);
  const [selectId, setSelectId] = useState<string>();

  const handleSelectedClientId = (id): void => {
    setSelectId(id);
  };
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  // const statusOptions = [
  //   {
  //     id: 'all',
  //     name: 'All',
  //   },
  //   {
  //     id: 'active',
  //     name: 'Ativo',
  //   },
  //   {
  //     id: 'inactive',
  //     name: 'Inativo',
  //   },
  // ];

  // const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
  //   let value = null;

  //   if (e.target.value !== 'all') {
  //     value = e.target.value;
  //   }

  //   setFilters((prevFilters) => ({
  //     ...prevFilters,
  //     status: value,
  //   }));
  // };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredUsers = users;
  const paginatedUsers = applyPagination(filteredUsers, page, limit);
  const theme = useTheme();

  const handleDelete = async (id) => {
    const user: Users = await remove(id);
    if (user.id === id) fetchUsers();
    else alert('Erro ao deletar o usuário!');
  };

  return (
    <>
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell children="Nome" />
                <TableCell children="Email" />
                <TableCell children="Função" />
                <TableCell align="right" children="Ações" />
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((client) => {
                const isCryptoOrderSelected = selectedClients.includes(
                  client.id
                );
                return (
                  <TableRow
                    hover
                    key={client.id}
                    selected={isCryptoOrderSelected}
                  >
                    <TableCell
                      children={
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="text.primary"
                          gutterBottom
                          noWrap
                          children={client.name}
                        />
                      }
                    />
                    <TableCell
                      children={
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="text.primary"
                          gutterBottom
                          noWrap
                          children={client.email}
                        />
                      }
                    />
                    <TableCell
                      children={
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="text.primary"
                          gutterBottom
                          noWrap
                          children={
                            client.role === 'admin'
                              ? 'Administrador'
                              : 'Usuário'
                          }
                        />
                      }
                    />
                    <TableCell align="right">
                      <Tooltip
                        title="Editar usuário"
                        arrow
                        children={
                          <IconButton
                            component={NavLink}
                            to={{ pathname: `edit/${client.id}` }}
                            sx={{
                              '&:hover': {
                                background: theme.colors.primary.lighter,
                              },
                              color: theme.palette.primary.main,
                            }}
                            color="inherit"
                            size="small"
                            children={<EditTwoToneIcon fontSize="small" />}
                          />
                        }
                      />
                      <Tooltip
                        title="Excluir usuário"
                        arrow
                        children={
                          <IconButton
                            sx={{
                              '&:hover': {
                                background: theme.colors.error.lighter,
                              },
                              color: theme.palette.error.main,
                            }}
                            color="inherit"
                            size="small"
                            onClick={() => {
                              handleSelectedClientId(client.id);
                              handleOpen();
                            }}
                            children={<DeleteTwoToneIcon fontSize="small" />}
                          />
                        }
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          p={2}
          children={
            <TablePagination
              component="div"
              count={filteredUsers.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              page={page}
              rowsPerPage={limit}
              rowsPerPageOptions={[5, 10, 25, 30]}
            />
          }
        />
      </Card>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            children="Confirme a exclusão do usuário!"
          />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Grid container>
              <Grid item xs={6} md={6}>
                <Button
                  sx={{ mt: { xs: 0, md: 0 } }}
                  variant="outlined"
                  startIcon={<KeyboardReturnTwoToneIcon fontSize="small" />}
                  onClick={handleClose}
                  children="Retornar"
                />
              </Grid>
              <Grid item xs={6} md={6}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteTwoToneIcon />}
                  onClick={() => {
                    handleDelete(selectId);
                    handleClose();
                  }}
                  children="Excluir"
                />
              </Grid>
            </Grid>
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

UsersTable.propTypes = {
  clients: PropTypes.array.isRequired,
};

UsersTable.defaultProps = {
  clients: [],
};

export default UsersTable;
