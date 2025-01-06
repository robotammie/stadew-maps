import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  tile: {
    margin: 0,
    padding: 0,
    width: '20px',
    height: '20px',
    color: 'red',
    border: '1px solid black',
  }
}));

const classes = useStyles();

const Map = () => {
  return (
    <div>
      <h1>Map</h1>
      <div id="map">
        <div className={classes.tile} />
      </div>
    </div>
  );
}

export default Map;