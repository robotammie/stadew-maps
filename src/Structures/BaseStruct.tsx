import {  StructProps } from '../types.d'

export const styles = (props: StructProps) => {
  return {
    margin: `0px ${props.onMap? 0 : 10}px`,
    padding: 0,
    cursor: 'pointer',
    width:  (props.onMap ? '10px' : '15px'),
    height: (props.onMap ? '10px' : '15px'),
    border: (props.onMap ? 'none' : '1px solid black'),
    backgroundColor: props.bgColor || 'beige',
    overflow: 'hidden',
  }
};
