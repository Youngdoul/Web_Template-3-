import { useState } from 'react';

// material-ui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| DATE PICKER - DISABLED ||============================== //

export default function DisabledPickers() {
  const [value, setValue] = useState(null);

  const disabledDatepickerCodeString = `<MainCard title="Disabled Pickers" codeString={disabledDatepickerCodeString}>
  <Stack sx={{ gap: 3 }}>
    <Typography variant="h6">Date Picker</Typography>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label="disabled"
        disabled
        value={value}
        onChange={(newValue: any) => {
          setValue(newValue);
        }}
      />
      <DatePicker
        label="read-only"
        readOnly
        value={value}
        onChange={(newValue: any) => {
          setValue(newValue);
        }}
      />
    </LocalizationProvider>

    <Typography variant="h6">Date Time Picker</Typography>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        label="disabled"
        disabled
        value={value}
        onChange={(newValue: any) => {
          setValue(newValue);
        }}
      />
      <DateTimePicker
        label="read-only"
        readOnly
        value={value}
        onChange={(newValue: any) => {
          setValue(newValue);
        }}
      />

      <Typography variant="h6">Time Picker</Typography>
      <TimePicker
        label="disabled"
        disabled
        value={value}
        onChange={(newValue: any) => {
          setValue(newValue);
        }}
      />
      <TimePicker
        label="read-only"
        readOnly
        value={value}
        onChange={(newValue: any) => {
          setValue(newValue);
        }}
      />
    </LocalizationProvider>
  </Stack>
</MainCard>`;

  return (
    <MainCard title="Disabled Pickers" codeString={disabledDatepickerCodeString}>
      <Stack sx={{ gap: 3 }}>
        <Typography variant="h6">Date Picker</Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            disabled
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
          />
          <DatePicker
            readOnly
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
          />
        </LocalizationProvider>

        <Typography variant="h6">Date Time Picker</Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            disabled
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
          />
          <DateTimePicker
            readOnly
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
          />

          <Typography variant="h6">Time Picker</Typography>
          <TimePicker
            disabled
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
          />
          <TimePicker
            readOnly
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
          />
        </LocalizationProvider>
      </Stack>
    </MainCard>
  );
}
