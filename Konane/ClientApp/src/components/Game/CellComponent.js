import React from 'react';
import {Colors} from "../../models/Colors";
import logo_white from "../../assets/checkers_top_white.png"
import logo_black from "../../assets/checkers_top_black.png"

const CellComponent = ({cell, selected, click}) => {
    return (
        <div
            className={['cell', cell._color, selected ? 'selected' : '', cell._available && cell._figure ? 'available-figure' : ''].join(' ')}
            onClick={() => click(cell)}
        >
            {cell._available && !cell._figure && <div className={'available-cell'}/>}
            {(cell._figure && cell._figure._logo) ? cell._color === Colors.WHITE ? <img src={logo_white} alt=""/> : <img src={logo_black} alt=""/> : null}
        </div>
    );
};

export default CellComponent;