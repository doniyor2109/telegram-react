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
import { loadUsersContent } from '../../Utils/File';
import FileStore from '../../Stores/FileStore';
import './NewContactParams.css';

class NewContactParams extends React.Component {

    constructor(props) {
        super(props);

        this.phoneRef = React.createRef();
        this.firstNameRef = React.createRef();
        this.lastNameRef = React.createRef();

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

    getPhone() {
        return this.getParam(this.phoneRef.current.value, 'phone');
    }

    getFirstName() {
        return this.getParam(this.firstNameRef.current.value, 'firstName');
    }

    getLastName() {
        return this.getParam(this.lastNameRef.current.value, 'lastName');
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
                        <span className='header-status-content'>New Contact</span>
                    </div>
                </div>
                <div className='sidebar-page-content'>
                    <div className='new-chat-content'>
                        <div className='new-chat-title'>
                            <TextField
                                inputRef={this.firstNameRef}
                                error={error === 'firstName'}
                                className='new-chat-input'
                                variant='outlined'
                                fullWidth
                                label="First name"
                                defaultValue={''}
                            />

                            <TextField
                                inputRef={this.lastNameRef}
                                className='new-chat-input'
                                variant='outlined'
                                fullWidth
                                label="Last name"
                                defaultValue={''}
                            />

                            <TextField
                                inputRef={this.phoneRef}
                                error={error === 'phone'}
                                className='new-chat-input'
                                variant='outlined'
                                fullWidth
                                label="Phone number"
                                defaultValue={''}
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

NewContactParams.propTypes = {
    onClose: PropTypes.func
};

const enhance = compose(
    withSaveRef(),
    withTranslation(),
    withRestoreRef()
);

export default enhance(NewContactParams);
