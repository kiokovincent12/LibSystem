import React from 'react'
import { CircularProgress } from '@material-ui/core';

export const Loading = () => {
    return (
        <div>
            <CircularProgress variant='determinate' color='primary' disableShrink='true' aria-busy='true' />
        </div>
    )
};
 