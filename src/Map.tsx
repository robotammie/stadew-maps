import Box from '@mui/material/Box';

const tileStyles = {
  margin: 0,
  padding: 0,
  width: '20px',
  height: '20px',
  backgroundColor: 'red',
  border: '1px solid black',
};

const mapStyles = {
  margin: 10,
  padding: 10,
  width: 'full',
  height: '800px',
  color: 'red',
  border: '1px solid black',
  display: 'flex',
  justifyContent: 'center',
};

const Map = () => {
  return (
    <div>
      <h1>Map</h1>
      <Box sx={mapStyles}>
        <Box sx={tileStyles} />
        <Box sx={tileStyles} />
        <Box sx={tileStyles} />
        <Box sx={tileStyles} />
        <Box sx={tileStyles} />
        <Box sx={tileStyles} />
        <Box sx={tileStyles} />
      </Box>
    </div>
  );
}

export default Map;