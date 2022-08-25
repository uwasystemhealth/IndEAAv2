import React from 'react';
import { Document } from 'utils/api';
import Box from '@mui/material/Box';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';

type Props = {
  document: Document;
};

export interface DocumentTag {
  label: string;
  // TODO: add color type
  color: any;
}
const DocumentCard = (props: Props) => {
  const { document } = props;

  const tags: DocumentTag[] = [];

  document.eoc_generals.forEach((eoc) => {
    tags.push({
      label: `EOC ${eoc.number}`,
      color: 'primary',
    });
  });
  document.eoc_specifics.forEach((eoc) => {
    tags.push({
      label: `EOC ${eoc.general_and_specific_eoc}`,
      color: 'secondary',
    });
  });

  // Sort tags by label
  tags.sort((a, b) => a.label.localeCompare(b.label));

  if (document.is_introduction) {
    // Add to the beginning
    tags.unshift({
      label: 'Introduction',
      color: 'info',
    });
  }

  return (
    <Card>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item md={8}>
            <Typography gutterBottom variant="h5" component="div">
              {document.name}
            </Typography>
            <Typography>{document.description}</Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 1,
                mt: 1,
              }}
            >
              {tags.map((tag) => (
                <Chip key={tag.label} label={tag.label} color={tag.color} />
              ))}
            </Box>
          </Grid>
          <Grid item md={3}>
            <Stack direction="column" spacing={2}>
              <Button startIcon={<AddIcon />} variant="outlined" color="primary">
                View
              </Button>
              <Button startIcon={<EditIcon />} variant="outlined" color="secondary">
                Edit
              </Button>
              <Button startIcon={<DeleteIcon />} variant="outlined" color="error">
                Delete
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
