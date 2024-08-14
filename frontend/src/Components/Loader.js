import React from 'react'
import { Spinner } from 'react-bootstrap'

const Loader = ({ animation = "border", varient, children }) => {
    return (
        <div className="d-flex justify-content-center mt-2">
            <Spinner animation={animation} >
                {children}
            </Spinner>
        </div>
    )
}

export default Loader
