import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import React from 'react';


function Template(props) {
    return (
        <>
            <div className="wrapper">
                <Sidebar/>
                <Navbar/>
                
                <div class="content-wrapper">
                    <section className='content mt-1'>
                    {props.children}
                    </section>
                </div>
            </div>
        </>
    );
}

export default Template;