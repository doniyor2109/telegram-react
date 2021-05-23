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
import { openUser} from '../../Actions/Client';
import TdLibController from '../../Controllers/TdLibController';
import './NewContact.css';
import NewContactParams from "./NewContactParams";

class NewContact extends React.Component {
    constructor(props) {
        super(props);

        this.addParticipantsRef = React.createRef();
        this.newContactParamsRef = React.createRef();

        this.state = {};
    }

    handleDone = async () => {
        const phone = this.newContactParamsRef.current.getPhone().replace(/[^\d+]/g, '');
        const firstName = this.newContactParamsRef.current.getFirstName();
        const lastName = this.newContactParamsRef.current.getLastName();
        if (!phone || !firstName) {
            return;
        }
        this.handleClose();
        const {user_ids: [userId]} = await TdLibController.send({
            '@type': 'importContacts',
            contacts: [
                {
                    '@type': 'contact',
                    phone_number: phone,
                    first_name: firstName,
                    last_name: lastName,
                    user_id: 0,
                    vcard: '',
                }
            ],
        });
        openUser(userId);
    };

    handleClose = () => {
        TdLibController.clientUpdate({
            '@type': 'clientUpdateNewContact',
            open: false
        });
    };

    render() {
        return (
            <>
                <SidebarPage open={true} onClose={this.handleClose}>
                    <NewContactParams
                        ref={this.newContactParamsRef}
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

NewContact.propTypes = {};

export default withTranslation()(NewContact);
