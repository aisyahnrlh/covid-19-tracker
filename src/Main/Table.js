import React from 'react';
import numeral from 'numeral';
import './Table.css';

function Table({ countries }) {
    return (
        <div className="table">
            {
                countries.map(({ country, cases, countryInfo }) => (
                    <tr>
                        <div className="table__flag" style={{
                            backgroundImage: `url('${countryInfo.flag}')`,
                            objectFit: 'cover',
                            backgroundSize: '45px 30px',
                            backgroundPosition: 'center center'
                        }} />
                        <td>
                            <strong>
                                {country}
                            </strong>
                            {numeral(cases).format("0,0")}
                        </td>
                    </tr>
                ))
            }
        </div>
    )
}

export default Table
