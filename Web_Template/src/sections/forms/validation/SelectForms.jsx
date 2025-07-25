// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// project imports
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import { openSnackbar } from 'api/snackbar';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

/**
 * 'Enter your age'
 * yup.number Expected 0 arguments, but got 1 */
const validationSchema = yup.object({
  age: yup.number().required('Age selection is required.')
});

// ==============================|| FORM VALIDATION - LOGIN FORMIK ||============================== //

export default function SelectForms() {
  const formik = useFormik({
    initialValues: {
      age: ''
    },
    validationSchema,
    onSubmit: () => {
      openSnackbar({
        open: true,
        message: 'Select - Submit Success',
        variant: 'alert',

        alert: {
          color: 'success'
        }
      });
    }
  });

  return (
    <MainCard title="Select">
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <Stack sx={{ gap: 1 }}>
              <InputLabel htmlFor="age">Age</InputLabel>
              <FormControl sx={{ minWidth: 120 }}>
                <Select id="age" name="age" value={formik.values.age} onChange={formik.handleChange}>
                  <MenuItem value="">
                    <em>Select age</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
                {formik.errors.age && (
                  <FormHelperText error id="standard-weight-helper-text-email-login">
                    {' '}
                    {formik.errors.age}{' '}
                  </FormHelperText>
                )}
              </FormControl>
            </Stack>
          </Grid>
          <Grid size={12}>
            <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
              <AnimateButton>
                <Button variant="contained" type="submit">
                  Submit
                </Button>
              </AnimateButton>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </MainCard>
  );
}
