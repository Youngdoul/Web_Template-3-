import { useState } from 'react';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

// third-party
import { Chance } from 'chance';

// project imports
import MainCard from 'components/MainCard';
import SubCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';

import { ThemeDirection } from 'config';
import { addColumn } from 'api/kanban';
import { openSnackbar } from 'api/snackbar';

// assets
import CloseOutlined from '@ant-design/icons/CloseOutlined';

const chance = new Chance();

// ==============================|| KANBAN BOARD - ADD COLUMN ||============================== //

export default function AddColumn() {
  const [title, setTitle] = useState('');
  const [isTitle, setIsTitle] = useState(false);

  const [isAddColumn, setIsAddColumn] = useState(false);

  const handleAddColumnChange = () => {
    setIsAddColumn((prev) => !prev);
  };

  const addNewColumn = () => {
    if (title.length > 0) {
      const newColumn = {
        id: `${chance.integer({ min: 1000, max: 9999 })}`,
        title,
        itemIds: []
      };

      addColumn(newColumn);
      openSnackbar({
        open: true,
        message: 'Column Added successfully',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'alert',

        alert: {
          color: 'success'
        }
      });
      setIsAddColumn((prev) => !prev);
      setTitle('');
    } else {
      setIsTitle(true);
    }
  };

  const handleAddColumn = (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      addNewColumn();
    }
  };

  const handleColumnTitle = (event) => {
    const newTitle = event.target.value;
    setTitle(newTitle);
    if (newTitle.length <= 0) {
      setIsTitle(true);
    } else {
      setIsTitle(false);
    }
  };

  return (
    <MainCard
      sx={(theme) => ({
        minWidth: 250,
        bgcolor: 'secondary.lighter',
        ...theme.applyStyles('dark', { bgcolor: 'background.default' }),
        height: '100%',
        borderColor: 'divider',
        marginLeft: theme.direction === ThemeDirection.RTL ? 2 : 0
      })}
      contentSX={{ p: 1.5, '&:last-of-type': { pb: 1.5 } }}
    >
      <Grid container alignItems="center" spacing={1}>
        {isAddColumn && (
          <Grid size={12}>
            <SubCard content={false}>
              <Box sx={{ p: 2, pb: 1.5, transition: 'background-color 0.25s ease-out' }}>
                <Grid container alignItems="center" spacing={0.5}>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      placeholder="Add Column"
                      value={title}
                      onChange={handleColumnTitle}
                      sx={{
                        mb: 3,
                        '& input': { bgcolor: 'transparent', p: 0, borderRadius: '0px' },
                        '& fieldset': { display: 'none' },
                        '& .MuiFormHelperText-root': {
                          ml: 0
                        },
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'transparent',
                          '&.Mui-focused': {
                            boxShadow: 'none'
                          }
                        }
                      }}
                      onKeyUp={handleAddColumn}
                      helperText={isTitle ? 'Column title is required.' : ''}
                      error={isTitle}
                    />
                  </Grid>
                  <Grid size="grow" />
                  <Grid>
                    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                      <Tooltip title="Cancel">
                        <IconButton size="small" color="error" onClick={handleAddColumnChange}>
                          <CloseOutlined />
                        </IconButton>
                      </Tooltip>
                      <Button variant="contained" color="primary" onClick={addNewColumn} size="small">
                        Add
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </SubCard>
          </Grid>
        )}
        {!isAddColumn && (
          <Grid size={12}>
            <Button variant="dashed" color="secondary" fullWidth onClick={handleAddColumnChange}>
              Add Column
            </Button>
          </Grid>
        )}
      </Grid>
    </MainCard>
  );
}
