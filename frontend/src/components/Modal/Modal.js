import React, { Fragment } from 'react';
import '../../new_css/modal_css/Modal.css';

const Modal = (props) => {
  return (
        <Fragment>
            <div className="modal-background" onClick={() => {props.onCloseModal()}}></div>
            <div className="modal">
                <div className="modal-header">
                    <span className="modal-title">{props.title}</span>
                    <div style={ props.canClose ? {} : { display: "none" }} className="modal-close" onClick={() => { props.onCloseModal() }}>X</div>
                </div>
                <div className="modal-body">
                    {props.children}
                </div>
            </div>
        </Fragment>
  );
}

export default Modal;