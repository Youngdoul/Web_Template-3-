// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

// project imports
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import { openSnackbar } from 'api/snackbar';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

/**
 * 'Enter your email'
 * yup.string Expected 0 arguments, but got 1 */
const validationSchema = yup.object({
  emailInstant: yup.string().email('Enter a valid email').required('Email is required'),
  passwordInstant: yup.string().min(8, 'Password should be of minimum 8 characters length').required('Password is required')
});

// ==============================|| FORM VALIDATION - INSTANT FEEDBACK FORMIK ||============================== //

export default function InstantFeedback() {
  const formik = useFormik({
    initialValues: {
      emailInstant: '',
      passwordInstant: ''
    },
    validationSchema,
    onSubmit: () => {
      openSnackbar({
        open: true,
        message: 'On Leave - Submit Success',
        variant: 'alert',

        alert: {
          color: 'success'
        }
      });
    }
  });

  return (
    <MainCard title="On Leave">
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <Stack sx={{ gap: 1 }}>
              <InputLabel htmlFor="emailInstant">Email Address</InputLabel>
              <TextField
                fullWidth
                id="emailInstant"
                name="emailInstant"
                placeholder="Enter email address"
                value={formik.values.emailInstant}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.emailInstant && Boolean(formik.errors.emailInstant)}
                helperText={formik.touched.emailInstant && formik.errors.emailInstant}
              />
            </Stack>
          </Grid>
          <Grid size={12}>
            <Stack sx={{ gap: 1 }}>
              <InputLabel htmlFor="passwordInstant">Password</InputLabel>
              <TextField
                fullWidth
                id="passwordInstant"
                name="passwordInstant"
                placeholder="Enter your password"
                type="password"
                value={formik.values.passwordInstant}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.passwordInstant && Boolean(formik.errors.passwordInstant)}
                helperText={formik.touched.passwordInstant && formik.errors.passwordInstant}
              />
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
