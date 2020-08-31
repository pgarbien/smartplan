import React, { Fragment } from 'react';
import './Modal.css';

const Modal = (props) => {
  return (
      <Fragment>
            <div className="modal-background" onClick={() => {props.onCloseModal()}}></div>
            <div className="modal">
                <div className="modal-header">
                    <span className="modal-title">{props.title}</span>
                    <div className="modal-close" onClick={() => { props.onCloseModal() }}>X</div>
                </div>
                <div className="modal-body">
                    {props.children}
                </div>
            </div>
        </Fragment>
  );
}

export default Modal;