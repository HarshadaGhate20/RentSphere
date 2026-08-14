import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {

    return(

        <div
        className="d-flex justify-content-center align-items-center"
        style={{height:"80vh"}}
        >

            <div className="text-center">

                <h1
                style={{
                    fontSize:"120px",
                    color:"#2563EB"
                }}
                >
                    404
                </h1>

                <h3>

                    Page Not Found

                </h3>

                <p>

                    Sorry, the page you're looking for doesn't exist.

                </p>

                <Link
                className="btn btn-primary"
                to="/"
                >

                    Back To Home

                </Link>

            </div>

        </div>

    );

};

export default NotFound;