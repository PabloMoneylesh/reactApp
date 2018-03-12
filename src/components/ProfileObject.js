import React from 'react';

export default (props) =>
    <tr>
        <td>{props.profile.id}</td>
        <td>{props.profile.startDate}</td>
        <td>{props.profile.endDate}</td>
        <td>{props.profile.object}</td>
    </tr>