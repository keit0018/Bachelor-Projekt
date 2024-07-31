import React from 'react';
import Modal from 'react-modal';
import '../assets/styles/ConsentModal.css';

Modal.setAppElement('#root');

//module for consent
const ConsentModal = ({ isOpen, onRequestClose, onProceed }) => {
  return (
    <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="Recording Consent"
    className="consent-modal"
    overlayClassName="consent-modal-overlay"
    >
    <h2>Recording Notice</h2>
    <p>This meeting will be audio and video recorded. When attending this meeting you agree on the collection and on the processing of your personal data in the audio and video recordings. Do you wish to proceed?</p>
    <div className="modal-buttons">
        <button className="consent-button" onClick={onProceed}>Proceed</button>
        <button className="consent-button" onClick={onRequestClose}>Exit</button>
    </div>
    </Modal>
  );
};

export default ConsentModal;