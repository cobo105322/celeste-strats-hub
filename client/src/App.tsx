import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {createTheme, CssBaseline, ThemeProvider} from '@mui/material';
import {blue, purple} from '@mui/material/colors';
import React from 'react';
import './App.css';
import {ChapterTree} from './components/chapter-tree/ChapterTree';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: blue[500],
    },
    secondary: {
      main: purple[500],
    },
  },
  spacing: 10,
});

function App () {
  return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline></CssBaseline>
        <ChapterTree></ChapterTree>
      </ThemeProvider>
  );
}

export default App;
