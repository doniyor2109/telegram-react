/*
 *  Copyright (c) 2018-present, Evgeny Nadymov
 *
 * This source code is licensed under the GPL v.3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { withTranslation } from 'react-i18next';
import SidebarPage from './SidebarPage';
import NextIcon from '../../Assets/Icons/Back';
import TdLibController from '../../Controllers/TdLibController';
import './NewContact.css';
import ViewUsernamesParams from "./ViewUsernamesParams";
import UserStore from "../../Stores/UserStore";
import {NOTIFICATION_AUTO_HIDE_DURATION_MS} from "../../Constants";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "../../Assets/Icons/Close";
import {withSnackbar} from "notistack";
import {compose} from "../../Utils/HOC";
import {copy} from "../../Utils/Text";

class ViewUserNames extends React.Component {
    constructor(props) {
        super(props);

        this.addParticipantsRef = React.createRef();
        this.usernamesParams = React.createRef();

        this.state = {};
    }

    handleDone = async () => {
        const phones = this.usernamesParams.current.getPhones()
            .split('\n')
            .map((x) => x.replace(/[^\d+]/g, ''));
        if (!phones.length) {
            return;
        }
        const { user_ids } = await TdLibController.send({
            '@type': 'importContacts',
            contacts: phones.map((phone, index) => ({
                '@type': 'contact',
                phone_number: phone,
                first_name: `imported-${index}`,
                last_name: '',
                user_id: 0,
                vcard: '',
            })),
        });

        await TdLibController.send({
            '@type': 'removeContacts',
            user_ids,
        });

        const users = user_ids.map(id => UserStore.get(id));
        const usernames = users
            .map(user => user ?  user.first_name + ' ' + user.last_name : '')
            .join('\n');

        console.info(users);
        copy(usernames);
        this.handleScheduledAction("Usernames copied");

        this.handleClose();
    };

    handleScheduledAction = message => {
        const { enqueueSnackbar, closeSnackbar } = this.props;

        const snackKey = enqueueSnackbar(message, {
            autoHideDuration: NOTIFICATION_AUTO_HIDE_DURATION_MS,
            preventDuplicate: true,
            action: [
                <IconButton
                    key='close'
                    aria-label='Close'
                    color='inherit'
                    className='notification-close-button'
                    onClick={() => {
                        closeSnackbar(snackKey);
                    }}>
                    <CloseIcon />
                </IconButton>
            ]
        });
    };

    handleClose = () => {
        TdLibController.clientUpdate({
            '@type': 'clientUpdateViewUsernames',
            open: false
        });
    };

    render() {
        return (
            <>
                <SidebarPage open={true} onClose={this.handleClose}>
                    <ViewUsernamesParams
                        ref={this.usernamesParams}
                        onClose={this.handleClose}
                    />

                </SidebarPage>

                <div className='new-chat-bottom-button' onClick={this.handleDone}>
                    <NextIcon/>
                </div>
            </>
        );
    }
}

ViewUserNames.propTypes = {};

export default  compose(
    withSnackbar,
    withTranslation()
)(ViewUserNames);
