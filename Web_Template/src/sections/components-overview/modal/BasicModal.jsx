import { useState } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CardContent from '@mui/material/CardContent';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| MODAL - BASIC ||============================== //

export default function BasicModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <MainCard title="Basic">
      <Button variant="contained" onClick={handleOpen}>
        Open Basic Modal
      </Button>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <MainCard title="Basic Modal" modal darkTitle content={false}>
          <CardContent>
            <Typography id="modal-modal-description">Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</Typography>
          </CardContent>
          <Divider />
          <Stack direction="row" sx={{ gap: 1, justifyContent: 'flex-end', px: 2.5, py: 2 }}>
            <Button color="error" size="small" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" size="small">
              Submit
            </Button>
          </Stack>
        </MainCard>
      </Modal>
    </MainCard>
  );
}
