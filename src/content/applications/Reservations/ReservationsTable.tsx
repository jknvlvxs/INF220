import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
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
import Label from 'src/components/Label';
import { Clients } from 'src/models/clients';
import { Hotels } from 'src/models/hotels';
import { Reservations } from 'src/models/reservations';
import { findAll as findClient } from 'src/services/clients';
import { findAll as findHotel } from 'src/services/hotels';
import { cancel, findAll, remove } from 'src/services/reservations';

// const getStatusLabel = (reservationStatus: ClientStatus): JSX.Element => {
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

//   const { text, color }: any = map[reservationStatus];

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
  reservations: Reservations[],
  page: number,
  limit: number
): Reservations[] => {
  return reservations.slice(page * limit, page * limit + limit);
};

const ReservationsTable = () => {
  const theme = useTheme();

  const [reservations, setReservations] = useState<Reservations[]>([]);
  const [hotels, setHotels] = useState<Hotels[]>([]);
  const [clients, setClients] = useState<Clients[]>([]);

  const fetchReservations = useCallback(async () => {
    const reservations = await findAll();
    setReservations(reservations);
  }, []);

  const fetchClients = useCallback(async () => {
    const clients = await findClient();
    setClients(clients);
  }, []);

  const fetchHotels = useCallback(async () => {
    const hotels = await findHotel();
    setHotels(hotels);
  }, []);

  useEffect(() => {
    fetchReservations();
    fetchClients();
    fetchHotels();
  }, [fetchReservations, fetchClients, fetchHotels]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [selectId, setSelectId] = useState<string>();

  const handleSelectedClientId = (id): void => {
    setSelectId(id);
  };
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredReservations = reservations;
  const paginatedReservations = applyPagination(
    filteredReservations,
    page,
    limit
  );

  const handleCancel = async (id) => {
    const reservation: number = await cancel(id);
    if (reservation === 200) fetchReservations();
    else alert('Erro ao cancelar a reserva!');
  };

  const handleDelete = async (id) => {
    const reservation: Reservations = await remove(id);
    if (reservation.idReserva === id) fetchReservations();
    else alert('Erro ao deletar a reserva!');
  };

  const formatHotel = (id): string => {
    if (hotels.length > 0) {
      const hotel = hotels.find((hotel) => hotel.idHotel === id);
      return hotel.cidade;
    } else {
      return 'Buscando...';
    }
  };

  const formatClient = (id): string => {
    if (clients.length > 0) {
      const client = clients.find((client) => client.idCliente === id);
      return client.nome;
    } else {
      return 'Buscando...';
    }
  };

  return (
    <>
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell children="ID" />
                <TableCell children="Dados" />
                <TableCell children="Data" />
                <TableCell children="Status" />
                <TableCell align="right" children="Ações" />
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedReservations.map((reservation) => {
                return (
                  <TableRow hover key={reservation.idReserva}>
                    <TableCell
                      children={
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="text.primary"
                          gutterBottom
                          noWrap
                          children={reservation.idReserva}
                        />
                      }
                    />
                    <TableCell
                      children={
                        <>
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            color="text.primary"
                            gutterBottom
                            noWrap
                            children={`Filial: ${formatHotel(
                              reservation.idHotel
                            )}`}
                          />
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            color="text.primary"
                            gutterBottom
                            noWrap
                            children={`Cliente: ${formatClient(
                              reservation.idCliente
                            )}`}
                          />
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            color="text.primary"
                            gutterBottom
                            noWrap
                            children={`Tipo de Apartamento: ${reservation.idTipo}`}
                          />
                        </>
                      }
                    />
                    <TableCell
                      children={
                        <>
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            color="text.primary"
                            gutterBottom
                            noWrap
                            children={`Previsão de Entrada: ${reservation.dataPrevistaEntrada}`}
                          />
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            color="text.primary"
                            gutterBottom
                            noWrap
                            children={`Previsão de Saída: ${reservation.dataPrevistaSaida}`}
                          />
                        </>
                      }
                    />
                    <TableCell
                      children={
                        <Label
                          color={reservation.cancelada ? 'error' : 'primary'}
                          children={
                            reservation.cancelada
                              ? 'Reserva cancelada'
                              : 'Aberta'
                          }
                        />
                      }
                    />
                    <TableCell align="right">
                      <Tooltip
                        title="Cancelar Reserva"
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
                              handleCancel(reservation.idReserva);
                            }}
                            children={<CancelTwoToneIcon fontSize="small" />}
                          />
                        }
                      />
                      <Tooltip
                        title="Excluir Reserva"
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
                              handleSelectedClientId(reservation.idReserva);
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
              count={filteredReservations.length}
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
            children="Confirme a exclusão da reserva!"
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

ReservationsTable.propTypes = {
  reservations: PropTypes.array.isRequired,
};

ReservationsTable.defaultProps = {
  reservations: [],
};

export default ReservationsTable;