import { Box, Button, Container, Divider, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import './app.css';
import React from 'react';
import { createReferencesElements, fetchReferences } from './services/references';

function App() {
  const [translation, setTranslation] = React.useState('');
  const [originalText, setOriginalText] = React.useState('');
  const [references, setReferences] = React.useState([] as JSX.Element[]);

  const handleClick = async () => {
    const data = await fetchReferences(translation, originalText);
    const referencesText = createReferencesElements(data);
    return setReferences(referencesText);
  };

  return (
    <Container id="container">
      <Box className="header">
        <h1 className="main-title">Biblical Reference Extractor</h1>
      </Box>
      <Box>
        <InputLabel sx={{ padding: '5px 1rem 0' }} id="translation-select-label">
          Translation
        </InputLabel>
        <Box
          sx={{
            padding: '0 1rem 1rem',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignContent: 'center',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <Select
            value={translation}
            labelId="translation-select-label"
            id="translation-select"
            label="Translation"
            sx={{ width: '100%' }}
            onChange={(e) => setTranslation(e.target.value)}
          >
            <MenuItem value={'aa'}>AA</MenuItem>
            <MenuItem value={'acf'}>ACF</MenuItem>
            <MenuItem value={'nvi'}>NVI</MenuItem>
          </Select>
          <Button sx={{ height: '56px' }} variant="contained" onClick={handleClick}>
            Extract
          </Button>
        </Box>
      </Box>
      <Box className="input-container">
        <Box sx={{ flex: 5 }}>
          <TextField
            id="original-text"
            multiline
            fullWidth
            inputProps={{ style: { height: '100%' } }}
            sx={{ height: '100%', minHeight: '100%' }}
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
          />
        </Box>
        <Divider sx={{ margin: '0px 10px' }} orientation="vertical" />
        <Box sx={{ flex: 4, height: '100%', overflow: 'auto' }}>
          <div id="references">{references}</div>
        </Box>
      </Box>
    </Container>
  );
}

export default App;
