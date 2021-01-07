import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormLoader } from '../basic/Loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ShouldRender from '../basic/ShouldRender';
import { closeModal } from '../../actions/modal';
import { deleteScheduledEvent } from '../../actions/scheduledEvent';
import { history } from '../../store';
import { User } from '../../config';
class DeleteSchedule extends Component {
    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyBoard);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyBoard);
    }

    handleKeyBoard = e => {
        switch (e.key) {
            case 'Escape':
                return this.props.closeThisDialog();
            case 'Enter':
                return this.handleDelete();
            default:
                return false;
        }
    };

    handleDelete = () => {
        const {
            deleteScheduledEvent,
            deleteError,
            closeModal,
            modalId,
            data,
        } = this.props;
        const { projectId, eventId, parentProjectId } = data;
        deleteScheduledEvent(projectId, eventId).then(() => {
            if (!deleteError) {
                closeModal({ id: modalId });

                const projectSlug = User.getCurrentProjectSlug()
                    ? User.getCurrentProjectSlug()
                    : '';
                return history.push(
                    `/dashboard/project/${projectSlug}/scheduledEvents`
                );
            }
        });
    };

    render() {
        const { isRequesting, closeThisDialog, deleteError } = this.props;
        return (
            <div className="ModalLayer-wash Box-root Flex-flex Flex-alignItems--flexStart Flex-justifyContent--center">
                <div
                    className="ModalLayer-contents"
                    tabIndex={-1}
                    style={{ marginTop: 40 }}
                >
                    <div className="bs-BIM">
                        <div className="bs-Modal bs-Modal--medium">
                            <div className="bs-Modal-header">
                                <div className="bs-Modal-header-copy">
                                    <span className="Text-color--inherit Text-display--inline Text-fontSize--20 Text-fontWeight--medium Text-lineHeight--24 Text-typeface--base Text-wrap--wrap">
                                        <span>Confirm Deletion</span>
                                    </span>
                                </div>
                            </div>
                            <div className="bs-Modal-content">
                                <span className="Text-color--inherit Text-display--inline Text-fontSize--14 Text-fontWeight--regular Text-lineHeight--24 Text-typeface--base Text-wrap--wrap">
                                    Are you sure you want to delete this
                                    scheduled event ?
                                </span>
                            </div>
                            <div className="bs-Modal-footer">
                                <div
                                    className="bs-Modal-footer-actions"
                                    style={{ width: 280 }}
                                >
                                    <ShouldRender
                                        if={!isRequesting && deleteError}
                                    >
                                        <div
                                            id="deleteError"
                                            className="bs-Tail-copy"
                                        >
                                            <div
                                                className="Box-root Flex-flex Flex-alignItems--stretch Flex-direction--row Flex-justifyContent--flexStart"
                                                style={{ marginTop: '10px' }}
                                            >
                                                <div className="Box-root Margin-right--8">
                                                    <div className="Icon Icon--info Icon--color--red Icon--size--14 Box-root Flex-flex"></div>
                                                </div>
                                                <div className="Box-root">
                                                    <span
                                                        style={{ color: 'red' }}
                                                    >
                                                        {deleteError}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </ShouldRender>
                                </div>
                                <div className="bs-Modal-footer-actions">
                                    <button
                                        className="bs-Button bs-DeprecatedButton bs-Button--grey btn__modal"
                                        type="button"
                                        onClick={closeThisDialog}
                                        id="cancelDeleteScheduleBtn"
                                    >
                                        <span>Cancel</span>
                                        <span className="cancel-btn__keycode">
                                            Esc
                                        </span>
                                    </button>
                                    <button
                                        id="deleteScheduleModalBtn"
                                        className="bs-Button bs-DeprecatedButton bs-Button--red btn__modal"
                                        type="button"
                                        onClick={this.handleDelete}
                                        disabled={isRequesting}
                                        autoFocus={true}
                                    >
                                        {!isRequesting && (
                                            <>
                                                <span>Delete</span>
                                                <span className="delete-btn__keycode">
                                                    <span className="keycode__icon keycode__icon--enter" />
                                                </span>
                                            </>
                                        )}
                                        {isRequesting && <FormLoader />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

DeleteSchedule.displayName = 'DeleteSchedule';

DeleteSchedule.propTypes = {
    closeThisDialog: PropTypes.func.isRequired,
    isRequesting: PropTypes.bool,
    deleteError: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.oneOf([null, undefined]),
    ]),
    closeModal: PropTypes.func,
    deleteScheduledEvent: PropTypes.func,
    modalId: PropTypes.string,
    data: PropTypes.object,
};

const mapStateToProps = state => {
    return {
        isRequesting: state.scheduledEvent.deletedScheduledEvent.requesting,
        deleteError: state.scheduledEvent.deletedScheduledEvent.error,
        modalId: state.modal.modals[0].id,
    };
};

const mapDispatchToProps = dispatch =>
    bindActionCreators({ closeModal, deleteScheduledEvent }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DeleteSchedule);
