import React from "react";

const Loader = () => {

    return(

        <div
        className="d-flex justify-content-center align-items-center"
        style={{height:"300px"}}
        >

            <div
            className="spinner-border text-primary"
            role="status"
            >

            </div>

        </div>

    );

};

export default Loader;