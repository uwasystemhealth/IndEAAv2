import React from 'react';
import { EocGeneralEocSpecific } from 'utils/api';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Divider, useTheme } from '@mui/material';
import { developmentLevelToString } from '@/components/utils/eoc';

type Props = {
  eocSpecific: EocGeneralEocSpecific;
};

const EOCCard = (props: Props) => {
  const { eocSpecific } = props;
  // Business rule: There can only be one justification per EOC
  const justification = eocSpecific?.justification[0];
  const theme = useTheme();

  return (
    <Card>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item sm={8}>
            <Typography gutterBottom variant="h5" component="div">
              EOC {eocSpecific.general_and_specific_eoc}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {eocSpecific.description}
            </Typography>
          </Grid>
          <Grid item sm={3}>
            <Stack direction="column" spacing={2}>
              <Button
                startIcon={<VisibilityIcon />}
                variant="outlined"
                color="primary"
                onClick={() => {}}
              >
                View
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ m: 2 }} />
        <Box>
          <Box
            sx={{
              display: 'flex',
              color: justification?.development_level
                ? theme.palette.secondary.main
                : theme.palette.error.main,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'bold', pb: 1, pr: 1 }} color="success">
              Your Rating:
            </Typography>
            <Typography variant="body2">
              {developmentLevelToString[justification?.development_level || 0]}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              color: justification?.justification
                ? theme.palette.secondary.main
                : theme.palette.error.main,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'bold', pb: 1, pr: 1 }} color="success">
              Your Justification:
            </Typography>
            <Typography variant="body2">{justification?.justification || 'None'}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EOCCard;
