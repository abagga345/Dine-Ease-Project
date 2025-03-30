import * as React from 'react';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/system';
import SelectPosition from './BasicSelect';
import BasicSelect from './BasicSelect';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export default function AddressForm() {
  return (
    <>
      <BasicSelect></BasicSelect>
    </>
  );
}