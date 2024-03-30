import React from 'react';

const CellComponent = ({cell, selected, click}) => {
    return (
        <div
            className={['cell', cell._color, selected ? 'selected' : '', cell._available && cell._figure ? 'available-figure' : ''].join(' ')}
            onClick={() => click(cell)}
        >
            {cell._available && !cell._figure && <div className={'available-cell'}/>}
            {cell._figure?._logo && <img src={cell._figure._logo} alt=""/>}
        </div>
    );
};

export default CellComponent;