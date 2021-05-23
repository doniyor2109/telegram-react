/*
 *  Copyright (c) 2018-present, Evgeny Nadymov
 *
 * This source code is licensed under the GPL v.3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { compose, withRestoreRef, withSaveRef } from '../../Utils/HOC';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import ArrowBackIcon from '../../Assets/Icons/Back';
import './NewContactParams.css';

class UsernamesParams extends React.Component {

    constructor(props) {
        super(props);

        this.phonesRef = React.createRef();

        this.state = {
            error: null
        };
    }

    getParam(value, field) {
        const { error } = this.state;

        const input = value.trim();
        if (!input) {
            this.setState({
                error: field
            });
            return input;
        }

        if (error) {
            this.setState({
                error: null
            })
        }

        return input;
    }

    getPhones() {
        return this.getParam(this.phonesRef.current.value, 'phones');
    }

    handleClose = () => {
        const { onClose } = this.props;
        if (!onClose) return;

        onClose();
    };

    render() {
        const { error } = this.state;

        return (
            <>
                <div className='header-master'>
                    <IconButton className='header-left-button' onClick={this.handleClose}>
                        <ArrowBackIcon />
                    </IconButton>
                    <div className='header-status grow cursor-pointer'>
                        <span className='header-status-content'>Import contacts</span>
                    </div>
                </div>
                <div className='sidebar-page-content'>
                    <div className='new-chat-content'>
                        <div className='new-chat-title'>
                            <TextField
                                multiline={true}
                                inputRef={this.phonesRef}
                                error={error === 'phone'}
                                className='new-chat-input'
                                variant='outlined'
                                fullWidth
                                label="Phone numbers"
                                defaultValue={''}
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

UsernamesParams.propTypes = {
    onClose: PropTypes.func
};

const enhance = compose(
    withSaveRef(),
    withTranslation(),
    withRestoreRef()
);

export default enhance(UsernamesParams);
