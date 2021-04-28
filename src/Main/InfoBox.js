import React from 'react';
import './InfoBox.css';

function InfoBox({ title, cases, total, ...props }) {
    return (
        <div className="info-box info-box__cases" onClick={props.onClick}>
            <h3>{title}</h3>
            <h2>{total}</h2>
            <small>{cases}</small>
        </div>
    )
}

export default InfoBox
