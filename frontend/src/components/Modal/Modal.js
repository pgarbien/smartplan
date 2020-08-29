import React, { useEffect, Fragment } from 'react';
import './Modal.css'

const Modal = (props) => {
  return (
      <Fragment>
        <div style={{width: "100vw", height: "100vh", position: "fixed", left: 0, top: 0}} onClick={() => {props.onCloseModal()}}></div>
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