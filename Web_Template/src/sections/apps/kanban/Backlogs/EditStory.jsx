import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

// third-party
import * as yup from 'yup';
import { useFormik } from 'formik';

// project imports
import AddStoryComment from './AddStoryComment';
import StoryComment from './StoryComment';
import AlertStoryDelete from './AlertStoryDelete';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import UploadMultiFile from 'components/third-party/dropzone/MultiFile';
import SimpleBar from 'components/third-party/SimpleBar';
import { getImageUrl, ImagePath } from 'utils/getImageUrl';

import { DropzoneType } from 'config';
import { deleteStory, editStory, useGetBacklogs } from 'api/kanban';
import { openSnackbar } from 'api/snackbar';

// assets
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import DeleteFilled from '@ant-design/icons/DeleteFilled';

const validationSchema = yup.object({
  title: yup.string().required('User story title is required'),
  dueDate: yup.date()
});

// ==============================|| KANBAN BACKLOGS - EDIT STORY ||============================== //

export default function EditStory({ story, open, handleDrawerOpen }) {
  const { backlogs } = useGetBacklogs();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: story.id,
      title: story.title,
      assign: story.assign,
      columnId: story.columnId,
      priority: story.priority,
      dueDate: story.dueDate ? new Date(story.dueDate) : new Date(),
      acceptance: story.acceptance,
      description: story.description,
      commentIds: story.commentIds,
      image: false,
      itemIds: story.itemIds,
      files: []
    },
    validationSchema,
    onSubmit: (values) => {
      editStory(values);
      openSnackbar({
        open: true,
        message: 'Submit Success',
        variant: 'alert',

        alert: {
          color: 'success'
        }
      });
      handleDrawerOpen();
    }
  });

  const [openModal, setOpenModal] = useState(false);
  const handleModalClose = (status) => {
    setOpenModal(false);
    if (status) {
      handleDrawerOpen();
      deleteStory(story.id);
      openSnackbar({
        open: true,
        message: 'Story Deleted successfully',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'alert',

        alert: {
          color: 'success'
        }
      });
    }
  };

  return (
    <Drawer
      sx={{
        ml: open ? 3 : 0,
        flexShrink: 0,
        zIndex: 1200,
        overflowX: 'hidden',
        width: { xs: 320, md: 450 },
        '& .MuiDrawer-paper': {
          width: { xs: 320, md: 450 },
          border: 'none',
          borderRadius: '0px'
        }
      }}
      variant="temporary"
      anchor="right"
      open={open}
      ModalProps={{ keepMounted: true }}
      onClose={() => {
        handleDrawerOpen();
        formik.resetForm();
      }}
    >
      {open && (
        <SimpleBar
          sx={{
            overflowX: 'hidden',
            height: '100vh'
          }}
        >
          <Box sx={{ p: 3 }}>
            <Grid container alignItems="center" spacing={0.5} justifyContent="space-between">
              <Grid sx={{ width: 'calc(100% - 64px)' }}>
                <Stack direction="row" sx={{ gap: 0.5, alignItems: 'center' }}>
                  <Typography
                    variant="h4"
                    sx={{
                      display: 'inline-block',
                      width: 'calc(100% - 34px)',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      verticalAlign: 'middle'
                    }}
                  >
                    {story.title}
                  </Typography>
                </Stack>
              </Grid>

              <Grid>
                <Stack direction="row" sx={{ alignItems: 'center' }}>
                  <Tooltip title="Delete Task">
                    <IconButton color="error" onClick={() => setOpenModal(true)} size="small" sx={{ fontSize: '0.875rem' }}>
                      <DeleteFilled />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Close">
                    <IconButton color="secondary" onClick={handleDrawerOpen} size="small" sx={{ fontSize: '0.875rem' }}>
                      <CloseOutlined />
                    </IconButton>
                  </Tooltip>
                </Stack>
                <AlertStoryDelete title={story.title} open={openModal} handleClose={handleModalClose} />
              </Grid>
            </Grid>
          </Box>
          <Divider />
          <Box sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <form onSubmit={formik.handleSubmit}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Grid container spacing={2.5}>
                      <Grid size={12}>
                        <Stack sx={{ gap: 1 }}>
                          <InputLabel>Title</InputLabel>
                          <TextField
                            fullWidth
                            id="title"
                            name="title"
                            placeholder="Title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                          />
                        </Stack>
                      </Grid>
                      <Grid size={12}>
                        <Stack sx={{ gap: 1 }}>
                          <InputLabel>Assign to</InputLabel>
                          <Autocomplete
                            id="assign"
                            value={backlogs?.profiles.find((profile) => profile.id === formik.values.assign) || null}
                            onChange={(event, value) => {
                              formik.setFieldValue('assign', value?.id);
                            }}
                            options={backlogs?.profiles}
                            fullWidth
                            autoHighlight
                            getOptionLabel={(option) => option.name}
                            isOptionEqualToValue={(option) => option.id === formik.values.assign}
                            renderOption={({ key, ...props }, option) => (
                              <Box key={key} component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                <CardMedia
                                  component="img"
                                  sx={{ width: 20 }}
                                  loading="lazy"
                                  src={getImageUrl(`${option.avatar}`, ImagePath.USERS)}
                                  alt=""
                                />
                                {option.name}
                              </Box>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Choose a assignee"
                                slotProps={{
                                  htmlInput: {
                                    ...params.inputProps,
                                    autoComplete: 'new-password' // disable autocomplete and autofill
                                  }
                                }}
                              />
                            )}
                          />
                        </Stack>
                      </Grid>
                      <Grid size={12}>
                        <Stack sx={{ gap: 1 }}>
                          <InputLabel>Prioritize</InputLabel>
                          <FormControl>
                            <RadioGroup
                              row
                              aria-label="color"
                              value={formik.values.priority}
                              onChange={formik.handleChange}
                              name="priority"
                              id="priority"
                            >
                              <FormControlLabel
                                value="low"
                                control={<Radio color="primary" sx={{ color: 'primary.main' }} />}
                                label="Low"
                              />
                              <FormControlLabel
                                value="medium"
                                control={<Radio color="warning" sx={{ color: 'warning.main' }} />}
                                label="Medium"
                              />
                              <FormControlLabel value="high" control={<Radio color="error" sx={{ color: 'error.main' }} />} label="High" />
                            </RadioGroup>
                          </FormControl>
                        </Stack>
                      </Grid>
                      <Grid size={12}>
                        <Stack sx={{ gap: 1 }}>
                          <InputLabel>Due date</InputLabel>
                          <DesktopDatePicker
                            value={formik.values.dueDate}
                            format="dd/MM/yyyy"
                            onChange={(date) => {
                              formik.setFieldValue('dueDate', date);
                            }}
                          />
                        </Stack>
                      </Grid>
                      <Grid size={12}>
                        <Stack sx={{ gap: 1 }}>
                          <InputLabel>Acceptance</InputLabel>
                          <TextField
                            fullWidth
                            id="acceptance"
                            name="acceptance"
                            multiline
                            rows={3}
                            value={formik.values.acceptance}
                            onChange={formik.handleChange}
                            error={formik.touched.acceptance && Boolean(formik.errors.acceptance)}
                            helperText={formik.touched.acceptance && formik.errors.acceptance}
                          />
                        </Stack>
                      </Grid>
                      <Grid size={12}>
                        <Stack sx={{ gap: 1 }}>
                          <InputLabel>Description</InputLabel>
                          <TextField
                            fullWidth
                            id="description"
                            name="description"
                            multiline
                            rows={3}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                          />
                        </Stack>
                      </Grid>
                      <Grid size={12}>
                        <Stack sx={{ gap: 1 }}>
                          <InputLabel>State</InputLabel>
                          <FormControl fullWidth>
                            <Select
                              id="columnId"
                              name="columnId"
                              displayEmpty
                              value={formik.values.columnId}
                              onChange={formik.handleChange}
                              inputProps={{ 'aria-label': 'Without label' }}
                            >
                              {backlogs?.columns.map((column, index) => (
                                <MenuItem key={index} value={column.id}>
                                  {column.title}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Stack>
                      </Grid>
                      <Grid size={12}>
                        <Grid container spacing={1}>
                          <Grid size={12}>
                            <InputLabel sx={{ mt: 0.5 }}>Attachments:</InputLabel>
                          </Grid>
                          <Grid size={12}>
                            <UploadMultiFile
                              type={DropzoneType.STANDARD}
                              showList={true}
                              setFieldValue={formik.setFieldValue}
                              files={formik.values.files}
                              error={formik.touched.files && !!formik.errors.files}
                            />
                          </Grid>
                          {formik.touched.files && formik.errors.files && (
                            <Grid size={12}>
                              <FormHelperText error id="standard-weight-helper-text-password-login">
                                {formik.errors.files}
                              </FormHelperText>
                            </Grid>
                          )}
                        </Grid>
                      </Grid>

                      <Grid size={12}>
                        <AnimateButton>
                          <Button fullWidth variant="contained" type="submit">
                            Save
                          </Button>
                        </AnimateButton>
                      </Grid>
                    </Grid>
                  </LocalizationProvider>
                </form>
              </Grid>
              <Grid size={12}>
                {story &&
                  story?.commentIds &&
                  [...(story?.commentIds || [])].reverse().map((commentId, index) => {
                    const commentData = backlogs?.comments.filter((comment) => comment.id === commentId)[0];
                    const profile = backlogs?.profiles.filter((item) => item.id === commentData.profileId)[0];
                    return <StoryComment key={index} comment={commentData} profile={profile} />;
                  })}
              </Grid>
              <Grid size={12}>
                <AddStoryComment storyId={story.id} />
              </Grid>
            </Grid>
          </Box>
        </SimpleBar>
      )}
    </Drawer>
  );
}

EditStory.propTypes = { story: PropTypes.any, open: PropTypes.bool, handleDrawerOpen: PropTypes.func };
