import { Grid, Typography, Button } from '@mui/material';
import KeyboardReturnTwoToneIcon from '@mui/icons-material/KeyboardReturn';
import { NavLink } from 'react-router-dom';

function PageHeader() {
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid
        item
        children={
          <Typography
            variant="h3"
            component="h3"
            gutterBottom
            children="Atualizar Usuário"
          />
        }
      />
      <Grid
        item
        children={
          <Button
            sx={{ mt: { xs: 2, md: 0 } }}
            variant="contained"
            startIcon={<KeyboardReturnTwoToneIcon fontSize="small" />}
            component={NavLink}
            to="/administrator/users/"
            children="Retornar"
          />
        }
      />
    </Grid>
  );
}

export default PageHeader;
